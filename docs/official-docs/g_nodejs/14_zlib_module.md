### 一、基础

- `zlib` 专门做数据压缩/解压，最常用的格式是 gzip、deflate

- 它完全基于 stream 实现，本质上是一个**转换流**，和前面讲的 Transform 用法基本一样

- 最常用 API：

    - 压缩：`zlib.createGzip()`，生成 .gz
    - 解压：`zlib.createGunzip()`，解开 .gz


```js
const zlib = require('zlib');
const fs = require('fs');

// 源文件 → 压缩 → 目标 .gz 文件
fs.createReadStream('large-file.txt')
  .pipe(zlib.createGzip()) // 压缩转换流
  .pipe(fs.createWriteStream('large-file.txt.gz'))
  .on('finish', () => {
    console.log('✅ 文件压缩完成');
  })
  .on('error', (err) => {
    console.log('压缩失败', err);
  });

// .gz 文件 → 解压 → 原文件
fs.createReadStream('large-file.txt.gz')
  .pipe(zlib.createGunzip()) // 解压转换流
  .pipe(fs.createWriteStream('large-file.txt'))
  .on('finish', () => {
    console.log('✅ 文件解压完成');
  });
  
```








