### 一、组合式函数

类似抽离公共方法，这个是将组件里可共享的逻辑抽离出来，类似 vue2 的 mixin

#### 1.1 基本使用

- 比如抽离一个鼠标跟踪器实例

::: code-group

```js [mouse.js]
import { ref, onMounted, onUnmounted } from 'vue'

// 按照惯例，组合式函数名以“use”开头
export function useMouse() {
  // 被组合式函数封装和管理的状态
  const x = ref(0)
  const y = ref(0)

  // 组合式函数可以随时更改其状态。
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // 一个组合式函数也可以挂靠在所属组件的生命周期上
  // 来启动和卸载副作用
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // 通过返回值暴露所管理的状态
  return { x, y }
}
```


```vue [index.vue]
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```
:::

- 更强的是，一个组合式函数可以调用一个或多个其他的组合式函数

- 可以将添加和清除 DOM 事件监听器的逻辑也封装进一个组合式函数中

::: code-group

```js [event.js]
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // 如果你想的话，
  // 也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

```vue [index.vue]
<script setup>
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
</script>
```
:::

#### 1.2 约定和最佳实践


**命名**

- 组合式函数约定用驼峰命名法命名，并以`use`作为开头

**输入参数**

- 即便不依赖于 ref 或 getter 的响应性，组合式函数也可以接收它们作为参数。但在其他开发者可能使用的情况下，最好处理一下输入参数是 ref 或 getter 而非原始值的情况。可以利用 `toValue()` 工具函数来实现


```js
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  // 如果 maybeRefOrGetter 是一个 ref 或 getter，
  // 将返回它的规范化值。
  // 否则原样返回。
  const value = toValue(maybeRefOrGetter)
}
```

**返回值**

- 一般在组合式函数中使用 `ref()` 而不是 `reactive()`，所以也推荐返回时始终是一个包含多个 ref 的普通的非响应式对象，这样在组件中被解构为 ref 之后可以维持响应性连接

```js
// x 和 y 是两个 ref
const { x, y } = useMouse()

// 如果非要想以对象属性的形式访问，可以使用 `reactive()` 包装一次，这样其中的 ref 会被自动解包
const mouse = reactive(useMouse())
// mouse.x 链接到了原来的 x ref
console.log(mouse.x)
```

**使用限制**

- 组合式函数只能在 `<script setup>` 或 `setup()` 钩子中被调用


### 二、自定义指令

- 一个自定义指令是一个**对象**。是由类似组件生命周期钩子的对象来定义


#### 2.1 指令钩子

- 一个指令的定义对象可以提供几种钩子函数，都是可选的


```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode) {}
}
```

- 钩子参数

    -   `el`：指令绑定到的元素。这可以用于直接操作 DOM。

    -   `binding`：一个对象，包含以下属性。

        -   `value`：传递给指令的值。例如在 `v-my-directive="1 + 1"` 中，值是 `2`。
        -   `oldValue`：之前的值，仅在 `beforeUpdate` 和 `updated` 中可用。无论值是否更改，它都可用。
        -   `arg`：传递给指令的参数 (如果有的话)。例如在 `v-my-directive:foo` 中，参数是 `"foo"`。
        -   `modifiers`：一个包含修饰符的对象 (如果有的话)。例如在 `v-my-directive.foo.bar` 中，修饰符对象是 `{ foo: true, bar: true }`。
        -   `instance`：使用该指令的组件实例。
        -   `dir`：指令的定义对象。

    -   `vnode`：代表绑定元素的底层 VNode。

    -   `prevVnode`：代表之前的渲染中指令所绑定元素的 VNode。仅在 `beforeUpdate` 和 `updated` 钩子中可用


举个例子


```js
<div v-example:foo.bar="baz">

// binding 对象如下
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* `baz` 的值 */,
  oldValue: /* 上一次更新时 `baz` 的值 */
}
```

#### 2.2 基本使用

- 在 `<script setup>` 中，任何以 `v` 开头的驼峰式命名的变量都可以当作自定义指令使用


```js
<script setup>
// 在模板中启用 v-highlight
const vHighlight = {
  mounted: (el) => {
    el.classList.add('is-highlight')
  }
}
</>

<template>
  <p v-highlight>This sentence is important!</p>
</template>
```

- 但一般情况下，会单独在一个文件中写指令，然后在全局引入注册或组件里局部引入


```js
const app = createApp({})

// 全局注册，使 v-highlight 在所有组件中都可用
app.directive('highlight', {
  /* ... */
})
```

#### 2.3 简化形式

- 有些情况，写自定义指令时会发现没有写钩子函数，因为当需要在 `mounted` 和 `updated` 上实现相同的行为，除此之外并不需要其他钩子时，可以简化成**一个函数**来定义


```js
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})
```

#### 2.4 在组件上使用

- 组件上使用时，和透传 attributes 类似，绑定在组价的根节点上

- 虽类似，但有区别，当有多个根节点时，指令会报错，它也不能通过 `v-bind="$attrs"` 来传递给一个不同的元素


### 三、插件

#### 3.1 定义

- 插件 (Plugins) 是一种能为 Vue 添加全局功能的工具代码，一个插件可以是一个拥有 `install()` 方法的对象，也可以直接是一个安装函数本身


```js
const myPlugin = {
  install(app, options) {
    // 配置此应用
  }
}
```

插件没有严格定义的使用范围，但是插件发挥作用的常见场景主要包括以下几种：

1.  通过 `app.component()` 和 `app.directive()` 注册一到多个全局组件或自定义指令。
2.  通过 `app.provide()` 使一个资源可被注入进整个应用。
3.  向 `app.config.globalProperties` 中添加一些全局实例属性或方法
4.  一个可能上述三种都包含了的功能库 (例如 vue-router)。

#### 3.2 编写一个插件


- plugins/i18n.js

```js
export default {
  install: (app, options) => {
    // 注入一个全局可用的 $translate() 方法
    app.config.globalProperties.$translate = (key) => {
      // 获取 `options` 对象的深层属性
      // 使用 `key` 作为索引
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

- 注册使用


```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```





























