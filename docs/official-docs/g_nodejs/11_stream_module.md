
### 一、基础

- 把数据比作水，流就是水管

    - 分段流动，不占满内存

- 四大流类型，可读流 `Readable`、可写流 `Writable`、转换流 `Transform`、双工流 `Duplex`。一般只需要记住前三个

- 绝大多数场景（文件 fs， 网络 path）直接用封装好的流，不用手动引入基础流

```js
// 基础流模块（极少直接用，一般用封装好的）
const stream = require('stream');
// 最常用：文件流（fs 模块基于 stream 封装）
const fs = require('fs');


// 转换流/压缩流（常用）
const { Transform } = require('stream');
const zlib = require('zlib');
```

- 流的核心 API：`pipe()` 管道

```js
可读流.pipe(可写流)
```


### 二、四大核心用法

#### 2.1 管道传输

- 一行代码完成文件拷贝，内存占用极低，支持无限大文件

```js
const fs = require('fs');

// 可读流：读取源文件
const readStream = fs.createReadStream('source.txt');
// 可写流：写入目标文件
const writeStream = fs.createWriteStream('target.txt');

// 管道：自动传输（核心！）
readStream.pipe(writeStream);
```

- 在看一个大文件压缩 demo

```js
const fs = require('fs');
const zlib = require('zlib');

// 压缩文件：source.txt → source.txt.gz
fs.createReadStream('source.txt')
  .pipe(zlib.createGzip()) // 压缩转换流
  .pipe(fs.createWriteStream('source.txt.gz'));

console.log('文件压缩中...');
```

#### 2.2 可读流 Readable

- 读取数据，监听 `data` 事件，分段接收数据

```js
const fs = require('fs');

// 创建可读流
const readStream = fs.createReadStream('source.txt', 'utf8');

// 分段读取数据（核心事件）
readStream.on('data', (chunk) => {
  // chunk = 数据片段（默认64KB）
  console.log('读取片段：', chunk);
});

// 读取完成
readStream.on('end', () => {
  console.log('读取完毕！');
});

// 错误处理
readStream.on('error', (err) => {
  console.log('读取失败：', err);
});
```

- 一定要对错误进行处理，否则程序出错会崩溃，前面 events 模块有讲到


#### 2.3 可写流 Writable

- 分段写入数据，适合持续输出，比如文件写入，sse 接口传输

```js
const fs = require('fs');

// 创建可写流
const writeStream = fs.createWriteStream('target.txt');

// 分段写入数据
writeStream.write('第一段数据\n');
writeStream.write('第二段数据\n');

// 写入完成
writeStream.end('最后一段数据');

// 完成事件
writeStream.on('finish', () => {
  console.log('写入完毕！');
});
```

#### 2.4 转换流 Transform

- 边读取、边加工、边写入

- webpack 编译代码就是这个原理

```js
const fs = require('fs');
const { Transform } = require('stream');

// 1. 创建转换流：把文本转大写
const upperTransform = new Transform({
  transform(chunk, encoding, callback) {
    // chunk：数据片段
    const upperChunk = chunk.toString().toUpperCase();
    // 推送加工后的数据
    this.push(upperChunk);
    callback();
  }
});

// 2. 链式管道：读 → 转换 → 写
fs.createReadStream('source.txt')
  .pipe(upperTransform)   // 转大写
  .pipe(fs.createWriteStream('upper.txt'));
```














