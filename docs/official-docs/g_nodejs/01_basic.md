
::: tip
记录前先解决一个疑问，为什么 Nodejs 文档那么多内容，而前端只需要掌握几个核心模块即可？

- Node.js 从一开始就不是“前端工具链专用”的平台，它的目标是让 JavaScript 能够运行在各种服务器端场景中。官网文档覆盖了这些不同场景的所有能力

    - web服务器、命令行工具、操作系统交互、底层网络通信、硬件/嵌入式、桌面应用、物联网/边缘计算等等

- 简单来说：**Node.js 是一个通用平台，而前端开发只需要它的“Web 服务 + 工具链”子集**
:::

### 一、介绍

- `Nodejs`并不是`JavaScript`应用，也不是编程语言，它是`JavaScript`运行时环境，是开源、跨平台的

- `Nodejs`是构建在V8引擎之上的，V8引擎是由C/C++编写的，因此我们的Js代码需要有C/C++转化后再执行


### 二、package.json

- `npm`（全称 Node Package Manager）是 Node.js 的包管理工具，它是一个基于命令行的工具，用于帮助开发者在自己的项目中安装、升级、移除和管理依赖项


#### 2.1 常用 npm 命令

- `npm init`
- `npm install`
- `npm install <package-name>`：默认安装到生产环境
- `npm install <package-name> --save`：将包安装到生产环境
- `npm install <package-name> --save-dev`：将包安装到开发环境
- `npm install -g <package-name>`
- `npm update <package-name>`
- `npm uninstall <package-name>`
- `npm run <script-name>`
- `npm search <keyword>`
- `npm info <package-name>`
- `npm list`：列出当前项目中安装的所有包
- `npm outdated`：列出当前项目中需要更新的包
- `npm publish`
- `npm login`
- `npm logout`
- `npm config list`：查看当前 npm 配置
- `npm get registry`


### 三、npm install 原理

1. 首先安装的依赖都会存放在根目录的 node_modules，默认采用扁平化的方式安装，并且排序规则`.bin`第一个然后`@系列`，再然后按照首字母排序abcd等，并且使用的算法是广度优先遍历

2. 在遍历依赖树时，npm会首先处理项目根目录下的依赖，然后逐层处理每个依赖包的依赖

3. 在处理每个依赖时，npm会检查该依赖的版本号是否符合依赖树中其他依赖的版本要求，如果不符合，则会尝试安装适合的版本

#### 3.1扁平化安装
    
- 理想情况下，安装某个二级模块时，若发现第一层级有相同名称，相同版本的模块，便直接复用那个模块

- 非理想情况下，需要安装不同版本的模块，不能进行复用，会单独在一级模块下搞一层 node_modules


#### 3.2 npm install 后续流程
    
    
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d709a2070f04affa92a2e447ca8f9ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1512&h=403&s=206036&e=png&b=f2f2f4)


### 四、npm run 原理

```text
执行 npm run xxx
    ↓
1. 读取 package.json 中的 scripts 字段
    ↓
2. 找到对应的命令字符串
    ↓
3. 创建子 shell（命令行环境）
    ↓
4. 临时将 node_modules/.bin 加入 PATH
    ↓
5. 在子 shell 中执行命令字符串
    ↓
6. 返回执行结果（成功/失败）
```


### 五、npm 生命周期

```bash
"predev": "node prev.js",
"dev": "node index.js",
"postdev": "node post.js"
```

- 执行 `npm run dev` 命令的时候 `predev` 会自动执行 他的生命周期是在dev之前执行，然后执行dev命令，再然后执行`postdev`，也就是dev之后执行



### 六、模块系统

- Node.js 的模块系统是基于 CommonJS 规范实现的，核心机制包括

    - 三个核心对象：每个文件都是一个模块，自动拥有 `module`、`exports`、`require` 三个对象
    
    - 加载流程：require 会经历 `解析 → 加载 → 编译 → 缓存` 四个阶段。缓存机制是核心——模块首次加载后会被缓存，后续 require 直接返回缓存结果

    - 模块类型

        - 核心模块（如 fs、path）：编译在二进制文件中，优先级最高，加载速度最快

        - 第三方模块（如 express、lodash）：从 node_modules 目录加载，优先级次之

        - 自定义模块（如 ./a.js）：通过 require 加载，优先级最低

    - 解析规则：`require('./a')` 会依次尝试 a.js → a.json → a.node → a/index.js

    - 循环依赖：Node.js 会自动处理循环依赖，不会出现死循环，但会返回不完整的导出对象


::: tip
Node.js 12+ 支持 ES Moudle，通过 `type: "moudle"` 或 `.mjs` 文件启用，但 Commonjs 仍是主流。

