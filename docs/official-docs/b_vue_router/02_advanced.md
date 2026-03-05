### 一、导航守卫

::: info
导航守卫主要用来通过跳转或取消的方式守卫导航。它就是路由跳转过程中的一些钩子函数。

分为全局的、单个路由独享的、组件内的
:::

#### 1.1 全局前置守卫

- 可以使用 `router.beforeEach` 注册一个全局前置守卫

```js
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  // 返回 false 以取消导航
  return false
})
```

- 在此之前，还可接受第三个参数 next，用于返回指定的值，但最新版本中已废弃（仍可使用），推荐返回 false 或返回一个路由地址

    - false：取消当前的导航

    - 路由地址：通过一个路由地址跳转到一个不同的地址。`return { name: 'Login' }`

    - 如果什么都没有，undefined 或返回 true，则导航是有效的，并调用下一个导航守卫

#### 1.2 全局解析守卫

- 可以用 `router.beforeResolve` 注册一个全局守卫。这和 `router.beforeEach` 类似，因为它在每次导航时都会触发，不同的是，解析守卫刚好会在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用

#### 1.3 全局后置钩子

- 和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身

- 它们对于分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用

```js
router.afterEach((to, from) => {
  // ...
})
```

#### 1.4 路由独享的守卫

- 直接在路由配置上定义 `beforeEnter` 守卫

```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```

- `beforeEnter` 守卫 只在进入路由时触发，不会在 `params`、`query` 或 `hash` 改变时触发。例如，从 `/users/2` 进入到 `/users/3` 或者从 `/users/2#info` 到 `/users/2#projects` 都不会触发。嵌套路由的子路由间切换也不会触发

- 也可以将一个函数数组传递给 beforeEnter

#### 1.5 组件内的守卫

- 选项式中有 `beforeRouteEnter、beforeRouteUpdate, beforeRouteLeave`

- 组合式中没有 beforeRouteEnter，可以直在 setup 中写。另外两个对应 `onBeforeRouteUpdate、onBeforeRouteLeave`

```js
<script>
export default {
  beforeRouteEnter(to, from) {
    // 在渲染该组件的对应路由被验证前调用
    // 不能获取组件实例 `this` , 但可以接受第三个参数 next 回调，实现对组件实例的访问
    // 因为当守卫执行时，组件实例还没被创建！
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from) {
    // 在导航离开渲染该组件的对应路由时调用
    // 可以访问组件实例 `this`
  },
}
</script>
```

- 可以在 beforeRouteLeave 中实现一些表单填写页面的离开保护


![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/6374eaafe7d247eea9831763bf294128~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGC55-l5ZGA:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjY3NDQ3MzQ2MTA4ODYwMCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1773324320&x-orig-sign=Uag1aZF%2FBd%2F0E2KG0AW1IW2rp8I%3D)


### 二、路由元信息

- 路由元信息 `meta` 字段可以包含任意与路由相关的信息，例如页面标题、权限要求、是否缓存等

#### 2.1 基本使用

```js
const routes = [
  {
    path: '/posts',
    component: PostsLayout,
    children: [
      {
        path: 'new',
        component: PostsNew,
        meta: { keepAlive: true, isAdmin: false },
      },
      {
        path: ':id',
        component: PostsDetail,
        meta: { keepAlive: false },
      },
    ],
  },
]
```
- meta 可以在挺多地方被访问，比如导航守卫、组件内部等，用于实现一些动态逻辑。使用 `route.meta` 访问

#### 2.2 TypeScript 

- 可以继承来自 vue-router 中的 RouteMeta 来为 meta 字段添加类型

```js
// 这段可以直接添加到你的任何 `.ts` 文件中，例如 `router.ts`
// 也可以添加到一个 `.d.ts` 文件中。确保这个文件包含在
// 项目的 `tsconfig.json` 中的 "file" 字段内。
import 'vue-router'

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export {}

declare module 'vue-router' {
  interface RouteMeta {
    // 是可选的
    isAdmin?: boolean
    // 每个路由都必须声明
    requiresAuth: boolean
  }
}
```


### 三、数据获取

- 一些数据获取技巧

