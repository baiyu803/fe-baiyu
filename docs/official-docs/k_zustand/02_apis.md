
### 一、create

- 最核心的 API，用于创建状态容器

```js
const useSomeStore = create(stateCreatorFn)
```

- `stateCreatorFn` 是一个接受 `set`、`get`、`store` 作为参数的函数，返回一个对象，对象的键值对就是状态和操作函数

- `create` 返回一个具有 `setState`、`getState`、`getInitialState`、`subscribe` 方法的 Hook函数

```jsx
import { create } from 'zustand' 

const useStore = create<StateType>()((set, get, store) => {
  return {
    // 状态字段
    state1: 初始值,
    state2: 初始值,
    // 操作状态的方法（action）
    action1: () => { /* 更新逻辑 */ },
    action2: (params) => { /* 更新逻辑 */ },
  }
})
```
::: tip
- 外层 `<StateType>()`：显式声明 store 的完整类型，配合 TypeScript 获得完整类型推导

- 为什么是两层括号

    - 这是 Zustand 推荐的「柯里化写法」，核心作用是：在使用中间件时，依然能正确推导出完整的类型。如果不用 TypeScript，也可以简写为 `create((set) => ({ ... }))`
:::

#### 1.1 `set` 状态更新器

- `set` 是唯一的状态更新入口，负责修改 store 中的数据，默认执行**浅拷贝**（只更新传入字段，其余字段保留）

- 三种调用方式

    - 对象式更新：直接传入新状态对象，适合不依赖旧状态的场景

    - 函数式更新：接受旧状态，返回新状态对象，适合依赖旧状态的场景

    - 全量替换（V5 新增）：默认 set 是浅合并，传入 `{ replace: true }` 可以实现全量替换

```jsx
set({ count: 0 })

set((state) => ({ count: state.count + 1 }))

set(newFullState, { replace: true })
```

#### 1.2 `get` 状态获取器

- `get` 用于同步读取当前最新的完整状态，读取操作不会触发任何订阅和重渲染

- 在 action 内部读取状态，进行计算或条件判断

```jsx
const useStore = create<State>()((set, get) => ({
  count: 10,
  
  doubleIncrement: () => {
    const current = get().count // 读取当前值
    set({ count: current + 2 })
  },

  // 调用同 store 内的其他 action
  resetAndLog: () => {
    set({ count: 0 })
    console.log('重置后的值：', get().count)
  }
}))
```

#### 1.3 `store` 状态容器对象

- 这个参数是当前 store 实例本身，使用较少


#### 1.4 返回值的双重身份

- 身份一：React 自定义 Hook。就是上面和入门里介绍的，直接在 React 组件中引入使用

- 身份二：原生 store 对象

    - 可在 React 组件之外使用。

```js
// 同步获取当前完整状态，不触发订阅，和 get() 效果一致
const token = useUserStore.getState().token

// 直接更新状态，用法和 set 完全一致，适合组件外更新
useFormStore.setState({ draft: null })

// 监听状态变化，执行回调函数
useUserStore.subscribe(
  (state) => state.token,
  (token, prevToken) => {
    axios.defaults.headers.Authorization = token ? `Bearer ${token}` : ''
  }
)

// 销毁 store，清除所有订阅
useStore.destroy()
```

##### 1.5 搭配中间件使用

- `create` 支持通过高阶函数的方式嵌套中间件，扩展持久化、调试、immer 等能力

```ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface UserState {
  user: { name: string } | null
  token: string | null
  setUser: (user: any, token: string) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        token: null,
        setUser: (user, token) => set({ user, token }),
        logout: () => set({ user: null, token: null }),
      })),
      { name: 'user-storage' }
    ),
    { name: 'UserStore' }
  )
)
```
> 执行顺序：从内到外依次包裹，immer → persist → devtools，最外层是 create

- devtools：集成 Redux DevTools，支持时间旅行调试

- persist：状态持久化到 localStorage 等存储介质

- immer：支持可变语法写不可变更新，简化深层数据修改



### 二、createStore

- 普通业务几乎不用，架构、特殊场景才会碰到

- 作用：常见**无 React 绑定**的纯 JS 状态容器，只返回 `getState / setState / subscribe` 等原始方法，不能直接当 Hook 使用

- 和 `create` 的关系：create 内部本质上就是 `createStore` + 一层 React Hook 封装

- 只有这些场景会用

    - SSR 服务端渲染

    - 非 React 环境：纯 JS 工具、Node.js 脚本等

    - 深度架构封装：自己封装自定义 Hook、定制中间件体系、多实例 store 工厂




### 三、createWithEqualityFn

- 极少使用，只有在极其特殊的定制化需求能用上

- 作用：创建 store 时，全局替换默认的相等比较规则（默认是 Object.is 严格相等，即 === 级别）

- [官网自行查看](https://zustand.docs.pmnd.rs/reference/apis/create-with-equality-fn)

### 四、shallow

- 高频使用

- 作用：一个浅比较工具函数，比较两个对象或数组第一层的值是否相等，忽略引用差异

- 不同版本使用差异

    - V4 写法：直接作为 Hook 的第二个参数传入

    - V5 写法：React 组件中推荐使用 `useShallow` Hook

        - V5 中原始的 shallow 函数仍然导出，但更多用于非 React 场景

```js
// v4
import { shallow } from 'zustand'
const { a, b } = useStore(selector, shallow)

// v5
import { useShallow } from 'zustand/react/shallow'
const { a, b } = useStore(useShallow(selector))
```


- 也就是 V5 中推荐使用 `useShallow` Hook，主要用于批量取多个状态字段

```jsx
import { useShallow } from 'zustand/react/shallow'
import { useUserStore } from '@/stores'

function UserHeader() {
  // 一次取出多个字段，浅比较值变化
  const { userInfo, logout, isLoggedIn } = useUserStore(
    useShallow((state) => ({
      userInfo: state.userInfo,
      logout: state.logout,
      isLoggedIn: state.isLoggedIn,
    }))
  )

  if (!isLoggedIn) return <span>请登录</span>
  return (
    <div>
      <span>{userInfo.name}</span>
      <button onClick={logout}>退出</button>
    </div>
  )
}
```




