
### 一、useShallow

- 高频使用，给选择器包一层**浅比较逻辑**

- 前面多次介绍，就不重复了


### 二、useStore

- 日常开发用到的较少，属于底层核心

- 它是 Zustand 提供的通用订阅底层 Hook，是你用 `create` 生成的所有业务 store hook（比如 useUserStore、useCartStore）的底层实现

    - 用 create() 生成的每一个自定义 store hook，本质上都是 `useStore` 绑定了对应 store 实例后的「定制版本」

```tsx
import { useStore } from 'zustand'
import { useCounterStore } from '@/stores/counter.store'

function Demo() {
  // 底层写法：手动传入 store 实例 + 选择器
  const count = useStore(useCounterStore, (state) => state.count)

  // 等价于你日常的写法（已经提前绑定好了 store）
  // const count = useCounterStore(state => state.count)
}
```

### 三、useStoreWithEqualityFn

- 极小众，几乎不用

- useStore 的自定义比较函数版本，可以单次临时指定一个自定义的相等判断规则，代替默认的 Object.is 严格相等，只对当前这一次订阅生效，不影响整个 store

```tsx
import { useStoreWithEqualityFn } from 'zustand'
import isEqual from 'lodash/isEqual'

function Demo() {
  // 示例：单次使用深比较（仅演示，不推荐）
  const deepData = useStoreWithEqualityFn(
    someStore,
    (state) => state.deepNestedData,
    isEqual // 自定义相等函数
  )
}
```








