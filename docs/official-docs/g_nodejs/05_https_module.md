> https 和 http 模块的 API 几乎完全相同，本篇主要介绍一些区别

### 一、核心区别

- http：用于处理 HTTP 协议（明文传输，端口 80）

- https：用于处理 HTTPS 协议（加密传输，端口 443）


### 二、创建服务器时的区别

- https 需要证书

```js
const https = require('node:https');
const fs = require('node:fs');

// HTTPS 需要 SSL/TLS 证书
const options = {
    key: fs.readFileSync('./private.key'),   // 私钥
    cert: fs.readFileSync('./certificate.crt') // 证书
};

const httpsServer = https.createServer(options, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('HTTPS Server\n');
});

httpsServer.listen(443, () => {
    console.log('HTTPS 服务器运行在 https://localhost:443');
});
```

### 三、请求请求时的区别

- https 需要证书



### 四、实际场景

- 同事支持 HTTP 和 HTTPS，创建混合服务器

```js
const http = require('node:http');
const https = require('node:https');
const fs = require('node:fs');
const url = require('node:url');

// 共享的路由处理逻辑
function requestHandler(req, res) {
    const parsedUrl = url.parse(req.url, true);
    
    // 重定向 HTTP 到 HTTPS
    if (!req.socket.encrypted && req.headers.host) {
        // 如果用户访问 HTTP，重定向到 HTTPS
        const httpsUrl = `https://${req.headers.host}${req.url}`;
        res.writeHead(301, { 'Location': httpsUrl });
        res.end();
        return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <h1>${req.socket.encrypted ? 'HTTPS' : 'HTTP'} 连接</h1>
        <p>协议: ${req.socket.encrypted ? '加密' : '明文'}</p>
    `);
}

// HTTP 服务器（重定向到 HTTPS）
const httpServer = http.createServer((req, res) => {
    const httpsUrl = `https://${req.headers.host}${req.url}`;
    res.writeHead(301, { 'Location': httpsUrl });
    res.end();
});

// HTTPS 服务器（实际处理请求）
const httpsOptions = {
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt')
};

const httpsServer = https.createServer(httpsOptions, requestHandler);

httpServer.listen(80, () => {
    console.log('HTTP 服务器运行在 http://localhost:80 (重定向到 HTTPS)');
});

httpsServer.listen(443, () => {
    console.log('HTTPS 服务器运行在 https://localhost:443');
});
```


- 这里的 80 和 443 只是 HTTP/HTTPS 的默认端口，不是必须的，可以自己自定义端口号

- 如果不使用默认的，要注意访问时，需要在链接后面带上端口号（默认端口可以省略）
































































































）









