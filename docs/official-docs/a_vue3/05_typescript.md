### 一、模版中的 TypeScript

- 在使用了 `<script lang="ts">` 或 `<script setup lang="ts">` 后，`<template>` 在绑定表达式中也支持 TypeScript


```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- 出错，因为 x 可能是字符串 -->
  {{ x.toFixed(2) }}
</template>
```

- 可以使用内联类型强制转换解决此问题


```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```



### 二、TypeScript 与组合式 API


- 主要介绍使用 `<script setup>` 的情况



#### 2.1 为组件的 props 标注类型

- 运行时声明写法


```js
<script setup lang="ts">
const props = defineProps({
  foo: { type: string, required: true },
  bar: Number
})
</script>
```

- 基于类型声明写法：通过泛型参数来定义


```js
<script setup lang="ts">
const props = defineProps<{
    foo: string,
    bar?: number
}>()
</script>
```

- 也可以将 prop 类型移入一个单独的接口中：


```js
<script setup lang="ts">
interface Props {
    foo: string,
    bar?: number
}

const props = defineProps<Props>()
</script>
```

- 这也同样适用于`Props`从另一个源文件导入的情况


```js
<script setup lang="ts">
import type { Props } from './foo'

const props = defineProps<Props>()
</script>
```

::: tip
上面两种声明写法只能择一使用，不能同时使用
:::


- 当使用基于类型声明写法时，就失去了给 props 声明默认值的能力，可以通过 **响应式Props解构** 解决问题


```js
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```
- 在 3.4 及更低版本，响应式 Props 解构不会被默认启用。另一种选择是使用 `withDefaults` 编译器宏


```js
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

**复杂的 prop 类型**

- 基于类型的声明，一个 prop 可以像使用其他任何类型一样使用一个复杂类型


```js
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

- 对于运行时声明，可以使用 `PropType` 工具类型


```js
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

#### 2.2 为组件的 emits 标注类型

- 也可以通过运行时声明，或者类型声明进行


```js
<script setup lang="ts">
// 运行时
const emit = defineEmits(['change', 'update'])

// 基于选项
const emit = defineEmits({
  change: (id: number) => {
    // 返回 `true` 或 `false`
    // 表明验证通过或失败
  },
  update: (value: string) => {
    // 返回 `true` 或 `false`
    // 表明验证通过或失败
  }
})

// 基于类型
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: 可选的、更简洁的语法
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

#### 2.3 为 ref 标注类型

- ref 会根据初始化时的值推导其类型


```js
// 推导出的类型：Ref<number> 
const year = ref(2020)
```

- 如果想指定更复杂的类型，可以通过使用 `Ref` 这个类型


```js
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // 成功！
```

- 或者，在调用 `ref()` 时传入一个泛型参数，来覆盖默认的推导行为


```js
// 得到的类型：Ref<string | number>
const year = ref<string | number>('2020')
```

- 如果指定了泛型参数但是没有给出初始值，那么最后得到的是一个包含 understand 的联合类型


```js
// 推导得到的类型：Ref<number | undefined>
const n = ref<number>()
```

#### 2.4 为 reactive 标注类型

- `reactive()` 也会隐式地从它的参数中推导类型

- 要显式地标注变量的类型，可以使用接口


```js
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 指引' })
```

::: tip
不推荐使用 `reactive()` 的泛型参数，因为处理了深层次 ref 解包的返回值与泛型参数的类型不同
:::


#### 2.5 为 computed 标注类型

- `computed()` 会自动从其计算函数的返回值上推导出类型

- 也可以通过泛型参数显式指定类型


```js
const double = computed<number>(() => {
  // 若返回值不是 number 类型则会报错
})
```

#### 2.6 为事件处理函数参数标注类型

- 如果参数没有标注，会隐式的标注为 any 类型

```js
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

#### 2.7 为 provide/inject 标注类型


- 要正确地为注入的值标记类型，Vue 提供了一个 `InjectionKey` 接口，它是一个继承自 `Symbol` 的泛型类型


```js
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // 若提供的是非字符串值会导致错误

const foo = inject(key) // foo 的类型：string | undefined
```

- 上面可以看到，当使用字符串注入 key 时，注入值的类型可能是 undefined，可以提供默认值或者强制类型转换（强制转换的前提是，你确定该值始终被提供）


```js
const foo = inject<string>('foo', 'bar') // 类型：string

const foo = inject('foo') as string
```


#### 2.8 为模版引用标准类型

- 在 Vue3.5 中，在单文件组件中由 `useTemplateRef()` 创建模版引用


```js
const el = useTemplateRef<HTMLInputElement>('el')
```


#### 2.9 为组件模版引用标注类型


```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

type FooType = InstanceType<typeof Foo>
type BarType = InstanceType<typeof Bar>

const compRef = useTemplateRef<FooType | BarType>('comp')
</script>

<template>
  <component :is="Math.random() > 0.5 ? Foo : Bar" ref="comp" />
</template>
```

- 如果组件的具体类型无法获得，或者并不关心组件的具体类型，那么可以使用 `ComponentPublicInstance`。这只会包含所有组件都共享的属性，比如 `$el`


```js
import { useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = useTemplateRef<ComponentPublicInstance>('child')
```



#### 2.10 为自定义全局指令添加类型


- 可以通过扩展 `ComponentCustomProperties` 来为使用 `app.directive()` 声明的全局自定义指令获取类型提示和类型检查

::: code-group


```ts [src/directives/highlight.ts]
import type { Directive } from 'vue'

export type HighlightDirective = Directive<HTMLElement, string>

declare module 'vue' {
  export interface ComponentCustomProperties {
    // 使用 v 作为前缀 (v-highlight)
    vHighlight: HighlightDirective
  }
}

export default {
  mounted: (el, binding) => {
    el.style.backgroundColor = binding.value
  }
} satisfies HighlightDirective
```

```ts [main.ts]
import highlight from './directives/highlight'
// ...其它代码
const app = createApp(App)
app.directive('highlight', highlight)
```
:::

