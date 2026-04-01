> path 模块 = 专门处理文件路径的工具集，不操作真实文件，只处理字符串路径

### 一、最核心的两个变量

- `__dirname`：当前文件所在的文件夹的绝对路径

```text
/Users/xxx/project/src
```

- `__filename`：当前文件的绝对路径

```text
/Users/xxx/project/src/index.js
```

### 二、常用 API

- 官网文档有 15+ 个API，这里只列举 9 个常用的

#### 2.1 `path.join()`

- 拼接路径片段，自动处理 `/`  `../`  `./`

- 跨平台自动兼容 Windows `\` 和 Mac `/`


```js
const path = require('node:path')

// 处理相对路径
console.log(path.join(__dirname, 'dist', 'js', 'app.js'))
// /Users/xxx/project/dist/js/app.js

// 处理当前目录
console.log(path.join('/a', './b', 'c'));
// 输出: /a/b/c

// 处理上级目录
console.log(path.join('/a', '../b', 'c'));
// 输出: /b/c
```

#### 2.2 `path.resolve()`

- 生成绝对路径，**最终一定返回绝对路径**

- **从右向左处理**，遇到 `.` 或 `..` 则跳过，直到遇到一个绝对路径，遇到 `/` 就回到根目录

- 如果最终没有找到绝对路径，则返回当前工作目录的绝对路径

```js
const path = require('node:path');

// 从右向左处理
console.log(path.resolve('/foo/bar', './baz'));
// 输出: /foo/bar/baz

// 遇到绝对路径停止，前面的路径全部作废。
console.log(path.resolve('/foo/bar', '/tmp/file/'));
// 输出: /tmp/file

// 处理上级目录
console.log(path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif'));
// 输出: /当前工作目录/wwwroot/static_files/gif/image.gif

// 没有绝对路径时使用当前工作目录
console.log(path.resolve('a', 'b', 'c'));
// 输出: /当前工作目录/a/b/c
```


::: tip
`path.join()` 和 `path.resolve()` 的区别

| 特性 | `path.join()` | `path.resolve()` |
|--|--|--|
| 返回值类型 | 可能是相对路径或绝对路径 | 总是绝对路径 |
| 处理逻辑 | 从左到右简单拼接 | 从右到左解析，模拟 cd 命令 |
| 绝对路径 | 保留传入的绝对路径 | 遇到绝对路径会重置基础路径 |
| 主要用途 | 安全地拼接路径片段 | 将相对路径解析为绝对路径 |
:::



#### 2.3 `path.extname()`

- 获取文件后缀

```js
path.extname('app.js')      // .js
path.extname('index.html')  // .html
path.extname('style.css')   // .css
```

#### 2.4 `path.basename()`

- 获取路径最后一部分（文件名+后缀），可以接收第二参数，表示去掉的后缀

```js
path.basename('/foo/bar/baz/asdf/quux.html')
// 输出: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html')
// 输出: 'quux'
```

#### 2.5 `path.dirname()`

- 返回文件所在文件夹路径

```js
path.dirname('/a/b/c/app.js')  // /a/b/c
```

#### 2.6 `path.parse()`

- 解析路径成对象，一次性拿到路径所有信息：目录、文件名、后缀、名称

```js
path.parse('/home/user/dir/file.txt')
// 输出:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' 
//}
```

#### 2.7 `path.format()`

- 与 `path.parse()` 相反，将对象转换为路径

```js
path.format({
  root: '/',
  dir: '/home/user/dir',
  base: 'file.txt'
})
// 输出: '/home/user/dir/file.txt'
```

#### 2.8 `path.isAbsolute()`

- 判断是否为绝对路径

```js
path.isAbsolute('/foo/bar') // true
path.isAbsolute('/baz/..')  // true
path.isAbsolute('qux/')     // false
path.isAbsolute('.')        // false
```

#### 2.9 `path.sep`

- 获取平台路径分隔符

- Windows `\` ，Mac/Linux `/`

```js
path.sep  // 自动获取当前系统分隔符
```

































