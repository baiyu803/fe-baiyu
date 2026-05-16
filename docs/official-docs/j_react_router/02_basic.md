
### 一、功能概述 Feature Overview

- 功能概述是介绍 React Router 的基本功能和使用方法。因此，得出五字结论：**大部分看不懂**

- 因为它和 Vue Router 差异太大了，只有个别内容是类似的

- 本章节适合把 React Router 基本知识看完了，再来回顾的


### 二、教程 Tutorial

- 非常值得看一遍的教程，内容很多，都是需要记录的，所以就不展开写了，直接看[官方文档](https://reactrouter.com/6.30.1/start/tutorial)

- 这是跟着文档走一遍的代码，[查看源代码](https://github.com/baiyu803/react-router-demo)

- 这是一个用联系人 CRUD 小项目，走一遍 React Router 数据路由主线的教程

    - 从 createBrowserRouter + RouterProvider 开始，往下依次带你做根路由、错误页、嵌套路由、客户端导航、数据加载、表单提交、重定向、激活态、全局 pending、删除、索引路由、搜索参数、历史栈管理、useFetcher、乐观更新、pathless route、JSX routes

::: tip
- 它覆盖了哪些必学内容呢

    - 数据路由的基本搭建：`createBrowserRouter`、`RouterProvider`。
    - 布局路由与嵌套路由：`root route`、`children`、`<Outlet>`。
    - 客户端路由跳转：`<Link>`。
    - 数据加载主线：`loader`、`useLoaderData`、URL `params` 传给 loader。
    - 数据提交主线：`<Form>`、`action`、`request.formData()`、`redirect`。这部分是 v6 数据路由最核心的心智模型。
    - 提交后的自动 `revalidation` 体验：教程明确讲了 action 完成后页面数据会自动重新验证。
    - 导航状态与交互反馈：`<NavLink>` 的 isActive/isPending，以及 `useNavigation` 做全局 pending UI。
    - 错误处理主线：`errorElement`、`useRouteError`、上下文化错误边界、404 Response。
    - 索引路由：`index: true`。
    - 查询参数驱动页面：GET 提交、URL Search Params、表单状态与 URL 同步、`useSubmit`、`history replace`。
    - 编程式导航：`useNavigate`。
    - 不跳页的数据提交：`useFetcher`。这个在列表项点赞、切换状态、局部更新里很常见。
    - 乐观更新：企业项目里很实用，教程也讲了。
    - 无路径布局路由：`pathless route`。
    - JSX 方式配置路由：`createRoutesFromElements`。
:::

- 当然，没有覆盖到的内容也很多，比如路由懒加载、路由守卫、权限控制、更多路由类型、滚动行为、大型项目路由组织、路由预加载、路由过渡动画、SSR/SSG适配、细粒度状态管理等

### 三、主要概念 Main Concepts

::: tip
有很多概念都是前端开发必知的，就不记录了。记录几个React Router 主要概念，可能后面详细学习仍会遇到
:::


#### 3.1 历史堆栈和位置

- React Router 提供了一种监听 URL 变化的方法，无论历史记录操作是 push、pop 还是 replace

```jsx
let history = createBrowserHistory();
history.listen(({ location, action }) => {
  // this is called whenever new locations come in
  // the action is POP, PUSH, or REPLACE
});
```

#### 3.2 路由排序

```txt
/teams/new
/teams/:teamId
```

- 在 React Router 中，`/teams/new` 会匹配到 `/teams/new` 路由，而不是 `/teams/:teamId` 路由。有些时候，路由匹配是按顺序匹配到 `/teams/:teamId`，但是 React Router 是精准匹配，不按顺序


#### 3.3 无路径路由

```jsx
<Route index element={<Home />} />
<Route index element={<LeagueStandings />} />
<Route element={<PageLayout />} />
```

- 看过上面教程的知道，一般 `<Route />` 是有 `path` 属性的，但是这两没有，因为

    - `<Home/>` 和 `<LeagueStandings/>` 是**索引路由**，`<PageLayout/>`是**布局路由**

- **索引路由**可以理解成默认路由，当访问根路径时，会匹配到索引路由

    - 当父路由匹配但其子路由都不匹配时，它就是默认的子路由

- **布局路由**是因为它根本不参与匹配（尽管其子路由参与了匹配）。它的存在只是为了简化在同一布局中封装多个子路由的过程

```jsx
<Routes>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="teams" element={<Teams />}>
      <Route path=":teamId" element={<Team />} />
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
  </Route>
  <Route element={<PageLayout />}>
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/tos" element={<Tos />} />
  </Route>
  <Route path="contact-us" element={<Contact />} />
</Routes>
```

- `/teams`是索引路由，`/privacy` 就是布局路由






























