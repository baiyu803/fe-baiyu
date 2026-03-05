### 一、入门

- 安装：`npm install vue-router@4`

- 实例：

::: code-group

```ts [router.ts]
import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './HomeView.vue'
import AboutView from './AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
```

```ts [main.ts]
import { createApp } from 'vue'
import router from './router';
import App from './App.vue'

createApp(App).use(router).mount('#app')
```

```vue [index.vue]
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const search = computed({
  get() {
    return route.query.search ?? ''
  },
  set(search) {
    router.replace({ query: { search } })
  },
})
</script>
```
:::

- `use(router)` 做了如下事情

    - 全局注册 `RouterView` 和 `RouterLink` 组件

    - 添加全局 `$router` 和 `$route` 属性
    - 启用 `useRouter()` 和 `useRoute()` 组合式函数
    - 触发路由器解析初始路由

- `useRouter()` 和 `useRoute()` 来访问路由器实例和当前路由


### 二、动态路由匹配

应用背景是多个路由使用同一个组件，但路由部分参数不同，称为**动态参数**

#### 2.1 基本使用

- **路径参数**用冒号 `:` 表示。当一个路由被匹配时，它的 *params* 的值将在每个组件中以 `route.params` 的形式暴露出来

::: code-group

```js [router.js]
import User from './User.vue'

// 这些都会传递给 `createRouter`
const routes = [
  // 动态字段以冒号开始
  { path: '/users/:id', component: User },
]
```

```vue [index.vue]
<template>
  <div>
    <!-- 当前路由可以通过 $route 在模板中访问 -->
    User {{ $route.params.id }}
  </div>
</template>
```
:::

- 可以在同一个路由中设置多个路径参数，都会映射到 `$route.params` 上


| 匹配模式 | 匹配路径 | $route.params |
| --- | --- | --- |
| /users/:username | /users/eduardo | { username: 'eduardo' } |
| /users/:username/posts/:postId | /users/eduardo/posts/123 | { username: 'eduardo', postId: '123' } |

#### 2.2 响应路由参数变化

- 动态路由在相互切换时有个问题，相同的组件实例将被复用，因此组件的生命周期钩子不会被调用

- 如果想正确响应路由变化，可以使用监听 `$route.params` ，或者使用 `beforeRouteUpdate` 导航守卫

#### 2.3 捕获所有路由或 404 Not found 路由

- 首先，上面那种常规参数 `/users/:username` 只能匹配特定的url片段。如果想匹配**任意路径**，可以使用自定义的**路径参数正则表达式**


```js
const routes = [
  // 将匹配所有内容并将其放在 `route.params.pathMatch` 下
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  // 将匹配以 `/user-` 开头的所有内容，并将其放在 `route.params.afterUser` 下
  { path: '/user-:afterUser(.*)', component: UserGeneric },
]
```
- 比如在应用中，将上面的通配路由放在最后，如果没有对应的路由，就指向 NotFound 组件


- 实际访问效果

    -   访问 `/abc/def/ghi` → 匹配到 `NotFound`，`route.params.pathMatch` 为 `'abc/def/ghi'`。


    -   访问 `/user-profile` → 匹配到 `UserGeneric`，`route.params.afterUser` 为 `'profile'`。
    -   访问 `/user-123/details` → 匹配到 `UserGeneric`，`route.params.afterUser` 为 `'123/details'`


### 三、路由的匹配语法

