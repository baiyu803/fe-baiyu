### 一、基本使用


- url 模块 = 专门解析、拼接网址的工具

    - 解析一个URL，拿到：协议、域名、端口、路径、查询参数、哈希

    - 拼接、组装 URL

    - 在 http 服务里解析前端请求地址比用

- 它有两种使用方式：

    - 直接调用方法 `url.parse()`，目前基本不用了

    - 创建一个 URL 对象，然后调用方法（最常用）


```js
const { URL } = require('url');

const url = new URL('http://localhost:3000/user/list?name=jack&age=20#hash');

url.protocol    // 'http:'
url.hostname    // 'localhost'
url.port        // '3000'
url.pathname    // '/user/list'    ← 写 http 服务最常用
url.search      // '?name=jack&age=20'
url.searchParams // URLSearchParams 对象，取参数超方便
url.hash        // '#hash'

url.searchParams.get('name')  // 'jack'
url.searchParams.get('age')   // '20'
url.searchParams.has('age')   // true
```

- 它也可以用来修改 url 


```js
const myUrl = new URL('https://example.com/path/page?name=old#old-hash');

// 修改各个部分
myUrl.protocol = 'http:';
myUrl.hostname = 'new-example.com';
myUrl.port = '8080';
myUrl.pathname = '/new-path/index.html';
myUrl.search = '?new=value';
myUrl.hash = '#new-hash';

console.log(myUrl.href);
// 'http://new-example.com:8080/new-path/index.html?new=value#new-hash'

// 修改查询参数
myUrl.searchParams.set('name', '张三');
myUrl.searchParams.append('tags', 'javascript');
myUrl.searchParams.delete('old');

console.log(myUrl.href);
// 'http://new-example.com:8080/new-path/index.html?new=value&name=%E5%BC%A0%E4%B8%89&tags=javascript#new-hash'
```
















