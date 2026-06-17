
### 一、为什么选择 Zustand

- **极简 API**：只需一个 `create` 函数即可创建全局状态，无需学习 action、reducer、dispatch 等概念

- **无需 Provider**： 不像 Redux/Context 需要层层包裹组件，创建后直接使用

- **高性能**：基于 `useSyncExternalStore` 实现，支持细粒度订阅，避免不必要的重渲染

- **体积小**

- **TypeScript 友好**：完善的类型推断，大部分场景无需手动标注类型

- **强大中间件**

### 二、安装与快速上手

- 以最新版本 v5 为例

#### 2.1 安装

```bash
npm install zustand
# 或
pnpm add zustand
yarn add zustand
```

#### 2.2 第一个 Store

- 创建 src/stores/useCounterStore.ts 文件

```ts
import { create } from 'zustand'

// 定义 Store 类型
interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  incrementBy: (amount: number) => void
}

// 创建 Store
export const useCounterStore = create<CounterState>((set, get, store) => ({
  count: 0,

  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  incrementBy: (amount) => set((state) => ({ count: state.count + amount })),
}))
```

#### 2.3 在组件中使用

```jsx
import { useCounterStore } from '@/stores/useCounterStore'

function Counter() {
  // 按需选择状态 —— 只有 count 变化时才重渲染
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </div>
  )
}
```

::: tip
**无需 Provider**：Zustand 的 store 是模块级单例，直接导入即可使用，不需要在应用外层包裹 Context Provider
:::

### 三、企业级项目多 Store 管理

- 有两种目录组织模式

#### 3.1 集中式管理

- 所有全局 Store 统一放在 src/stores 目录下，按模块拆分文件，然后在 index.js 文件统一导出

```text
src/
└── stores/
    ├── index.ts              # 统一导出入口（核心）
    ├── types.ts              # 公共类型、常量定义
    ├── middleware/           # 通用中间件封装
    │   └── index.ts
    ├── utils/                # 工具函数（全局重置等）
    │   └── reset.ts
    └── modules/              # 按业务领域拆分的 Store
        ├── user.store.ts
        ├── cart.store.ts
        ├── permission.store.ts
        └── ui.store.ts
```

#### 3.2 分布式管理

- Store 跟随业务模块走，不单独集中存放，实现业务自治

```text
src/
├── modules/
│   ├── user/                # 用户模块
│   │   ├── components/
│   │   ├── api.ts
│   │   └── stores/
│   │       └── user.store.ts
│   ├── cart/                # 购物车模块
│   │   └── stores/
│   │       └── cart.store.ts
│   └── common/              # 公共基础模块
│       └── stores/
│           └── ui.store.ts
└── stores/                  # 仅存放全局根级 Store
    └── index.ts
```

- 文件名一般设置为 `xxx.store.ts`


###  四、统一导出与组件引入

#### 4.1 统一导出

- 在 `src/stores/index.ts` 文件中统一导出所有 Store 文件

```jsx
// src/stores/index.ts
export { useUserStore } from './modules/user.store'
export { useCartStore } from './modules/cart.store'
export { usePermissionStore } from './modules/permission.store'
export { useUiStore } from './modules/ui.store'
```

#### 4.2 组件的三种引入方式

- 写法一：拆分选择器（性能最优，v5 推荐）

```jsx
import { useCartStore } from '@/stores'

function CartBadge() {
  // 只订阅 totalCount，只有该字段变化才重渲染
  const totalCount = useCartStore((state) => state.totalCount)
  const addItem = useCartStore((state) => state.addItem)

  return (
    <button onClick={() => addItem({ id: 1, name: '商品' })}>
      购物车：{totalCount}
    </button>
  )
}
```

- 写法二：批量取值 + `useShallow`

    - 同一个 Store 多个字段一次性取出，必须使用 `useShallow` 函数，否则会导致性能问题，会触发无限渲染

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
::: tip
**v5 强制规则**：所有返回对象 / 数组的选择器必须加 `useShallow`，避免无限渲染报错
:::

- 写法三：封装业务 Hook（企业级推荐）

    - 将状态选择、派生计算、通用逻辑封装成自定义业务 Hook

::: code-group
```jsx [useCart.ts]
// src/stores/hooks/useCart.ts
import { useShallow } from 'zustand/react/shallow'
import { useCartStore } from '../modules/cart.store'

export function useCart() {
  const { items, totalCount, totalPrice, addItem, removeItem, clear } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      totalCount: state.totalCount,
      totalPrice: state.totalPrice,
      addItem: state.addItem,
      removeItem: state.removeItem,
      clear: state.clear,
    }))
  )

  // 可在这里统一做参数校验、派生计算、埋点等逻辑
  const safeAddItem = (goods: any) => {
    if (!goods.id) return
    addItem(goods)
  }

  return { items, totalCount, totalPrice, addItem: safeAddItem, removeItem, clear }
}
```
```jsx [index.jsx]
import { useCart } from '@/stores/hooks/useCart'

function CartPanel() {
  const { items, totalPrice, clear } = useCart()
  return (
    <div>
      {items.map((item) => <div key={item.id}>{item.name}</div>)}
      <p>总价：{totalPrice}</p>
      <button onClick={clear}>清空</button>
    </div>
  )
}
```
:::

