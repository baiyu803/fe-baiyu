---
theme: cyanosis
highlight: vs2015
---


### 一、Pinia 是什么


- Pinia 是 Vue 的**专属**状态管理库，它允许你跨组件/页面共享状态。

#### 1.1 基础示例

::: code-group
```js [store/counter.js]
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  getters: {
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```
```vue [index.vue]
<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

counter.count++
// 自动补全！ ✨
counter.$patch({ count: counter.count + 1 })
// 或使用 action 代替
counter.increment()
</script>

<template>
  <!-- 直接从 store 中访问 state -->
  <div>Current Count: {{ counter.count }}</div>
</template>
```
:::


- 还有下面这种写法，与 setup() 类似

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```

- Pinia 还提供了类似 Vuex 的映射辅助函数，例如 `mapState` 和 `mapActions`，方便在 Options API 中使用。这里不做记录了


#### 1.2 对比 Vuex


- mutation 已被弃用

- 无需创建自定义的复杂安装包来支持 TypeScript，因为 Pinia 本身是用 TypeScript 编写的，提供了完整的类型推断

- 无过多的魔法字符串注入

- 无需要动态添加 Store，因为每个 Store 都是自动注册的

- 不再有嵌套结构的模块，因为 Pinia 提供了扁平的结构，但依然允许 Store 间的交叉组合

- 不再有可命名的模块



### 二、开始

- Vue 版本低于 2.7 的，需要安装 `@vue/composition-api` 插件，2.7 以上的只需要安装 pinia 即可

- 创建一个 pinia 实例

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```







