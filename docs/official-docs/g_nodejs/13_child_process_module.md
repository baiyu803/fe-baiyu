> child_process 作用是让 Node.js 能执行系统命令、调用外部程序、开启多进程干活


### 一、基础

- Node.js 是单线程的，遇到耗时任务、系统命令、CPU密集计算，会阻塞主线程

- `child_process` 能创建**子进程（独立线程）**，专门干脏活累活，不影响主程序

    - **执行前端工程化命令**：npm install/git pull/build 打包

    - **自动化脚本**：部署、文件备份、压缩、上传服务器

    - **调用系统功能**：创建文件夹、打开浏览器、读取系统信息

    - **处理密集计算**：图片压缩、大文件解析（不阻塞主线程）

    - **跨语言调用**：执行 Python/Shell 脚本（全栈必备）

- 四个核心 API

| API | 特点 | 适用场景 |
|---|---|---|
| `exec` | 简单，执行 shell 命令，返回结果 | 短命令（npm -v/dir） |
| `execFile` | 安全，执行可执行文件 | 推荐替代 exec（更安全）） |
| `spawn` | 流式输出，适合长耗时命令 | 大数据 / 长任务（npm install/git clone） |
| `fork` | 专属执行 Node 脚本，可通信 | Node 子进程通信、密集计算 |

- 推荐全部用异步方法，避免阻塞主线程


### 二、四大核心用法

#### 2.1 exec

- 执行 shell 命令，返回结果

- 一般执行短命令

```js
const { exec } = require('child_process');

// 执行系统命令：查看 Node 版本
// Windows: node -v | Mac/Linux: node -v
exec('node -v', (err, stdout, stderr) => {
  if (err) {
    console.log('命令执行失败：', err);
    return;
  }
  // stdout：命令成功输出的结果
  console.log('Node 版本：', stdout.trim());
  // stderr：错误信息
  if (stderr) console.log('错误：', stderr);
});

// 前端常用：查看 npm 版本
exec('npm -v', (err, stdout) => {
  console.log('npm 版本：', stdout.trim());
});
```

#### 2.2 execFile

- `exec` 有命令注入风险，生产环境用 `execFile` 更安全

```js
execFile(
  file,           // 可执行文件路径
  args,           // 参数数组（可选）
  options,        // 配置选项（可选）
  callback        // 回调函数（可选）
)

// 示例：带所有参数
execFile(
  'node',
  ['--version'],
  {
    cwd: '/path/to/work',     // 工作目录
    env: process.env,          // 环境变量
    timeout: 5000,             // 超时时间(ms)
    maxBuffer: 1024 * 1024,    // 最大输出缓冲(默认1MB)
    encoding: 'utf8',          // 编码
    shell: false,              // 是否使用shell
    windowsHide: true          // Windows隐藏窗口
  },
  (error, stdout, stderr) => {
    // 处理结果
  }
);
```

```js
const { execFile } = require('child_process');

// 执行可执行文件：node
execFile('node', ['-v'], (err, stdout) => {
  console.log('Node 版本（安全版）：', stdout.trim());
});

// 执行 npm 命令
execFile('npm', ['--version'], (err, stdout) => {
  console.log('npm 版本：', stdout.trim());
});

// 让文件可执行 + shebang (Unix/Linux/macOS)
// 在 script.js 第一行添加: #!/usr/bin/env node
// 然后 chmod +x script.js
execFile('./script.js', (error, stdout) => {
  console.log(stdout);
});
```

#### 2.3 spawn

- 长耗时任务神器

```js
const { spawn } = require('child_process');

// 执行命令：npm install（流式输出）
const child = spawn('npm', ['install', 'axios']);

// 流：实时输出日志（像终端一样打印）
child.stdout.on('data', (chunk) => {
  console.log('安装日志：', chunk.toString());
});

// 错误输出
child.stderr.on('data', (chunk) => {
  console.log('安装错误：', chunk.toString());
});

// 命令执行完成
child.on('close', (code) => {
  console.log('安装完成，退出码：', code); // code=0 代表成功
});
```

#### 2.4 fork

- 子进程通信，专门用来执行另一个 Node 脚本，主进程和子进程可以互相发消息

- 适合 CPU 密集计算

::: code-group
```js [主进程]
const { fork } = require('child_process');
// 开启子进程执行 child.js
const child = fork('./child.js');

// 给子进程发消息
child.send('主进程：你好子进程');

// 接收子进程消息
child.on('message', (msg) => {
  console.log('收到子进程消息：', msg);
});
```
```js [子进程]
// 接收主进程消息
process.on('message', (msg) => {
  console.log('收到主进程消息：', msg);
});

// 给主进程发消息
process.send('子进程：收到！我在干活');
```
:::














