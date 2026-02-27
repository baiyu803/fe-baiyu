
### 一、注册

- 分为全局注册和局部注册

#### 1.1 全局注册

- 使用 Vue 实例的 `.component()` 方法


```js
import { createApp } from 'vue' 
import MyComponent from './App.vue'

const app = createApp({})
app.component('MyComponent', MyComponent)

//可以被链式调用
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

- 缺点：全局注册的组件，即使没有使用也会被打包，不会被自动移除(也叫“tree-shaking”)

### 1.2 局部注册

- 就是普通的组件内导入



### 二、props

#### 2.1 声明写法

- 基本用法：使用 `defineProps()` 宏来声明


```js
// 数组
const props = defineProps(['foo', 'msg'])
// 对象
const props = defineProps({

  propA: Number,

  propB: [String, Number],

  propC: {
    type: String,
    required: true
  },

  propD: {
    type: [String, null],
    required: true
  },

  propE: {
    type: Number,
    default: 100
  },
  // 对象类型的默认值
  propF: {
    type: Object,
    default: () => ({})
  },
  propF: {
    type: Object,
    default: () => ({a: 1})
  },
  propG: {
    type: Object,
    default: () => []
  },
  // 自定义类型校验函数
  // 在 3.4+ 中完整的 props 作为第二个参数传入
  propH: {
    validator(value, props) {
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 函数类型的默认值
  propI: {
    type: Function,
    default: () => {}
  }
  propI1: {
    type: Function,
    default: () => (value) => {
      return String(value).toUpperCase()
    }
  }
})
```

#### 2.2 使用 TypeScript 时的写法

- 类型声明 + `withDefaults` 宏


```js
// 先定义 props 的类型接口
interface Props {
  propA?: number
  propB?: string | number
  propC: string  // required: true
  propD: string | null  // required: true，且可为 null
  propE?: number
  propF?: Record<string, any>  // 对象类型
  propG?: any[]  // 数组类型（使用数组类型更准确）
  propH?: 'success' | 'warning' | 'danger'  // 使用字面量联合类型
  propI?: () => void  // 无参数无返回值的函数
  propI1?: (value: any) => string  // 接收参数并返回字符串的函数
}

// 使用 withDefaults 设置默认值
const props = withDefaults(defineProps<Props>(), {
  // propA: undefined,  // 没有默认值，可以省略
  propB: undefined,     // 没有默认值，可以显式写 undefined 或省略
  // propC 是必填的，不能有默认值
  // propD 是必填的，不能有默认值
  propE: 100,           // 基础类型直接赋值
  propF: () => ({ a: 1 }),  // 对象使用函数返回
  propG: () => [],      // 数组使用函数返回
  // propH 没有默认值，只有校验
  propI: () => {},      // 空函数默认值
  propI1: () => (value) => String(value).toUpperCase()  // 有行为的函数
})
```

#### 2.3 监听 props


```js
// 不起作用
watch(count, /* ... */)
// 正确写法
watch(() => props.count, (newValue, oldValue) => {});

watch([() => props.firstName, () => props.lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {});
```

### 三、事件

- 常用的数组写法


```js
const emit = defineEmits(['inFocus', 'submit'])
```

- 也可以对象写法


```js
const emit = defineEmits({
  submit(payload: { email: string, password: string }) {
    // 通过返回值为 `true` 还是为 `false` 来判断
    // 验证是否通过
  }
})
```

- 搭配 TypeScript 使用


```js
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

- 他也可以做事件校验

### 四、组件 v-model

#### 4.1 基本用法

- 从 Vue 3.4 开始，推荐的实现方式是使用 `defineModel()`


- `defineModel()` 返回的值是一个 ref。它可以像其他 ref 一样被访问以及修改，不过它能起到在父组件和当前变量之间的双向绑定的作用
    - 它的 `.value` 和父组件的 `v-model` 的值同步
    - 当它被子组件变更了，会触发父组件绑定的值一起更新



```js
// 父组件
<script setup>
import Child from './Child.vue'
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <Child v-model="msg" />
</template>
```

```js
// Child 组件
<script setup>
const model = defineModel()
</script>

<template>
  <span>My input</span> <input v-model="model">
</template>
```
- 和 3.4 之前的区别是，子组件不需要写 props、emit

- 可以通过给 `defineModel` 传递选项，来声明底层 prop 的选项


```js
// 使 v-model 必填
const model = defineModel({ required: true })

// 提供一个默认值
const model = defineModel({ default: 0 })
```

#### 4.2 v-model 的参数

- 将字符串作为第一个参数传递给 `defineModel()` 来支持相应的参数


```js
<MyComponent v-model:title="bookTitle" />

// MyComponent 组件
<script setup>
const title = defineModel('title', { required: true })
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

#### 4.3 多个 v-model 绑定


```js
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>

// UserName 组件
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

#### 4.4 自定义修饰符


```js
<UserName v-model:first-name.capitalize="first" v-model:last-name.uppercase="last" />

// UserName 组件
<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(firstNameModifiers) // { capitalize: true }，有这个对象，可以实现很多逻辑
console.log(lastNameModifiers) // { uppercase: true }
</script>
```

### 五、透传 Attributes

#### 5.1 Attributes 继承

- 透传就是在父组件中使用子组件时，一些属性，比如class、style、id、click事件，会自动绑定到子组件的根元素上

- vue 中可以使用 `inheritAttrs: false` 禁用 Attributes 继承


```js
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Click Me</button>
</div>

<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup 逻辑
</script>
```

- 禁用后，透传的 Attributes 可以直接用 `$attrs` 访问到。上面就是先禁用，然后绑定到 button 元素，防止自动绑定到 div 元素

#### 5.2 多根节点继承

- vue3 单组件可以有多个根节点，此时透传会报错，但可以显式绑定


```js
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

#### 5.3 在 JavaScript 中访问透传 Attributes

- 使用 `useAttrs()` API 来访问一个组件的所有透传 attribute



```js
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```


### 六、插槽 slot

#### 6.1 普通插槽

- 父组件不传内容时，会展示默认内容


```js
<button type="submit">
  <slot>
    Submit <!-- 默认内容 -->
  </slot>
</button>
```

- 作用域： 父组件传递的模版只能访问父组件的数据，子组件的 slot 元素也只能访问子组件的数据


#### 6.2 具名插槽

- 给 slot 加上 name 属性，就是具名插槽

```js
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
</div>
```
- 父组件使用：

```js
// 方式一
<BaseLayout>
  <template v-slot:header>
    <!-- header 插槽的内容放这里 -->
  </template>
  
  <!-- default 默认插槽的内容放这里 -->
</BaseLayout>

// 方式二
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>
</BaseLayout>
```

`v-slot` 有对应的简写 `#`，因此 `<template v-slot:header>` 可以简写为 `<template #header>`

#### 6.3 条件插槽

- 结合使用 `$slots` 属性与 v-if 来实现


```js
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>
  </div>
</template>
```

#### 6.4 动态插槽名

#### 6.5 作用域插槽

- 默认作用域插槽

```js
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>

<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

- 具名作用域插槽

具名作用域插槽的工作方式也是类似的，插槽 props 可以作为 `v-slot` 指令的值被访问到：`v-slot:name="slotProps"`


```js
<FancyList :api-url="url" :per-page="10">
  <template #item="{ body, username, likes }">
    <div class="item">
      <p>{{ body }}</p>
      <p>by {{ username }} | {{ likes }} likes</p>
    </div>
  </template>
</FancyList>
```

```js
// FancyList 组件
<ul>
  <li v-for="item in items">
    <slot name="item" v-bind="item"></slot>
  </li>
</ul>
```


### 七、依赖注入

- 解决组件嵌套过深，props 层层传递的问题


#### 7.1 provide 提供

- 在父组件提供

```js
<script setup>
import { provide } from 'vue'

const count = ref(0)

// provide(/* 注入名 */ , /* 值 */ )

provide('count', count)

// 提供修改数据的方法
provide('updateCount', (newValue) => {
  count.value = newValue
})
</script>
```

- 应用层 provide


```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
```

#### 7.2 inject 注入


```js
<script setup>
import { inject } from 'vue'

// 注入数据
const count = inject('count')
const updateCount = inject('updateCount')

// 使用注入的数据和方法
const handleClick = () => {
  updateCount(count.value + 1)
}
</script>
```

- 注入默认值，即子组件注入，但是父组件没有提供时，为了防止报错，提供默认值


```js
const value = inject('message', '这是默认值')
```


### 八、异步组件

- Vue 提供了 `defineAsyncComponent` 方法来实现，方法接收一个返回 Promise 的加载函数


```js
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

- 处理加载状态和错误


```js
<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent({
  // 加载函数
  loader: () => import('@/components/HeavyComponent.vue'),
  
  // 加载过程中显示的组件
  loadingComponent: {
    template: '<div class="loading">加载中...</div>'
  },
  
  // 加载失败时显示的组件
  errorComponent: {
    template: '<div class="error">加载失败，请刷新重试</div>'
  },
  
  // 加载延迟时间（毫秒），在延迟时间内显示 loadingComponent
  delay: 200,
  
  // 超时时间（毫秒），超时会显示 errorComponent
  timeout: 3000,
  
  // 是否可重试
  retry: true
})
</script>

<template>
  <AsyncComponent />
</template>
```






























