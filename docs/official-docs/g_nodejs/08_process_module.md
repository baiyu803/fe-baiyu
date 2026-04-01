> process 就是 Node.js 进程本身，可以把它理解成：当前这个 js 脚本的“运行时宿主”

- process.env：环境变量

```js
console.log(process.env.NODE_ENV);
console.log(process.env.PORT);

// 设置环境变量
process.env.MY_VAR = 'my-value';
console.log(process.env.MY_VAR);
```

- process.argv：命令行参数

- process.cwd()：当前工作目录

- process.exit()：退出进程

- process.nextTick()：异步任务调度

- process.on()：监听事件

- process.emit()：触发事件

- process.kill()：杀死进程

- process.platform：操作系统平台

- process.version：Node.js版本



::: tip
`process` 本身也是 `EventEmitter`

```js
// 程序正常退出
process.on('exit', () => {
  console.log('脚本要结束了');
});

// 未捕获的异常（全局兜底）
process.on('uncaughtException', (err) => {
  console.error('崩溃了', err);
  process.exit(1);
});
```
:::






