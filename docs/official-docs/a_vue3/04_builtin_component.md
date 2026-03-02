### 一、Transition 组件

它可以将进入和离开动画应用到通过默认插槽传递给它的元素或组件上。进入或离开可以由以下的条件之一触发：

- 由 `v-if` 所触发的切换
- 由 `v-show` 所触发的切换
- 由特殊元素 `<component>` 切换的动态组件
- 改变特殊的 `key` 属性

::: code-group

```vue [index.vue]
<button @click="show = !show">Toggle</button>
<Transition>
  <p v-if="show">hello</p>
</Transition>
```

```css [index.css]
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```
:::

> [!TIP] 
> `<Transition>` 仅支持单个元素或组件作为其插槽内容。如果内容是一个组件，这个组件必须仅有一个根元素


#### 1.1 基于 css 的过渡效果

**css 过渡 class**

- 一共6个 class

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/c23a2b6c8f274e17942db78a7e4f6bab~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGC55-l5ZGA:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjY3NDQ3MzQ2MTA4ODYwMCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1773065713&x-orig-sign=lAPtretr39UbUjHG8%2FKARcfRsb0%3D)



**为过渡效果命名**

- 可以给 `<Transition>` 组件传一个 `name` prop 来声明一个过渡效果名。这样类型就不是` v `作为前缀

::: code-group

```vue [index.vue]
<Transition name="fade">
  ...
</Transition>

<!-- 动态过渡，动态变化 name 实现 -->
<Transition :name="transitionName">
  <!-- ... -->
</Transition>
```

```css [index.css]
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```
:::


**自定义过渡 class**

- 可以向 `<Transition>` 传递以下的 props 来指定自定义的过渡 class

    -   `enter-from-class`


    -   `enter-active-class`
    -   `enter-to-class`
    -   `leave-from-class`
    -   `leave-active-class`
    -   `leave-to-class`


```vue
<!-- 假设你已经在页面中引入了 Animate.css -->
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">hello</p>
</Transition>
```

