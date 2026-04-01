> http 模块用于创建 HTTP 服务器和发起 HTTP 客户端请求

### 一、基本概念

#### 1.1 引入方式

```js
// 基础引入
const http = require('http');
const https = require('https'); // HTTPS 版本

// Promise 封装（原生 http 模块不支持 Promise，需要手动封装）
```

#### 1.2 创建 HTTP 服务器

- `http.createServer((req, res) => {})`：创建 HTTP 服务；`req` 是请求对象，`res` 是响应对象。

- `req.method`：请求方法（如 `GET`、`POST`），常用于做路由分发判断。
- `req.url`：请求路径和查询字符串（如 `/get?a=1`），可配合 `url.parse()` 拆出 `pathname` 和 `query`。
- `req.on('data') / req.on('end')`：读取请求体数据流（常见于 `POST`）。
- `res.setHeader(name, value)`：设置响应头（如 `Content-Type`）。
- `res.statusCode`：设置响应状态码（如 `200`、`404`）。
- `res.end(data)`：结束响应并返回响应体。
- `server.listen(port, callback)`：监听端口并启动服务。

```js
const http = require('node:http'); // 引入 http 模块
const url = require('node:url'); // 引入 url 模块

// 创建 HTTP 服务器，并传入回调函数用于处理请求和生成响应
http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true); // 解析请求的 URL，获取路径和查询参数，传 true 是让 query 以对象格式输出

    if (req.method === 'POST') { // 检查请求方法是否为 POST
        if (pathname === '/post') { // 检查路径是否为 '/post'
            let data = '';
            req.on('data', (chunk) => {
                data += chunk; // 获取 POST 请求的数据
                console.log(data);
            });
            req.on('end', () => {
                res.setHeader('Content-Type', 'application/json'); // 设置响应头的 Content-Type 为 'application/json'
                res.statusCode = 200; // 设置响应状态码为 200
                res.end(data); // 将获取到的数据作为响应体返回
            });
        } else {
            res.setHeader('Content-Type', 'application/json'); // 设置响应头的 Content-Type 为 'application/json'
            res.statusCode = 404; // 设置响应状态码为 404
            res.end('Not Found'); // 返回 'Not Found' 作为响应体
        }
    } else if (req.method === 'GET') { // 检查请求方法是否为 GET
        if (pathname === '/get') { // 检查路径是否为 '/get'
            console.log(query.a); // 打印查询参数中的键名为 'a' 的值
            res.end('get success'); // 返回 'get success' 作为响应体
        }
    }
}).listen(98, () => {
    console.log('server is running on port 98'); // 打印服务器启动的信息
});
```

#### 1.3 发起 HTTP 请求（作为客户端）

- 基础 GET 请求

```js
const http = require('node:http');

http.get('http://localhost:98/get?a=123', (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('GET 响应:', data);
    });
});
```

- 基础 POST 请求

```js
const http = require('node:http');

const body = JSON.stringify({ name: 'baiyu', age: 20 });

const req = http.request(
    {
        hostname: 'localhost',
        port: 98,
        path: '/post',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
        },
    },
    (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('POST 响应:', data);
        });
    }
);

req.write(body); // 写入请求体
req.end(); // 发送请求
```

::: tip
`http.request` 和 `http.get` 区别

- `http.get` 是 `http.request` 的简化版，默认方法就是 `GET`，并且会自动调用 `req.end()`。
- `http.request` 更通用，可自定义 `method`、`headers`，也能手动写入请求体（`req.write()`）。
- 需要发送数据（如 JSON 表单）时，通常使用 `http.request`。

**结论**：POST 一般用 `http.request`，因为 POST 通常要带请求体。
:::



### 二、小总结

- 从这章节，你能学到

    ✅ 创建 HTTP/HTTPS 服务器

    ✅ 基本的路由处理

    ✅ 解析请求参数和 Body

    ✅ 发起 HTTP/HTTPS 请求

- 但还有很多知识是没有讲到的，比如

    ⚠️ 中间件架构（理解 Koa/Express 原理）

    ⚠️ 流（Stream）处理（大文件上传下载）

    ⚠️ WebSocket（实时通信）

    ⚠️ 集群模式（利用多核 CPU）

    ⚠️ Redis 缓存（分布式缓存）

    ⚠️ 数据库连接池（MySQL/PostgreSQL）

    🔥 微服务架构（服务发现、负载均衡）

    🔥 gRPC（高性能 RPC）

    🔥 GraphQL（灵活的数据查询）

    🔥 消息队列（RabbitMQ/Kafka）

    🔥 容器化部署（Docker/K8s）

    🔥 监控和日志（APM、ELK）

- 这些属于业务性质的，后面会看 express、nest.js，学到就记录，没有就跳过，日后有需要在学习使用








