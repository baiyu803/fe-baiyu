### 一、介绍

- qiankun 是一个基于 `single-spa` 的微前端实现库，旨在帮助大家能更简单、无痛的构建一个生产可用微前端架构系统。

#### 1.1 什么是微前端

- 微前端是一种多个团队通过独立发布功能的方式来共同构建现代化 web 应用的技术手段及方法策略。


- 微前端架构具备以下几个核心价值：

  - 技术栈无关：主框架不限制接入应用的技术栈，微应用具备完全自主权

  - 独立开发、独立部署：微应用仓库独立，前后端可独立开发，部署完成后主框架自动完成同步更新

  - 增量升级：在面对各种复杂场景时，我们通常很难对一个已经存在的系统做全量的技术栈升级或重构，而微前端是一种非常好的实施**渐进式重构**的手段和策略

  - 独立运行时：每个微应用之间状态隔离，运行时状态不共享

#### 1.2 qiankun 的核心设计理念

- 简单

    - 只需要调用几个 qiankun 的 API 即可完成应用的微前端改造

    - HTML Entry 接入方式，让你接入微应用像使用 iframe 一样简单

- 解耦/技术栈无关


#### 1.3 为什么不是 iframe

- 在微前端架构中，iframe 是一个经常被使用的容器，但是 iframe 有以下缺点：

    - url 不同步。浏览器刷新 iframe url 状态丢失、后退前进按钮无法使用。

    - UI 不同步，DOM 结构不共享。想象一下屏幕右下角 1/4 的 iframe 里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器 resize 时自动居中..
    - 全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，主应用的 cookie 要透传到根域名都不同的子应用中实现免登效果。
    - 慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。


### 二、快速上手


- 直接看项目实践就行，[原文档查看](https://qiankun.umijs.org/zh/guide/getting-started)

- 倒是有一点，可以看看，微应用不管是使用 `qiankun`依赖，还是 `vite-plugin-qiankun` 依赖，都要导出 `bootstrap、mount、unmount` 三个生命周期钩子，以供主应用在适当的时机调用

```js
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  ReactDOM.render(<App />, props.container ? props.container.querySelector('#root') : document.getElementById('root'));
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container ? props.container.querySelector('#root') : document.getElementById('root'),
  );
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props);
}
```


### 三、项目实践

- 这一章节最适合新手无脑跟着操作，直接看文档即可，[立即查看](https://qiankun.umijs.org/zh/guide/tutorial)

- 需要注意的是，这篇文档的主应用和微应用都不是 vite，而是 webpack，所以需要做两件事情

- 一是在 src 目录新增 public-path.js 文件，并在入口文件 main.js 中引入

```js
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

- 二是修改 webpack 配置，在 webpack.config.js 中添加

```js
const packageName = require('./package.json').name;

module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    chunkLoadingGlobal: `webpackJsonp_${packageName}`,
  },
};
```

- webpack 4 和 webpack 5 的配置不同，具体可以参考[快速上手文档](https://qiankun.umijs.org/zh/guide/getting-started#2-%E9%85%8D%E7%BD%AE%E5%BE%AE%E5%BA%94%E7%94%A8%E7%9A%84%E6%89%93%E5%8C%85%E5%B7%A5%E5%85%B7)