- 传入的 class 会覆盖响应阶段的默认 class 名，这个功能一般配合第三方 css 动画库使用，比如 [Animate.css](https://daneden.github.io/animate.css/)

#### 1.2 JavaScript 钩子

- 可以通过监听 `<Transition>` 组件事件的方式在过渡过程中挂上钩子函数

::: code-group
```vue
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

```js
// 在元素被插入到 DOM 之前被调用
// 用这个来设置元素的 "enter-from" 状态
function onBeforeEnter(el) {}

// 在元素被插入到 DOM 之后的下一帧被调用
// 用这个来开始进入动画
function onEnter(el, done) {
  // 调用回调函数 done 表示过渡结束
  // 如果与 CSS 结合使用，则这个回调是可选参数
  done()
}

// 当进入过渡完成时调用。
function onAfterEnter(el) {}

// 当进入过渡在完成之前被取消时调用
function onEnterCancelled(el) {}

// 在 leave 钩子之前调用
// 大多数时候，你应该只会用到 leave 钩子
function onBeforeLeave(el) {}

// 在离开过渡开始时调用
// 用这个来开始离开动画
function onLeave(el, done) {
  // 调用回调函数 done 表示过渡结束
  // 如果与 CSS 结合使用，则这个回调是可选参数
  done()
}

// 在离开过渡完成、
// 且元素已从 DOM 中移除时调用
function onAfterLeave(el) {}

// 仅在 v-show 过渡中可用
function onLeaveCancelled(el) {}
```
:::

- 这些钩子可以与 CSS 过渡或动画结合使用，也可以单独使用


- 单独使用时，最好添加一个 `:css="false"` prop，它会显示地表明跳过对 css 过渡的自动探测


#### 1.3 出现时过渡

- 如果是想某个节点初次渲染时就应用一个过渡效果，可以添加 `appear`


```vue
<Transition appear>
  ...
</Transition>
```

#### 1.4 过渡模式

- 在之前的例子中，进入和离开的元素都是在同时开始动画的，因此不得不将它们设为 `position: absolute` 以避免二者同时存在时出现的布局问题

- 但也可以设置先执行离开动画，然后在其完成**之后**再执行元素的进入动画



```vue
<Transition mode="out-in">
  ...
</Transition>
```

- `<Transition>` 也支持 `mode="in-out"`，虽然这并不常用



### 二、TransitionGroup 组件

用于对 `v-for` 列表中的元素或组件的插入、移除和顺序改变添加动画效果

#### 2.1 与 Transition 区别

`<TransitionGroup>` 支持和 `<Transition>` 基本相同的 props、CSS 过渡 class 和 JavaScript 钩子监听器，但有以下几点区别：

-   默认情况下，它不会渲染一个容器元素。但你可以通过传入 `tag` prop 来指定一个元素作为容器元素来渲染。


-   过渡模式在这里不可用，因为我们不再是在互斥的元素之间进行切换。
-   列表中的每个元素都**必须**有一个独一无二的 `key` attribute。
-   CSS 过渡 class 会被应用在列表内的元素上，**而不是**容器元素上。

::: code-group

```vue [index.vue]
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
```

```css [index.css]
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
```
:::

### 三、KeepAlive 组件

- 它的功能是在多个组件间动态切换时缓存被移除的组件实例。比如之前的动态组件，又比如路由切换

#### 3.1 包含 / 排除

- KeepAlive 组件默认缓存内部的所有组件实例，但可以通过 `include` 和 `exclude` prop 来定制该行为。这两个 prop 的值都可以是一个以英文逗号分隔的字符串、一个正则表达式，或是包含这两种类型的一个数组


```vue
<!-- 以英文逗号分隔的字符串 -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- 正则表达式 (需使用 `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- 数组 (需使用 `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

- 它会根据组件的`name`选项进行匹配。在 vue3 单文件组件中，会自动根据文件名生成对应的 name

#### 3.2 最大缓存实例数

- 通过传入 `max` prop 来限制可被缓存的最大组件实例数


- `<KeepAlive>` 的行为在指定了 `max` 后类似一个 LRU 缓存


```vue
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

#### 3.3 缓存实例生命周期

- 记住一点，`onActivated` 在组件挂载时也会调用，并且 `onDeactivated` 在组件卸载时也会调用

- 这两个钩子不仅适用于 `<KeepAlive>` 缓存的根组件，也适用于缓存树中的**后代组件**



#### 四、Teleport 组件

- 可以将一个组件内部的一部分模板传送到该组件的 DOM 结构外层的位置去

#### 4.1 基本用法

- 比如一个业务组件里定义了一个弹窗，点击打开后希望弹窗不是挂载在组件根元素下，而是直接挂载在 body 上


```vue
<button @click="open = true">Open Modal</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</Teleport>
```

#### 4.2 禁用 Teleport

- 比如一个场景，我希望不同的设备上，组件要么挂载在外面，要么还在当前组件里，可以动态传入一个 `disabled` prop 控制


```vue
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

#### 4.3 多个 Teleport 共享目标

- 会依次添加到目前元素里


```vue
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

- 结果是


```vue
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

#### 4.4 延迟解析 Teleport

- 在 **Vue 3.5** 及更高版本中，使用 `defer` prop 推迟 Teleport 的目标解析，直到应用的其他部分挂载

```vue
<Teleport defer to="#late-div">...</Teleport>

<!-- 稍后出现于模板中的某处 -->
<div id="late-div"></div>
```

- 有个前提，Teleport 挂载在外层时，要求外层本身早于当前组件挂载。当想挂载在当前组件内部的一个元素时，可以使用此 prop



### 五、Suspense

- 实验性功能 [查看](https://cn.vuejs.org/guide/built-ins/suspense.html)
















































