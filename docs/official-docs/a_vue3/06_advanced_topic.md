

### 一、渲染机制

- 从高层面的视角看，Vue 组件挂载时会发生如下几件事：


    - **编译**：Vue 模板被编译为**渲染函数**：即用来返回虚拟 DOM 树的函数

    - **挂载**：运行时渲染器调用渲染函数，遍历返回的虚拟 DOM 树，并基于它创建实际的 DOM 节点。这一步会作为响应式副作用执行，因此它会追踪其中所用到的所有响应式依赖

    - **更新**：当一个依赖发生变化后，副作用会重新运行，这时候会创建一个更新后的虚拟 DOM 树。运行时渲染器遍历这棵新树，将它与旧树进行比较，然后将必要的更新应用到真实 DOM 上去


![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/74910476d7a24164b01161a1140617d3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGC55-l5ZGA:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjY3NDQ3MzQ2MTA4ODYwMCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1773241010&x-orig-sign=Yxt0j5FDJqm3nixg%2B52B2vW739M%3D)


### 二、渲染函数 & JSX

- 在某些使用场景下，模版语法不能满足业务需要，这时就需要用到渲染函数

#### 2.1 基本使用

- Vue 也提供了 `h()` 函数使我们可以不使用模板编译，直接手写渲染函数

::: code-group
```js [index.js]
import { h } from 'vue'

const vnode = h(
  'div', // type
  { id: 'foo', class: 'bar' }, // props
  [
    /* children */
  ]
)
```

```js [举例]
// 除了类型必填以外，其他的参数都是可选的
h('div')
h('div', { id: 'foo' })

// attribute 和 property 都能在 prop 中书写
// Vue 会自动将它们分配到正确的位置
h('div', { class: 'bar', innerHTML: 'hello' })

// 像 `.prop` 和 `.attr` 这样的属性修饰符
// 可以分别通过 `.` 和 `^` 前缀来添加
h('div', { '.name': 'some-name', '^width': '100' })

// 类与样式可以像在模板中一样
// 用数组或对象的形式书写
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// 事件监听器应以 onXxx 的形式书写
h('div', { onClick: () => {} })

// children 可以是一个字符串
h('div', { id: 'foo' }, 'hello')

// 没有 props 时可以省略不写
h('div', 'hello')
h('div', [h('span', 'hello')])

// children 数组可以同时包含 vnodes 与字符串
h('div', ['hello', h('span', 'hello')])
```
:::


- 在 template 中使用


```vue
<script setup>
import { h } from 'vue'

const vnode = h('button', ['Hello'])
</script>

<template>
  <!-- 通过 <component /> -->
  <component :is="vnode">Hi</component>

  <!-- 或者直接作为元素 -->
  <vnode />
  <vnode>Hi</vnode>
</template>
```

#### 2.2 JSX/TSX

- JSX 是 JavaScript 的一个类似 XML 的扩展


```js
const vnode = <div>hello</div>

//在 JSX 表达式中，使用大括号来嵌入动态值
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

#### 2.3 渲染函数案例

[查看](https://cn.vuejs.org/guide/extras/render-function.html#render-function-recipes)


#### 2.4 函数式组件

[查看](https://cn.vuejs.org/guide/extras/render-function.html#functional-components)



