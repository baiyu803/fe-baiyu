---
theme: cyanosis
highlight: vs2015
---

::: tip
笔记仅针对在组件的组合式 API 中使用 Pinia
:::

### 一、定义 Store 

- Store 是用 `defineStore()` 定义的，它的第一个参数要求是一个独一无二的名字，这个名字被用作 id ，用来连接 devtools。第二个参数可接受两类值：Setup 函数或 Option 对象


#### 1.1 Option Store

- 与 Vue 的选项式 API 类似，可以传入一个带有 `state`、`actions` 与 `getters` 属性的 Option 对象

```js
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    }
  }
})
```

- 可以认为`state` 是 store 的数据 (data)，`getters` 是 store 的计算属性 (computed)，而 `actions` 则是方法 (methods)。

#### 1.2 Setup Store

- 与 Vue 组合式 API 的 setup 函数类似，可以传入一个函数，该函数定义了一些响应式属性和方法，并且返回一个带有我们想暴露出去的属性和方法的对象


```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

- 在Setup Store 中：

    - ref() 就是 state 属性

    - computed() 就是 getters

    - function() 就是 actions


:::tip
Setup store 比 Option Store 更为灵活，因为可以像组合式函数那样自由组合，但一般不建议使用，会变得很复杂

也可以依赖于全局提供的属性，比如路由，也可以 inject 注入等。但这些都不建议返回，因为在组件中也可以引入全局的使用
:::


#### 1.3 从 Store 解构

- store 是一个用 `reactive` 包装的对象，这意味着

    - 不需要使用 .value

    - 解构需要借助特殊的方法，例如 `storeToRefs`，否则会失去响应式

```js
<script setup>
import { storeToRefs } from 'pinia'
const store = useCounterStore()

// `name` 和 `doubleCount` 都是响应式引用
// 下面的代码同样会提取那些来自插件的属性的响应式引用
// 但是会跳过所有的 action 或者非响应式（非 ref 或者 非 reactive）的属性
const { name, doubleCount } = storeToRefs(store)

// 名为 increment 的 action 可以被解构
const { increment } = store
</script>
```


### 二、State


#### 2.1 访问 State

```js
const store = useStore()

store.count++
```

#### 2.2 重置 State

- Option Store 和 Setup Store 有区别

- Option Store 有提供 `$reset()` 方法将 state 重置为初始值

```js
const store = useStore()

// $reset() 内部，会调用 state() 函数来创建一个新的状态对象
store.$reset()
```

- Setup Store 没有提供，需要自己创建

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  function $reset() {
    count.value = 0
  }

  return { count, $reset }
})
```

#### 2.3 更改 state


- 一共有三种方法，其中一种通过 action 后面记录，另外两种是：

    - 用 store.count++ 直接改变 store

    - 调用 `$patch` 方法


- 一般推荐 `$patch` 批量修改，不需要传递所有的 state 属性，只需要传想要修改的。有两种写法：

    - 传入对象

    - 传入函数（适用于原状态的复杂修改，比如数组的 splice、对象的深层修改）

```js
// 组件中使用 $patch
const changeStateByPatch = () => {
  // 写法1：传入对象，批量修改
  counterStore.$patch({
    count: counterStore.count + 5,
    name: '批量修改'
  })

  // 写法2：传入函数（推荐用于复杂修改）
  counterStore.$patch((state) => {
    state.count += 10
    // 复杂对象/数组修改（比如给数组添加元素）
    state.list = [...state.list, '新元素']
    // 深层对象修改
    state.user.info.age = 20
  })
}
```

::: tip
批量修改只会触发一次状态更新（相比多次直接修改，性能更好）
:::

#### 2.4 替换 state

- 通过给 store.$state 赋值一个新对象，直接覆盖整个 state

    - 如果属性没写全会出现丢失的情况

```js
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

userStore.$state = {
  name: '李四',
  age: 25,
}
```

- 官网说，实际上不能完全替换掉 store 的 state，因为那样会破坏其响应性。内部是调用 `$patch` 实现的

#### 2.5 订阅 state

- Pinia 设计了 `$subscribe` 方法，专门用来监听 state 的变化

```js
// 先导入并创建 store 实例
import { useCounterStore } from '@/stores/counter'
const counterStore = useCounterStore()

// 订阅 state 变更
const unsubscribe = counterStore.$subscribe((mutation, state) => {
  // mutation：包含变更的元信息（比如变更类型、store 名称等）
  // state：变更后的最新 state
  console.log('state 发生了变更：', mutation)
  console.log('最新的 state：', state)
}, { detached: false })

// 取消订阅（比如组件卸载时）
// unsubscribe()
```

- `$subscribe` 也接收第二个参数配置项

    - `detached: true`：订阅不会随组件卸载而取消（默认 false，组件卸载自动取消）

    - `flush: 'post'`：回调在 DOM 更新后执行（默认 sync 同步执行）


### 三、Getter

- 类似于计算属性，在 `getters` 中定义

- 推荐使用箭头函数，并且它接收 `state` 作为第一个参数

- getter 之间可以相互调用，通过 `this` 访问其他 getter，弹药注意必须定义返回值类型

- 也可以直接访问其他 store 的 getter

::: code-group
```js [counter.js]
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // 自动推断出返回类型是一个 number
    doubleCount(state) {
      return state.count * 2
    },
    // 返回类型**必须**明确设置
    doublePlusOne(): number {
      // 整个 store 的 自动补全和类型标注 ✨
      return this.doubleCount + 1
    },
  },
})
```
```js []
import { useCounterStore } from './counter'

export const useStore = defineStore('main', {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      const useCounterStore = useCounterStore()
      return state.localData + useCounterStore.count
    },
  },
})
```
:::

- 理论上来说 getter 无法接收参数，但是可以在 getter 中返回一个函数来接收参数（和计算属性一样，这样会丢失缓存）

```js
export const useUserListStore = defineStore('userList', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```


### 四、Action

- 类似于方法，在 `actions` 中定义，用于处理业务逻辑和异步操作

- action 中可以直接通过 `this` 访问整个 store 实例，并进行修改。可以接收参数

- action 之间可以相互调用，也可以调用其他 store 的 action

```js
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    preferences: null,
    // ...
  }),
  actions: {
    async fetchUserPreferences() {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('User must be authenticated')
      }
    },
  },
})
```

### 五、插件


- 由于有底层 API 支持，Pinia store 可以扩展，插件可以添加以下功能：

    - 为 store 添加新的属性

    - 定义 store 时增加新的选项
    - 为 store 增加新的方法
    - 包装现有的方法
    - 改变甚至取消 action
    - 实现副作用，如本地存储
    - 仅应用插件于特定 store

- Pinia 插件是一个函数，它接收一个 context 对象作为参数，该 context 对象包含 app、store、options 等属性。通过 `pinia.use()` 方法将插件添加到 pinia 实例中

- 比如通过返回一个对象将一个静态属性添加到所有 store

```js
import { createPinia } from 'pinia'

// 创建的每个 store 中都会添加一个名为 `secret` 的属性。
// 在安装此插件后，插件可以保存在不同的文件中
function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// 将该插件交给 Pinia
pinia.use(SecretPiniaPlugin)

// 在另一个文件中
const store = useStore()
store.secret // 'the cake is a lie'
```

- 再比如在插件中调用 $subscribe

```js
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // 响应 store 变化
  })
  store.$onAction(() => {
    // 响应 store actions
  })
})
```


