### 五、多 Store 之间的通信与联动

#### 5.1 直接调用（最常用）

- 在一个 Store 的 action 中，直接导入另一个 Store，通过 `getState()` 调用其方法或更新状态。

```jsx
// src/stores/modules/user.store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
// 导入其他 Store
import { useCartStore } from './cart.store'
import { usePermissionStore } from './permission.store'

interface UserState {
  userInfo: any
  token: string | null
  login: (userInfo: any, token: string) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        userInfo: null,
        token: null,

        login: (userInfo, token) => {
          set({ userInfo, token })
          // 登录后触发权限初始化
          usePermissionStore.getState().fetchPermissions()
        },

        logout: () => {
          // 清空当前 Store
          set({ userInfo: null, token: null })
          // 联动清空其他业务 Store
          useCartStore.getState().clear()
          usePermissionStore.getState().reset()
        },
      }),
      { name: 'app:user' }
    ),
    { name: 'UserStore' }
  )
)
```

::: tip
- 必须在 `action` 函数内部调用其他 Store，不能在模块顶层、Store 初始化回调中直接调用，否则可能因模块加载顺序导致另一个 Store 未初始化

- 使用 `getState()` 读取状态 / 调用方法，不会触发订阅，无性能损耗
:::

#### 5.2 订阅监听模式

- 通过 Store 的 `subscribe` 方法监听状态变化，自动触发其他 Store 的更新，彻底移除 Store 之间的 `import` 依赖，避免循环依赖

- 通常在应用入口统一初始化所有全局订阅

```jsx
// src/main.tsx 或 stores/init.ts
import { useUserStore } from '@/stores/modules/user.store'
import { usePermissionStore } from '@/stores/modules/permission.store'
import { useCartStore } from '@/stores/modules/cart.store'

// 监听 token 变化，自动同步权限和购物车状态
useUserStore.subscribe(
  (state) => state.token, // 只订阅 token 字段
  (token, prevToken) => {
    if (token && !prevToken) {
      // 登录成功，拉取权限
      usePermissionStore.getState().fetchPermissions()
    } else if (!token && prevToken) {
      // 登出，清空业务状态
      useCartStore.getState().clear()
      usePermissionStore.getState().reset()
    }
  }
)
```

#### 5.3 全局重置工具函数

```jsx
// src/stores/utils/reset.ts
import { useUserStore } from '../modules/user.store'
import { useCartStore } from '../modules/cart.store'
import { usePermissionStore } from '../modules/permission.store'

/**
 * 重置所有业务状态（登出/切换账号时调用）
 */
export function resetAllBusinessStores() {
  useUserStore.getState().reset()
  useCartStore.getState().clear()
  usePermissionStore.getState().reset()
  // UI 状态通常保留，按需添加
}
```

### 六、工程化统一封装

- 为了避免每个 Store 重复写中间件配置，可以通过封装统一创建函数实现标准化

#### 6.1 通用 Store 创建器

- 统一注入 devtools、persist 等中间件，统一配置规则，后续修改全局配置只需改一处

```ts
// src/stores/middleware/index.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { StateCreator } from 'zustand'

type DefaultMiddleware = [
  ['zustand/devtools', never],
  ['zustand/persist', never]
]

interface CreateStoreOptions {
  storeName: string          // DevTools 显示名称
  persistKey?: string        // 持久化存储 Key
  enablePersist?: boolean    // 是否开启持久化
}

/**
 * 通用 Store 创建器，统一封装中间件配置
 */
export function defineStore<T extends object>(
  stateCreator: StateCreator<T, [], DefaultMiddleware>,
  options: CreateStoreOptions
) {
  const { storeName, persistKey, enablePersist = false } = options

  let creator = devtools(stateCreator, {
    name: storeName,
    enabled: import.meta.env.DEV, // 开发环境才开启调试
  })

  if (enablePersist && persistKey) {
    creator = persist(creator, {
      name: persistKey,
      version: 1, // 持久化版本号，结构变更时升级用于迁移
    })
  }

  return create<T>()(creator)
}
```

#### 6.2 业务 Store 写法变化

```ts
// src/stores/modules/user.store.ts
import { defineStore } from '../middleware'

interface UserState {
  token: string | null
  userInfo: any
  setUser: (user: any, token: string) => void
  logout: () => void
}

export const useUserStore = defineStore<UserState>(
  (set) => ({
    token: null,
    userInfo: null,
    setUser: (userInfo, token) => set({ userInfo, token }),
    logout: () => set({ token: null, userInfo: null }),
  }),
  {
    storeName: 'UserStore',
    persistKey: 'app:user',
    enablePersist: true,
  }
)
```














