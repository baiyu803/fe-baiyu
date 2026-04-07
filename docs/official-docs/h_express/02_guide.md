
### 一、路由

> 上篇笔记已经讲到了大部分，这里做些补充

- 请求的路由路径可以是**字符串、字符串模式或正则表达式**，但是要注意 Express 目前流行的 5 版本中，字符串模式不在支持了，正则表达式在 4、5 版本中也有区别

#### 1.1 路由参数

- 路由参数是命名的 URL 段，用于捕获在 URL 中的位置指定的值。捕获的值填充到 req.params 对象中

```js
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)
})
```
``` text
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }
```

#### 1.2 响应方法

- 响应方法是指向客户端返回响应，并终止请求-响应循环

|方法|	描述|
|---|---|
|res.download()|	提示下载文件|
|res.end()|	终结响应处理流程|
|res.json()|	发送一个 JSON 格式的响应|
|res.jsonp()|	发送一个支持 JSONP 的 JSON 格式的响应|
|res.redirect()|	重定向请求|
|res.render()|	渲染视图模板|
|res.send()|	发送各种类型的响应|
|res.sendFile()|	以八位字节流的形式发送文件|
|res.sendStatus()| 设置响应状态码并将其字符串表示形式作为响应正文发送|

#### 1.3 app.route

- `app.route()` 可以链式定义同一路径的不同 HTTP 方法（GET、POST、PUT、DELETE 等）的路由，避免重复写路径

```js
app.route('/book')
  .get((req, res) => {
    res.send('Get a random book')     // 处理 GET 请求：获取一本书
  })
  .post((req, res) => {
    res.send('Add a book')            // 处理 POST 请求：添加一本书
  })
  .put((req, res) => {
    res.send('Update the book')       // 处理 PUT 请求：更新一本书
  })
```

### 二、中间件

- 中间件函数是可以访问应用请求-响应周期中的**请求对象（req）、响应对象（res）和 next 函数**的函数

    - next 函数是 Express 路由中的一个函数，当被调用时，它会在当前中间件之后执行中间件堆栈中的下一个中间件

- 中间件函数可以执行以下任务：

    - 执行任何代码

    - 对请求和响应对象进行更改

    - 结束请求-响应周期

    - 调用堆栈中的下一个中间件

    - 如果当前中间件函数没有结束请求-响应周期，则它必须调用 next()，以将控制权传递给下一个中间件函数。否则，请求将被挂起


#### 2.1 编写中间件

```js
const express = require('express')
const app = express()

const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}
const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(myLogger)
app.use(requestTime)

app.get('/', (req, res) => {
  let responseText = 'Hello World!<br>'
  responseText += `<small>Requested at: ${req.requestTime}</small>`
  res.send(responseText)
})

app.listen(3000, () => {
  console.log('Example app listening at http://localhost:3000')
})
```

- myLogger 和 requestTime 就是中间件

::: tip
中间件的调用严格按照顺序执行，如果中间件在路由之后，则不会执行
:::

#### 2.2 编写可配置中间件

::: code-group [my-middleware.js]
```js
module.exports = function (options) {
  return function (req, res, next) {
    // Implement the middleware function based on the options object
    next()
  }
}
```
```js [app.js]
const mw = require('./my-middleware.js')

app.use(mw({ option1: '1', option2: '2' }))
```
:::


#### 2.3 使用中间件

- 中间件有几种类型：应用级、路由级、错误处理、内置、第三方

##### 2.3.1 应用级中间件

- 使用 `app.use()` 和 `app.METHOD()` 函数将应用级中间件绑定到 应用对象 的实例

::: code-group
```js [例子1]
// 所有请求都会执行
app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})
```
```js [例子2]
// 只对 /user/:id 请求执行
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})
```
```js [例子3]
app.get('/user/:id', (req, res, next) => {
  res.send('USER')
})
```
```js [例子4]
app.get('/user/:id', (req, res, next) => {
  console.log('ID:', req.params.id)
  next()
}, (req, res, next) => {
  res.send('User Info')
})

// 路由处理程序可以定义多个，但是只有第一个生效
app.get('/user/:id', (req, res, next) => {
  res.send(req.params.id)
})
```
:::

##### 2.3.2 路由级中间件

- 路由级中间件的工作方式与应用级中间件相同，只是它绑定到 `express.Router()` 的实例

```js
const express = require('express')
const app = express()
const router = express.Router()

router.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

router.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})

router.get('/user/:id', (req, res, next) => {
  if (req.params.id === '0') next('router')
  else next()
}, (req, res, next) => {
  // render a regular page
  res.render('regular')
})

router.get('/user/:id', (req, res, next) => {
  console.log(req.params.id)
  res.render('special')
})

// mount the router on the app
app.use('/', router)
```

#### 2.3.3 错误处理中间件

- 错误处理中间件总是需要四个参数，即使不需要 `next` 对象

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

#### 2.3.4 内置中间件

- 以下中间件内置于 Express 中

| 中间件 | 描述 |
| --- | --- |
| express.static | 为 Express 提供静态资源 |
| express.json | 解析传入的请求体，仅解析 JSON 和仅处理 UTF-8 编码的请求体 |
| express.urlencoded | 解析传入的请求体，仅解析 URL-encoded 编码的请求体 |

#### 2.3.5 第三方中间件

- 第三方中间件是使用 `npm` 安装


### 三、覆盖 Express API

- 主要讲的是 Express 的一些 API 可以被自定义覆盖，[原文阅读](https://express.nodejs.cn/en/guide/overriding-express-api.html)


### 四、使用模版引擎

- 也可以叫做视图。在生成器生成的项目中，模版放在 views 文件夹下，默认使用的是 `jade` 模版引擎，但是目前推荐使用 `pug` 模版引擎

```bash
npm install jade
npm install pug
```

- 使用模块引擎

```js
const express = require('express')
const app = express()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
```

- index.jade 文件格式如下

```html
extends layout

block content
  h1= title
  p Welcome to #{title}
```

- 使用 `res.render` 渲染模版

```js
app.get('/', function (req, res) {
  res.render('index', { title: 'Express' })
})
```


### 五、错误处理

- 上面已经说了错误处理中间件，它只能处理 `next(err)` 抛出来的错误

    - 异步代码一定要用 try-catch 或 .catch() 来捕获错误并传递给 next() ，否则应用可能会崩溃

    - 路由中 throw 的同步错误，Express 会自动捕获并调用 next


### 六、数据库集成

- 添加将数据库连接到 Express 应用的功能只需为应用中的数据库加载适当的 Node.js 驱动程序

- 官网上的有些内容比较古老了，不需要看这部分


::: tip
Express 的 API 挺多的，直接[文档阅读](https://express.nodejs.cn/en/5x/api.html)
:::

