大部分内容简单了解即可，一般业务开发中不怎么用 [点击查看](https://router.vuejs.org/zh/guide/essentials/route-matching-syntax.html)


#### 3.1 Sensitive 与 strict 路由配置

- 默认情况下，路由不区分大小写，尾部斜杠可有可无。也就是 `/Users` 和 `/users` 会被视为同一个路由，`/users` 和 `/users/` 会被视为同一个路由

- 但是可以通过配置来控制区分，下面两参数都可以**全局或单路由**配置

    - `strict` 严格模式：控制是否严格匹配尾部斜杠。当为 true 时，`/users` 和 `/users/` 是两不同路由

    - `Sensitive` 大小写敏感：控制路由是否区分大小写。当为 true 是，`/Users/posva` 和 `/users/posva` 是两不同路由


```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/users/:id', sensitive: true },  // 单路由配置
    
    { path: '/users/:id' },
  ],
  strict: true, // 全局配置
})
```


### 四、嵌套路由

- 正常情况下，都是 app.vue 中有一个顶层的 `<router-view>`，但有些情况下，希望一个路由对应的组件里也有 `<router-view>`，这是可以使用**嵌套路由**，这个组件也可以称为父组件

#### 4.1 基本使用

- 嵌套路由需要在路由中配置 children

::: code-group
```vue [User.vue]
<template>
  <div class="user">
    <h2>User {{ $route.params.id }}</h2>
    <router-view />
  </div>
</template>
```
```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'profile',
        component: UserProfile,
      },
      {
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```
:::

- `children` 配置只是另一个路由数组，就像 `routes` 本身一样。因此，你可以不断嵌套

- 有个注意的点，当访问 `/user/eduardo` 时，不会匹配任何嵌套路由，这是你可以配一个空的嵌套路径


```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      // 当 /user/:id 匹配成功
      // UserHome 将被渲染到 User 的 <router-view> 内部
      { path: '', component: UserHome },

      // ...其他子路由
    ],
  },
]
```

#### 4.2 嵌套的命名路由

- 一般是给子路由提供命名


```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    // 请注意，只有子路由具有名称
    children: [{ path: '', name: 'user', component: UserHome }],
  },
]
```

- 有种情况需要给父路由命名，就是想导航 `/user/:id` 而不显示嵌套路由，可以使用命名路由，但是注意**重新刷新页面还是会显示嵌套的子路由**


#### 4.3 忽略父组件

- 这个其实是将具有公共路径前缀的路由分组在一起，没有父组件，路由相互间没有关系。主要是借助嵌套路由的配置能力


```js
const routes = [
  {
    path: '/admin',
    children: [
      { path: '', component: AdminOverview },
      { path: 'users', component: AdminUserList },
      { path: 'users/:id', component: AdminUserDetails },
    ],
  },
]
```

### 五、命名路由

- 创建路由时，可以给路由取唯一的一个 `name` 名称，然后在业务中，切换路由时，使用 name 替代 path

::: code-group

```js [router.js]
const routes = [
  {
    path: '/user/:username',
    name: 'profile', 
    component: User,
  },
]
```

```vue [index.vue]
<router-link :to="{ name: 'profile', params: { username: 'erina' } }">
  User profile
</router-link>
```

```js [index.js]
router.push({ name: 'user', params: { username: 'erina' } })
```
:::

- 所有路由命名**必须是唯一的**，如果存在相同命名，路由器只会保留最后一条


### 六、编程式导航


#### 6.1 `router.push`

- 下面两效果是一样的，因此传参配置也完全相同

| 声明式 | 编程式 |
| --- | --- |
| `<router-link :to="...">` | `router.push(...)` |


```js
// 字符串路径
router.push('/users/eduardo')

// 带有路径的对象
router.push({ path: '/users/eduardo' })

// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })

// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// 带 hash，结果是 /about#team
router.push({ path: '/about', hash: '#team' })
```

- 注意，如果提供了 `path`，`params` 会被忽略

```js
// `params` 不能与 `path` 一起使用
router.push({ path: '/user', params: { username } }) // -> /user
```


#### 6.2 `router.replace` 替换当前位置

| 声明式 | 编程式 |
| --- | --- |
| `<router-link :to="..." replace>` | `router.replace(...)` |

- 它的作用类似于 `router.push()`，唯一不同的是，它在导航时不会向 history 添加新记录，而是替换掉当前的记录

```js
router.push({ path: '/home', replace: true })
// 相当于
router.replace({ path: '/home' })
```

#### 6.3 `router.go` 横跨历史

```js
// 向前移动一条记录，与 router.forward() 相同
router.go(1)

// 返回一条记录，与 router.back() 相同
router.go(-1)

// 前进 3 条记录
router.go(3)

// 如果没有那么多记录，静默失败
router.go(-100)
router.go(100)
```

### 七、命名视图

- 应用背景是，一个路由页面分为多个视图，不是嵌套展示。比如一个页面有 sidebar（侧导航）和 main（主内容）两个视图区域，它们需要同时展示，而不是嵌套关系。

::: code-group
```vue [app.vue]
<!-- 在组件模板中使用 -->
<router-view name="sidebar"></router-view>
<router-view name="main"></router-view>
<router-view></router-view> <!-- 没有设置名字，是默认视图 default -->
```
```js [router.js]
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      components: {
        default: Home, // 默认视图
        sidebar: Sidebar, // 命名视图
        main: MainContent // 命名视图
      }
    }
  ]
})
```
::: code-group

- 当然，也有嵌套命名视图的情况，比如有一个父组件，子组件使用上面配置



### 八、重定向和别名


#### 8.1 重定向

- 重定向也是在 routes 配置完成，使用 `redirect` 参数

```js
// 从 /home 重定向到 /
const routes = [{ path: '/home', redirect: '/' }]

// 重定向的目标也可以是一个命名的路由
const routes = [{ path: '/home', redirect: { name: 'homepage' } }]

// 甚至是一个方法，使用函数动态返回重定向目标，方法接受目标路由作为参数
const routes = [{ 
  path: '/home', 
  redirect: to => {
    return { path: '/search', query: { q: to.params.searchText } }
  }
}]

// 相对重定向（相对于当前路径）
const routes = [
  {
    // 将总是把/users/123/posts重定向到/users/123/profile。
    path: '/users/:id/posts',
    redirect: to => {
      // 该函数接收目标路由作为参数
      return to.path.replace(/posts$/, 'profile')
    },
  },
]
```

- 注意，**导航守卫**并没有应用在跳转路由上，而是应用在其目标上。在上面的例子中，在 /home 路由中添加 beforeEnter 守卫不会有任何效果

- 在写 redirect 时，可以省略 component 配置，毕竟用不上


#### 8.2 别名

- 别名让你可以将一个路径映射到另一个路径，例如将 `/home` 设置为 `/` 的别名

```js
const routes = [{ path: '/', component: Home, alias: '/home' }]
```

- 这意味着当用户访问 `/home` 时，URL 会保持为 `/home`，但会显示 `/` 对应的组件

- 别名可以是一个数组，支持多个别名

```js
const routes = [
  {
    path: '/users',
    component: Users,
    alias: ['/people', '/members']
  }
]
```

- 别名对于保留旧的 URL 结构非常有用，特别是在重构应用程序时


### 九、路由组件传参

::: tip
这个看看就好，个人认为，在实际业务中这样写不利于开发维护
:::

- 文档上说，在组件中使用 `$route` 会与路由紧密耦合，这限制了组件的灵活性，因为它只能在某些特定的 URL 上使用。通过 `props` 配置可以解除与 `$route` 的耦合。

- 也就是在 routes 配置时，将 params 和 query 作为 props 传递给组件

::: code-group
```js [router.js]
const routes = [
  {
    path: '/user/:id',
    component: User,
    props: true // 将路由参数作为 props 传递给组件
  },
  {
    path: '/search',
    component: User,
    props: route => ({ query: route.query.q }) // 将查询参数作为 props
  }
]
```
```vue [User.vue]
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  id: String,
  query: String
})
</script>

<template>
  <div>
    <p v-if="id">User ID: {{ id }}</p>
    <p v-if="query">Search query: {{ query }}</p>
  </div>
</template>
```
:::

- 也可以传递静态值作为 props，如：`props: { newsletterPopup: false }`


### 十、匹配当前路由的链接

- 未看到有用信息，实际业务中也没遇到

[点击查看](https://router.vuejs.org/zh/guide/essentials/active-links.html)


### 十一、不同的历史模式


在创建路由器实例时，history 配置允许在不同的历史模式中选择

#### 11.1 Hash 模式

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [],
})
```

- 内部传递的实际 URL 之前使用了一个井号（#）。由于这部分 URL 从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理

- 在 SEO 中也有不好的影响


#### 11.2 Memory 模式

```js
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [],
})
```

- Memory 模式不会假定自己处于浏览器环境，因此不会与 URL 交互也不会自动触发初始导航。这使得它非常适合 Node 环境和 SSR

- 不推荐使用，他不会产生历史记录，也就意味着不能后退前进


#### 11.3 HTML5 模式

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [],
})
```

- 需要服务器端配置支持，确保所有路由都指向同一个 HTML 文件


![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/aa251a63a18b46be8a670f5c22810014~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGC55-l5ZGA:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjY3NDQ3MzQ2MTA4ODYwMCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1773324310&x-orig-sign=U3gHG%2FpdUUL1I4owmD8T3dbTv8E%3D)



























































