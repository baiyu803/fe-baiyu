> crypto 是内置的加密模块，提供多种加密算法的实现。只需要掌握高频使用的加密、解密、随机数、哈希能力即可


### 一、基础

- 模块引入

```js
const crypto = require('crypto');

import crypto from 'crypto';
```


### 二、五大核心功能

- 使用频率从高到低排序

#### 2.1 哈希算法（最常用）

- 单向加密，无法解密，生成固定长度的字符串

- 常用算法：md5（快）、sha256（安全）

- 核心 API： `crypto.createHash(算法)` → `update(数据)` → `digest(编码)`

```js
const crypto = require('crypto');

// 1. MD5 哈希（快速，适合校验）
function md5(str) {
  return crypto.createHash('md5')
    .update(str) // 传入要加密的数据
    .digest('hex'); // 输出16进制字符串
}

// 2. SHA256 哈希（更安全，适合密码）
function sha256(str) {
  return crypto.createHash('sha256')
    .update(str, 'utf8') // 指定编码
    .digest('hex');
}

// 测试
console.log(md5('123456')); // e10adc3949ba59abbe56e057f20f883e
console.log(sha256('123456')); // 长哈希值 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
```
- 使用场景

    - 用户注册：把密码哈希后存数据库

    - 文件上传：生成文件 MD5 校验文件是否完整

    - 接口参数：简单签名防篡改

#### 2.2 HMAC 算法

- 带密钥的哈希，比普通哈希更安全。但也属于单向加密，无法解密

- 只有只有密钥的人才能生成/验证签名

- **前后端对接最常用的验签方式**

- 核心 API： `crypto.createHmac(算法, 密钥)` → `update(数据)` → `digest(编码)`

```js
const crypto = require('crypto');

// 生成 HMAC 签名（前端/后端通用）
function hmacSign(data, key) {
  return crypto.createHmac('sha256', key)
    .update(data)
    .digest('hex');
}

// 场景：前端传参给后端，生成签名防篡改
const params = 'uid=1001&money=100'; // 接口参数
const secretKey = 'my-frontend-key'; // 前后端约定的密钥
const sign = hmacSign(params, secretKey);

console.log('接口签名：', sign);
// 7a6497d2e6561d2afced4394700444ce0243b66662f28c0613e67279fe8dee01
```


#### 2.3 对称加密 AES

- 可逆加密，加密后能解密。前后端共用同一个密钥

- 必备知识点

    - 密钥（key）：16 位 / 24 位 / 32 位

    - 偏移量（iv）：16 位（随机更安全）

    - 编码：utf8（原文）、hex/base64（密文）

- 核心 API：`crypto.createCipheriv(算法, 密钥, iv)` → `update(原文, 编码)` → `final(编码)`

```js
// 加密解密代码示例
const crypto = require('crypto');

// 配置（前后端必须一致）
const algorithm = 'aes-128-cbc';
const key = crypto.scryptSync('my-password', 'salt', 16); // 生成16位密钥
const iv = Buffer.alloc(16, 0); // 16位偏移量

// 加密
function aesEncrypt(data) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// 解密
function aesDecrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 测试
const phone = '13800138000';
const encrypted = aesEncrypt(phone);
const decrypted = aesDecrypt(encrypted);

console.log('明文：', phone);
console.log('密文：', encrypted);
console.log('解密：', decrypted);
```


#### 2.4 非对称加密 RSA

- 更安全，一对密钥：公钥（公开）、私钥（保密）

    - 我理解就是前后端不共用同一密钥，后端生成一对 RSA 密钥对，公钥公开给到前端，后端自己绝密保管私钥

- 公钥加密，私钥解密；私钥签名，公钥验证

- 适合：高安全需求的登录、Token 传输

```js
const crypto = require('crypto');
const fs = require('fs');

// 生成 RSA 密钥对
function generateRSAKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // 密钥长度 2048 位（安全够用）
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem' // 常见的文本格式
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  });

  console.log('✅ 密钥对已生成：public.key / private.key');
  return { publicKey, privateKey };
}

// 公钥加密（前端用）
function rsaEncrypt(data, publicKey) {
  return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64');
}

// 私钥解密（后端用）
function rsaDecrypt(encrypted, privateKey) {
  return crypto.privateDecrypt(privateKey, Buffer.from(encrypted, 'base64')).toString();
}
```


#### 2.5 安全随机数

- 生成随机字节

```js
// 生成16位随机盐（密码加密必备）
const salt = crypto.randomBytes(16).toString('hex');
// d1e150b52bd90d764ad4e222ca3c2bac
```

- 生成 UUID，唯一标识

```js
const uuid = crypto.randomUUID();
// 00ee0d06-f956-40bd-a918-fb62871ce2e1
```







