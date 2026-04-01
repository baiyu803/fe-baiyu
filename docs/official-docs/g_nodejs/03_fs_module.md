> fs 是脱离浏览器，进入工程化、自动化、脚手架开发的核心模块。无论是写 webpack/vite 插件、自动化脚本、构建工具、接口服务，都离不开 fs 模块

### 一、引入方式

- fs 模块提供了三种 API 风格: **回调、同步、Promise**

#### 1.1 回调方式

```js
// 传统回调风格
const fs = require('node:fs');

fs.readFile('./file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});
```

#### 1.2 同步方式

- 增加了 `Sync`， fs 就会采用同步的方式运行代码，会阻塞下面的代码

```js
// 同步风格（阻塞）
const fs = require('node:fs');

try {
    const data = fs.readFileSync('./file.txt', 'utf8');
    console.log(data);
} catch (err) {
    console.error(err);
}
```

#### 1.3 Promise 方式（推荐）

- 有不同的导入方式，但使用时一样的

```js
const fs = require('fs').promises;
const fs = require('fs/promises');

import { promises as fs } from 'fs';
import fs from 'fs/promises';

async function readFile() {
    try {
        const data = await fs.readFile('./file.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
```

#### 1.4 混合使用（常用模式）

```js
// 同时引入多种风格
const fs = require('fs');
const fsPromises = require('fs/promises');

// 保留回调方式用于简单操作
fs.writeFileSync('./log.txt', '同步写入');

// 使用 Promise 方式用于异步操作
await fsPromises.readFile('./data.json', 'utf8');
```

### 二、常用 API

- 官网关于 fs 文件系统的介绍非常详细，对应的内容也很多，这里只介绍常用的 API

#### 2.1 `fs.readFile()`

- 读文件，接收三个参数，文件路径，文件内容，配置项（可以是对象，也可以是字符串），回调函数（同步、promise除外）

- 配置项：

    - encoding：编码格式，默认是 `utf8`

    - mode：文件权限，默认是 `0o666`

    - flag：文件操作标志，默认是 `w`，表示写入文件

    - signal：信号，用于取消写入操作

- 回调函数接收两个参数，错误对象和文件内容

```js
const fs = require('fs/promises');

// 异步读取（最常用）
async function readExample() {
    // 读取文本文件
    const text = await fs.readFile('./example.txt', 'utf8');
    console.log(text);
    
    // 读取二进制文件（图片等）
    const imageBuffer = await fs.readFile('./photo.jpg');
    console.log(imageBuffer); // <Buffer ...>
    
    // 流式读取大文件（避免内存溢出）
    const stream = require('fs').createReadStream('./large-file.log');
    stream.on('data', (chunk) => {
        console.log(`读取了 ${chunk.length} 字节`);
    });
}
```

::: info
`fs.createReadStream` 是 Node.js 文件系统 (fs) 模块 提供的流式读取文件的 API，专门用于高效读取大文件。

- 流式读取文件时，文件内容不会一次性加载到内存中，而是以流的形式逐块读取

- 基于事件驱动

    - data：每次读取到数据块时触发

    - end：读取完成时触发

    - error：读取过程中发生错误时触发

    - close：文件关闭时触发

```js
const fs = require('fs');

// 1. 创建可读流（异步，立即返回流对象）
const readStream = fs.createReadStream('./large-file.txt', {
  encoding: 'utf8',    // 编码格式（可选）
  highWaterMark: 64 * 1024 // 每次读取的块大小，默认64KB
});

// 2. 监听事件（异步触发）
readStream.on('data', (chunk) => {
  console.log('读取到一块数据：', chunk.length);
});

readStream.on('end', () => {
  console.log('文件读取完成');
});

readStream.on('error', (err) => {
  console.error('读取失败：', err);
});
```
:::

#### 2.2 `fs.writeFile()、fs.appendFile()`

- `fs.writeFile` 写文件，接收三个参数，文件路径，文件内容，配置项（可以是对象，也可以是字符串）

- `fs.appendFile` 追加文件内容

```js
const fs = require('fs').promises;

// 写入文件（覆盖）
await fs.writeFile('./output.txt', 'Hello World', 'utf8');

// 追加内容
await fs.appendFile('./log.txt', `\n新日志: ${new Date()}`);

// 创建写入流（适合大文件）
const writeStream = require('fs').createWriteStream('./output.log');
writeStream.write('第一行\n');
writeStream.write('第二行\n');
writeStream.end();

// 同步写入
require('fs').writeFileSync('./sync.txt', '同步写入内容');
```

#### 2.3 `fs.access()`

- 判断文件、文件夹是否存在

```js
const fs = require('fs/promises');

// 判断文件是否存在
const isFileExists = await fs.access('./test.txt');

// 判断文件夹是否存在
const isDirExists = await fs.access('./test');
```

#### 2.4 `fs.mkdir()`

- 创建文件夹

```js
// recursive: true 表示自动创建多层目录（超级常用）
await fs.mkdir('dist/a/b', { recursive: true })
```

#### 2.5 `fs.readdir()`

- 读取目录下的所有文件（遍历文件夹）

```js
const files = await fs.readdir('./')
console.log('当前目录所有文件：', files)
```

#### 2.6 `fs.rmdir()`

- 删除文件夹

```js
await fs.rmdir('dist')
```

#### 2.7 `fs.unlink()`

- 删除文件

```js
await fs.unlink('dist/a.txt')
```

#### 2.8 `fs.rename()`

- 重命名文件

```js
await fs.rename('dist/a.txt', 'dist/b.txt')
```

#### 2.9 `fs.stat()`

- 获取文件信息

```js
const stat = await fs.stat('test.txt')
console.log('是否是文件：', stat.isFile())
console.log('是否是文件夹：', stat.isDirectory())
```

#### 2.10 `fs.copyFile()`

- 复制文件

```js
await fs.copyFile('source.txt', 'target.txt')
```


::: tip
性能注意事项

- 优先使用 `Promise API`

- 大文件使用流：避免内存溢出

- 批量操作使用 `Promise.all`：提高并发性能

- 避免同步操作：在服务器环境中会阻塞事件循环

- 合理使用缓存：频繁读取的文件可以缓存在内存中

```js
// 批量操作示例
async function batchProcess(files) {
    const promises = files.map(file => 
        fs.readFile(file, 'utf8')
    );
    const contents = await Promise.all(promises);
    return contents;
}
```
:::