[点击查看](https://router.vuejs.org/zh/guide/advanced/data-fetching.html)

### 四、组合式 API

- 新增 `useRouter` 和 `useRoute` 函数，实现类似 `$router`和`$route` 访问

    - 注意，在模版中仍使用 `$router`和`$route` 访问

- 组件内导航守卫更换为 `onBeforeRouteUpdate` 和 `onBeforeRouteLeave`

```js
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteLeave((to, from) => {})
onBeforeRouteUpdate((to, from) => {{})
</script>
```

- [useLink 函数，用于自定义链接行为](https://router.vuejs.org/zh/guide/advanced/composition-api.html#useLink)


### 五、RouterView 插槽

#### 5.1 基本使用

- `RouterView` 组件暴露了一个插槽，用来渲染路由组件

- `v-slot` 会暴露两个属性

    - Component： 要渲染的组件

    - route：当前路由对象

```js
<router-view v-slot="{ Component }">
  <component :is="Component" />
</router-view>
```

- 其实上面等价于 `<router-view />`。但是可以利用插槽写法实现缓存，切换动画等

#### 5.2 keepAlive & Transition

- vue-router 4 提供了新的路由缓存，区别于 vue-router 3

::: code-group
```vue [vue-router 4]
<router-view v-slot="{ Component, route }">
  <keep-alive :include="['Home', 'Article']"> <!-- 只缓存 Home 和 Article 组件 -->
    <component :is="Component" :key="route.name" />
  </keep-alive>
</router-view>
```
```vue [vue-router 3]
<keep-alive>
    <router-view />
</keep-alive>
```
:::

- 也允许使用一个 `Transition` 组件实现切换过渡效果

```vue
<router-view v-slot="{ Component }">
  <transition>
    <component :is="Component" />
  </transition>
</router-view>
```
```vue
<router-view v-slot="{ Component }">
  <transition>
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>
```

#### 5.3 模版引用

- 引用一般放在路由组件上

```vue
<router-view v-slot="{ Component }">
  <component :is="Component" ref="mainContent" />
</router-view>
```

### 六、过渡动效

- 其实就是配合 Transition 的一些实例

[点击查看](https://router.vuejs.org/zh/guide/advanced/transitions.html)

### 七、滚动行为

- 在创建 Router 实例时，有提供一个 `scrollBehavior` 方法来控制页面滚动行为。这个方法接收 to 和 from 路由对象，以及保存的滚动位置 `savedPosition`（如果存在），返回一个对象来指定滚动位置。

::: tip
这个功能只在支持 history.pushState 的浏览器中可用，但在不支持的浏览器中也不会报错，只是失效
:::

```js
const router = createRouter({
  history: createWebHistory(),
  routes,
  // 核心配置：scrollBehavior 方法
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（后退/前进），恢复该位置；否则返回顶部
    if (savedPosition) {
        return savedPosition
    } else {
        return { x: 0, y: 0 }
    }
  }
})
```

- `savedPosition` 只有当这是一个 popstate 导航时才有值（由浏览器的后退/前进按钮触发）

- 其他一些例子

::: code-group
```js [指定元素偏移]
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // 始终在元素 #main 上方滚动 10px
    return {
      // 也可以这么写
      // el: document.getElementById('main'),
      el: '#main',
      // 在元素上 10 像素
      top: 10,
    }
  },
})
```
```js [滚动到锚点]
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        // 滚动更流畅
        behavior: 'smooth',
      }
    }
  },
})
```
```js [延迟滚动]
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 })
      }, 500)
    })
  },
})
```
:::


### 八、路由懒加载

- vue-router 有开箱急用的动态导入

#### 8.1 基本使用

```js
// 将
// import UserDetails from './views/UserDetails.vue'
// 替换成
const UserDetails = () => import('./views/UserDetails.vue')

const router = createRouter({
  // ...
  routes: [
    { path: '/users/:id', component: UserDetails }
    // 或在路由定义里直接使用它
    { path: '/users/:id', component: () => import('./views/UserDetails.vue') },
  ],
})
```

#### 8.2 把组件按组分块


::: code-group

```js [使用 webpack]
const UserDetails = () =>
  import(/* webpackChunkName: "group-user" */ './UserDetails.vue')
const UserDashboard = () =>
  import(/* webpackChunkName: "group-user" */ './UserDashboard.vue')
const UserProfileEdit = () =>
  import(/* webpackChunkName: "group-user" */ './UserProfileEdit.vue')
```
```js [使用 Vite]
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#outputmanualchunks
      output: {
        manualChunks: {
          'group-user': [
            './src/UserDetails',
            './src/UserDashboard',
            './src/UserProfileEdit',
          ],
        },
      },
    },
  },
})
```
:::


### 九、类型化路由

- Vue Router 4 提供了开箱即用的类型支持，通过 TypeScript 来定义路由名称、参数等，以获得更好的开发体验和类型安全

- 其实就是写路由时有自动提示，有现成的插件使用 unplugin-vue-router

[点击查看](https://router.vuejs.org/zh/guide/advanced/typed-routes.html)


### 十、扩展 RouterLink

[点击查看](https://router.vuejs.org/zh/guide/advanced/extending-router-link.html)


### 十一、导航故障

[点击查看](https://router.vuejs.org/zh/guide/advanced/navigation-failures.html)

- 提供了一些方法用来捕获导航结果，从而可以实现一些逻辑


### 十二、动态路由

- 在实际业务中，有些路由可能会在业务逻辑运行时动态添加或删除，这时就需要使用动态路由

- 动态路由主要通过 `router.addRoute()` 和 `router.removeRoute()` 方法来实现

#### 12.1 添加路由

```js
router.addRoute({ path: '/about', component: About })
router.addRoute({ path: '/about', name: 'about', component: About }) // 最好有 name

//添加嵌套路由
router.addRoute('admin', { path: 'settings', component: AdminSettings })
```


#### 12.2 删除路由

::: code-group
```js [顶替删除]
router.addRoute({ path: '/about', name: 'about', component: About })
// 这将会删除之前已经添加的路由，因为他们具有相同的名字且名字必须是唯一的
router.addRoute({ path: '/other', name: 'about', component: Other })
```
```js [调用回调删除]
const removeRoute = router.addRoute(routeRecord)
removeRoute() // 删除路由如果存在的话
```
```js [按名称删除]
router.addRoute({ path: '/about', name: 'about', component: About })
// 删除路由
router.removeRoute('about')
```
:::

#### 12.3 其他方法

- `router.hasRoute()`：检查路由是否存在。接受一个路由名称 name

- `router.getRoutes()`：获取一个包含所有路由记录的数组

::: tip
动态路由时在中后台项目中非常有用，比如根据用户权限动态添加或删除路由
:::


