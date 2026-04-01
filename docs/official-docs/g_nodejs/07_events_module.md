
### 一、介绍

- events 模块实现了发布-订阅模式，通过 `events.EventEmitter` 可以方便的实现所有类型的发布 - 订阅

- Node.js 里几乎所有异步 API，地层都是靠 events 模块实现的

    - 流

    - http 服务器

    - 子进程

    - 自定义事件

    - ... 

### 二、核心类：EventEmitter

- 最简单用法

```js
const EventEmitter = require('events');

// 创建一个事件发射器实例
const emitter = new EventEmitter();

// 1. 监听事件（类似 addEventListener）
emitter.on('sayHello', () => {
  console.log('Hello 事件触发了！');
});

// 2. 触发事件（类似 dispatchEvent）
emitter.emit('sayHello');

// 带参数的事件
emitter.on('userLogin', (username) => {
  console.log(username + ' 登录了');
});

emitter.emit('userLogin', '前端小哥');
```

- 常用方法：

| 方法 | 作用 |
| --- | --- |
| `.on(event, fn)` | 监听事件 |
| `.once(event, fn)` | 只监听一次 |
| `.emit(event)` | 触发事件 |
| `.off(event, fn)` | 移除监听 |
| `.removeAllListeners()` | 清空所有监听 |

::: tip
如果脚本有使用事件，必须监听 `error` 事件，否则会抛出异常并崩溃。error 事件是 Node.js 里唯一一种 “如果没人处理，就会崩溃进程” 的事件

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

// 必须监听 error 事件，否则会抛出异常并崩溃
emitter.on('error', (err) => {
    console.error('捕获到错误:', err.message);
});

```
:::


### 三、自定义事件

```js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on('event', () => {
  console.log('触发了一个事件！');
});

myEmitter.emit('event');
```

- 自定义事件主要是为了 封装 + 扩展，比如

::: code-group
```js [自定义]
class MyEmitter extends EventEmitter {
  // 这里可以写自己的方法！
  start() {
    console.log('开始');
    this.emit('start'); // 触发自己的事件
  }

  stop() {
    console.log('结束');
    this.emit('stop');
  }
}
```
```js [使用]
const my = new MyEmitter();

my.on('start', () => console.log('监听到开始'));
my.on('stop', () => console.log('监听到结束'));

my.start(); // 执行方法 + 触发事件
my.stop();
```
:::




