不过目前 Vite 项目，大多推荐 ESM，即使也支持使用 Commonjs
:::


### 七、全局对象

- 与浏览器环境不同，Node.js 没有 `window` 对象，但有 `global` 对象（ECMAScript 2020 出现了一个`globalThis`全局变量，兼容两者）

- 全局对象的属性：

    - `process`：进程对象，包含进程信息、环境变量、命令行参数等

        - process.env：环境变量

        - process.argv：命令行参数

        - process.cwd()：当前工作目录

        - process.exit()：退出进程

        - process.nextTick()：异步任务调度

        - process.on()：监听事件

        - process.emit()：触发事件

        - process.kill()：杀死进程

        - process.platform：操作系统平台

        - process.version：Node.js版本

        - ...

    - `console`：控制台对象，包含输出、警告、错误等方法

    - `Buffer`：二进制缓冲区，用于处理二进制数据

    - `__dirname`：当前模块的目录名

    - `__filename`：当前模块的完整路径

    - ...

- 其实和浏览器环境差不多，没有 DOM 和 BOM 对象

::: tip
`__dirname` 和 `process.cwd()` 有什么区别？

- `__dirname` 是当前模块所在的目录路径（编译时确定），`process.cwd()` 是执行 node 命令时的工作目录（运行时确定）。例如：在 `/home/user/project` 执行 `node src/index.js`，`__dirname` 是 `/home/user/project/src`，`process.cwd()` 是 `/home/user/project`
:::


### 八、事件循环 Event Loop

- Node.js 的事件循环是单线程异步 I/O 的核心机制，它让 JavaScript 能处理大量并发操作

#### 8.1 事件循环的六个阶段（按顺序循环执行）

```text
  ┌───────────────────────────┐
┌─>│           timers          │  // setTimeout、setInterval
│  └─────────────┬─────────────┘
│  │     pending callbacks     │  // 系统级回调（如 TCP 错误）
│  └─────────────┬─────────────┘
│  │       idle, prepare       │  // 内部使用
│  └─────────────┬─────────────┘
│  │           poll            │  // I/O 回调，核心阶段
│  └─────────────┬─────────────┘
│  │           check           │  // setImmediate
│  └─────────────┬─────────────┘
│  │      close callbacks      │  // socket.on('close')
└──┴───────────────────────────┘
```

- timers：执行 setTimeout 和 setInterval 回调

- pending callbacks：执行系统操作的回调，如 TCP 错误

- idle, prepare：仅内部使用

- poll：I/O 回调，核心阶段

- check：执行 setImmediate 回调

- close callbacks：执行 socket.on('close') 回调



#### 8.2 宏任务和微任务

- 宏任务：setTimeout、setInterval、setImmediate、I/O

- 微任务：process.nextTick、Promise.then、Object.observe

- **执行规则**：上面一个阶段执行完后，会清空所有微任务队列，然后进入下一个阶段，循环往复


#### 8.3 注意两个点

- `setTimeout(fn, 0)` 和 `setImmediate`：在主模块中执行顺序不确定（受性能影响），但在 I/O 回调中 `setImmediate` 永远先执行

- `process.nextTick` 和 `Promise.then`：`process.nextTick` 先执行。因为 Node.js 的微任务队列优先级是：`nextTickQueue > promiseQueue`


::: tip
Node.js 事件循环和浏览器事件循环的区别：

- 浏览器：宏任务队列只有一个，一个一个执行，执行完一个就清空微任务

- Node.js：宏任务队列有6 个阶段队列，一批一批执行，执行完一整个阶段的所有任务，才清空微任务

除此外，就是 API 不同，浏览器没有 `setImmediate、process.nextTick`
:::

### 九、模块引入方式

- 后续将会介绍常用的 nodejs 模块

- 传统内置模块引入

```js
import path from 'path'
import http from 'http'
import os from 'os'
import process from 'process'

const fs = require('fs')
const path = require('path')
const process = require('process')
```

- 推荐内置模块引入方式

```js
import path from 'node:path'
import http from 'node:http'
import os from 'node:os'
import process from 'node:process'

const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')
```

- 为什么推荐使用 `node:` 前缀？

    - 因为 `node:` 前缀的模块，会优先从 `node_modules` 中查找，如果找不到，再从 `node` 内置模块中查找

    - 而 `node:` 前缀的模块，会优先从 `node` 内置模块中查找，如果找不到，再从 `node_modules` 中查找

- 这样就可以避免与第三方模块冲突，也更快更安全

::: tip
支持情况

- Node.js ≥ 14.18.0 / 16.0.0：原生支持 node: 前缀

- Node.js < 14.18.0：不支持，只能用 fs

- 现在绝大多数项目都可以放心用 node:fs
:::




























