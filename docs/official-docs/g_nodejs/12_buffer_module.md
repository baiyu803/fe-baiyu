> Buffer 是**二进制数据的专属容器**，前面讲的 stream、crypto 模块的底层数据载体——可以说，没有 Buffer，就用不了流和加密

### 一、基础

- Node.js 处理文件、加密、网络流、图片视频，统一用 `Buffer`，Buffer 就是二进制数据的临时存储盒

- Buffer 是 Node.js 原生提供的全局对象，可以直接使用，**不需要 require 导入**

- Buffer 存储的是二进制字节，一个汉字 3 个字节，一个英文 1 个字节

- 编码格式，必记的 3 个

    - `utf8`：默认，普通文本

    - `hex`：16进制，crypto 加密签名常用

    - `base64`：网络传输、图片转码常用


### 二、四大核心用法

#### 2.1 创建 Buffer

- Node.js 废弃了不安全的 new Buffer()，只用下面两个

```js
// 1. Buffer.from()：从 字符串/数组 创建 Buffer（最常用）
const buf1 = Buffer.from('hello前端'); // 字符串转Buffer
const buf2 = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f]); // 字节数组转Buffer

// 2. Buffer.alloc(size)：创建指定长度的空Buffer（填0，安全）
const buf3 = Buffer.alloc(10); // 创建10字节的空Buffer

// 分别对应
// <Buffer 68 65 6c 6c 6f e5 89 8d e7 ab af>
// <Buffer 68 65 6c 6c 6f>
// <Buffer 00 00 00 00 00 00 00 00 00 00>
```

#### 2.2 Buffer 与字符串互转

```js
// 字符串 → Buffer
const str = '我是前端开发者';
const buf = Buffer.from(str, 'utf8'); // utf8（默认可省略）

// Buffer → 字符串（核心：指定编码）
console.log(buf.toString());    // 默认utf8，原文：我是前端开发者
console.log(buf.toString('hex'));     // 16进制（crypto加密用）
console.log(buf.toString('base64'));  // base64（网络传输用）
```

#### 2.3 查看 Buffer 内容

```js
const buf = Buffer.from('test');
console.log(buf); // <Buffer 74 65 73 74>  直接打印二进制
console.log(buf.length); // 4 （字节长度）
```

#### 2.4 拼接 Buffer

```js
const buf1 = Buffer.from('前端');
const buf2 = Buffer.from('开发者');
const buf3 = Buffer.concat([buf1, buf2]);
console.log(buf3.toString()); // 前端开发者
```










