::: tip
- React-Router 版本已经更新到 V7 了，但是目前大部分企业还在使用 V6 版本，甚至是 V5 版本。

- 所以，本文主要按照官网的 V6.30.1 版本，介绍 V6 版本的使用方法。仅针对必须要掌握的内容进行学习和记录

    - 包括 SSR、React Native 等场景都没记录，需要时再查

| 一级模块 | 二级子项 | 掌握程度 | 核心说明 |
| :--- | :--- | :--- | :--- |
| **Getting Started** | Feature Overview | :white_check_mark: 必学 | 快速建立 v6 整体认知，重点理解"数据路由"核心思想 |
| | Tutorial | :white_check_mark: 必学 | 官方完整入门案例，覆盖从 0 到 1 的完整开发流程 |
| | Main Concepts | :white_check_mark: 必学 | 路由匹配、嵌套路由、索引路由等基础原理 |
| **Routers** | Picking a Router | :white_check_mark: 必学 | 了解不同路由的适用场景，选择正确的路由类型 |
| | createBrowserRouter | :white_check_mark: 必学 | **企业级项目首选**，官方推荐的新路由创建方式 |
| | createHashRouter | :information_source: 了解 | 仅用于无服务器的静态站点部署 |
| | createMemoryRouter | :information_source: 了解 | 主要用于单元测试和非浏览器环境 |
| | RouterProvider | :white_check_mark: 必学 | 配合 createBrowserRouter 使用，路由入口组件 |
| **Router Components** | BrowserRouter | :white_check_mark: 必学 | 传统路由入口，兼容旧代码 |
| | HashRouter | :information_source: 了解 | 对应 createHashRouter 的传统写法 |
| | MemoryRouter | :information_source: 了解 | 对应 createMemoryRouter 的传统写法 |
| **Route** | Route | :white_check_mark: 必学 | 路由配置核心组件，掌握 path/element/index/children 等属性 |
| | action | :information_source: 了解 | 路由级表单提交处理，数据路由核心功能 |
| | errorElement | :white_check_mark: 必学 | 路由级错误边界，提升应用健壮性 |
| | lazy | :white_check_mark: 必学 | 路由懒加载，大型项目性能优化必备 |
| | loader | :white_check_mark: 必学 | 路由级数据预加载，**数据路由最核心功能** |
| | shouldRevalidate | :information_source: 了解 | 数据重验证策略控制，进阶优化 |
| **Components** | Await | :information_source: 了解 | 配合 defer 实现延迟数据加载，复杂场景使用 |
| | Form | :information_source: 了解 | 内置表单组件，自动与 action 绑定，大幅简化表单开发 |
| | Link | :white_check_mark: 必学 | 基础页面跳转组件 |
| | NavLink | :white_check_mark: 必学 | 导航高亮专用组件，侧边栏/顶部导航必备 |
| | Navigate | :white_check_mark: 必学 | 声明式重定向，登录拦截/权限控制常用 |
| | Outlet | :white_check_mark: 必学 | 嵌套路由渲染出口，**多页面布局核心** |
| | Route | :white_check_mark: 必学 | 声明式路由配置 |
| | Routes | :white_check_mark: 必学 | 声明式路由容器 |
| | ScrollRestoration | :information_source: 了解 | 路由跳转滚动恢复，按需开启 |
| **Hooks** | useActionData | :white_check_mark: 必学 | 获取 action 处理结果 |
| | useAsyncError | :information_source: 了解 | 配合 Await 组件使用，获取异步错误 |
| | useAsyncValue | :information_source: 了解 | 配合 Await 组件使用，获取异步数据 |
| | useBeforeUnload | :information_source: 了解 | 页面关闭前提示，表单未保存场景使用 |
| | useBlocker | :information_source: 了解 | 路由跳转前拦截，表单未保存场景使用 |
| | useFetcher | :information_source: 了解 | 不触发导航的局部数据更新，复杂交互场景使用 |
| | useFormAction | :information_source: 了解 | 获取当前路由的 action 路径，自定义表单时使用 |
| | useHref | :information_source: 了解 | 生成跳转链接，自定义 Link 组件时使用 |
| | useLoaderData | :white_check_mark: 必学 | 获取 loader 预加载的数据，**最常用 Hook 之一** |
| | useLocation | :white_check_mark: 必学 | 获取当前路由完整信息（路径、state、query 等） |
| | useMatch | :white_check_mark: 必学 | 判断当前路由是否匹配指定路径，权限控制/导航高亮 |
| | useMatches | :information_source: 了解 | 获取当前匹配的所有路由信息，面包屑导航常用 |
| | useNavigate | :white_check_mark: 必学 | 编程式导航，**最常用 Hook 之一** |
| | useNavigation | :white_check_mark: 必学 | 获取导航状态（加载中/提交中），用于显示 Loading |
| | useNavigationType | :information_source: 了解 | 获取导航类型（push/replace/pop），特定场景使用 |
| | useOutletContext | :white_check_mark: 必学 | 嵌套路由间数据传递 |
| | useParams | :white_check_mark: 必学 | 获取路由动态参数（如 /user/:id 中的 id） |
| | useRevalidator | :information_source: 了解 | 手动触发数据重验证，数据更新后刷新页面 |
| | useRouteError | :white_check_mark: 必学 | 在 errorElement 中获取错误信息 |
| | useRouteLoaderData | :information_source: 了解 | 获取任意父路由的 loader 数据，跨路由数据共享 |
| | useRoutes | :information_source: 了解 | 编程式路由配置，动态路由场景使用 |
| | useSearchParams | :white_check_mark: 必学 | 获取/操作 URL 查询参数（如 ?page=1&size=10） |
| | useSubmit | :information_source: 了解 | 编程式提交表单，自定义提交逻辑时使用 |
| **Fetch Utilities** | json | :white_check_mark: 必学 | 在 loader/action 中返回 JSON 数据 |
| | redirect | :white_check_mark: 必学 | 在 loader/action 中返回重定向响应 |
| | redirectDocument | :information_source: 了解 | 整页重定向，跳转到外部链接时使用 |
| | replace | :information_source: 了解 | 替换当前历史记录的重定向 |
| **Utilities** | createSearchParams | :information_source: 了解 | 创建查询参数对象，拼接复杂查询条件 |
| | defer | :information_source: 了解 | 延迟数据加载，配合 Await 组件使用 |
| | generatePath | :white_check_mark: 必学 | 根据路径模板生成 URL，避免硬编码 |
| | isRouteErrorResponse | :information_source: 了解 | 判断是否是路由错误响应，错误处理时使用 |
| | matchPath | :information_source: 了解 | 手动匹配单个路由，自定义权限控制 |
| | matchRoutes | :information_source: 了解 | 手动匹配多个路由，自定义路由守卫 |


:::

react-router 官方文档有很多内容，远比 vue-router 官方文档内容多

原因是 **React Router v6 已经不是一个单纯的 "路由匹配库" 了，它已经演变成了一个以路由为核心的全栈式前端应用框架**

Vue Router 的设计哲学是 "专注于路由本身"，只做路由匹配、导航、参数传递这些核心功能，数据加载、表单处理、错误处理等都交给开发者自己或其他库（如 Pinia、Axios）来解决

而 React Router v6 后期（特别是 v6.4+）的设计哲学是 **"路由是应用的入口"**，它认为**所有和页面生命周期相关的逻辑（数据加载、提交、错误、状态）都应该由路由统一管理**，因此内置了大量原本需要第三方库才能实现的功能

<br />

::: danger
以下是 AI 总结
:::

## 一、React Router v6.30 官网内容全景
### 1. 基础入门层（Getting Started）
这部分和 Vue Router 类似，是所有路由库的通用内容：
- **Feature Overview**：整体特性介绍，重点强调 v6.4+ 新增的"数据路由"（Data Router）体系
- **Tutorial**：一个完整的联系人管理应用教程，从 0 到 1 演示了路由配置、嵌套路由、数据加载、表单提交、错误处理的完整流程
- **Main Concepts**：核心概念讲解，包括路由匹配规则、嵌套路由、索引路由、相对路径等基础原理

### 2. 版本迁移层（Upgrading）
这是 React Router 特有的大篇幅内容，因为它的 API 经历了多次破坏性变更：
- 从 v5 到 v6 的完整迁移指南（v5 和 v6 写法差异巨大）
- 从 @reach/router 到 React Router 的迁移（两者已合并）
- 从传统的 `<BrowserRouter>` 写法迁移到新的 `createBrowserRouter` + `RouterProvider` 写法
- 未来标志（Future Flags）：提前启用下一个大版本的 API，平滑过渡

### 3. 路由创建层（Routers）
这是 v6.4+ 变化最大的部分，也是和 Vue Router 差异最明显的地方：
- **传统路由组件**：`BrowserRouter`、`HashRouter`、`MemoryRouter`（和 Vue Router 的 createWebHistory、createWebHashHistory 对应）
- **新增的数据路由创建函数**：`createBrowserRouter`、`createHashRouter`、`createMemoryRouter`
  - 这是**现在官方推荐的写法**，替代了传统的 `<Routes>` + `<Route>` 声明式写法
  - 支持基于对象的路由配置，更适合大型项目的路由拆分和管理
  - 只有使用这种写法，才能使用后面所有的"数据路由"功能（loader、action、errorElement 等）
- **静态路由**：`createStaticHandler`、`createStaticRouter`、`StaticRouterProvider`
  - 专门用于服务端渲染（SSR）和静态站点生成（SSG）场景
  - Vue Router 也有类似功能，但 React Router 把它拆分成了独立的 API

### 4. 路由配置层（Route）
这是 React Router 内容最多、最核心的部分，**90% 的新增功能都在这里**：
- **基础路由配置**：`path`、`element`、`index`、`children`（和 Vue Router 对应）
- **数据加载 API**：`loader`
  - 路由级别的数据预加载函数，在路由渲染之前执行
  - 相当于把 Vue 中 `onMounted` 里的请求逻辑提前到了路由层面
  - 支持并行加载、错误处理、缓存、重验证等高级功能
- **数据提交 API**：`action`
  - 路由级别的表单提交处理函数，处理 POST、PUT、DELETE 等请求
  - 相当于把 Vue 中表单的 `@submit` 处理逻辑统一放到了路由层面
- **错误处理 API**：`errorElement`
  - 路由级别的错误边界，捕获该路由及其子路由中所有的错误（包括 loader、action、组件渲染错误）
  - 自动渲染错误页面，无需手动写 try/catch
- **性能优化 API**：`lazy`、`hydrateFallbackElement`、`shouldRevalidate`
  - 路由懒加载、水合降级、数据重验证策略控制

### 5. 组件层（Router Components / Components）
除了基础的路由组件，React Router 还内置了大量实用组件：
- **基础组件**：`Link`、`NavLink`、`Navigate`、`Outlet`、`Routes`、`Route`（和 Vue Router 的 `<RouterLink>`、`<RouterView>` 对应）
- **新增的表单组件**：`Form`
  - 一个功能强大的表单组件，自动和路由的 `action` 函数绑定
  - 支持 GET/POST/PUT/DELETE 等所有 HTTP 方法
  - 自动处理表单提交状态、错误信息、重定向等
- **新增的异步组件**：`Await`
  - 配合 `defer` 工具函数使用，实现路由数据的延迟加载
  - 可以为不同的数据指定不同的加载状态，提升用户体验
- **新增的滚动恢复组件**：`ScrollRestoration`
  - 自动处理路由跳转时的滚动位置恢复
  - Vue Router 有内置的 `scrollBehavior` 配置，但 React Router 把它做成了一个可插拔的组件

### 6. Hooks 层（Hooks）
这是 React Router 最常用的 API，数量远多于 Vue Router 的组合式 API：
- **基础导航 Hooks**：`useNavigate`、`useLocation`、`useParams`、`useSearchParams`（和 Vue Router 的 `useRouter`、`useRoute` 对应）
- **数据路由 Hooks**：`useLoaderData`、`useActionData`、`useRouteError`、`useNavigation`
  - 获取 loader 加载的数据、action 处理的结果、路由错误信息、导航状态
- **高级数据 Hooks**：`useFetcher`、`useFetchers`、`useRevalidator`
  - `useFetcher`：不触发导航的情况下调用 loader 或 action，实现局部数据更新
  - `useRevalidator`：手动触发路由数据的重新验证
- **导航控制 Hooks**：`useBlocker`、`useBeforeUnload`
  - 实现离开页面时的提示（如"您有未保存的更改，确定要离开吗？"）
- **嵌套路由 Hooks**：`useOutletContext`、`useMatches`
  - 嵌套路由之间的数据传递、获取当前匹配的所有路由信息

### 7. 工具函数层（Fetch Utilities / Utilities）
React Router 提供了大量配套的工具函数，简化数据路由的开发：
- **Fetch 工具**：`json`、`redirect`、`replace`、`redirectDocument`
  - 在 loader 和 action 中统一返回 JSON 数据或重定向响应
- **通用工具**：`generatePath`、`matchPath`、`matchRoutes`、`createSearchParams`
  - 生成动态路径、手动匹配路由、创建查询参数等

### 8. 高级指南层（Guides）
这部分是针对企业级复杂场景的最佳实践：
- 服务端渲染（SSR）
- 延迟数据加载（Deferred Data）
- 表单数据处理（Working With FormData）
- 数据库集成（和 React Query、SWR 等库的配合使用）
- 索引查询参数（Index Query Param）

---

## 二、和 Vue Router 的核心差异总结
| 功能模块 | React Router v6.30 | Vue Router v4 |
| :--- | :--- | :--- |
| **设计理念** | 以路由为核心的全栈应用框架 | 专注于路由匹配和导航的工具库 |
| **数据加载** | 内置 `loader` API，路由级数据预加载 | 无内置，需在 `onMounted` 中手动实现 |
| **表单处理** | 内置 `Form` 组件和 `action` API，统一处理表单提交 | 无内置，需手动编写表单逻辑 |
| **错误处理** | 内置 `errorElement`，路由级错误边界 | 无内置，需全局错误处理或手动 try/catch |
| **导航状态** | 内置 `useNavigation`，自动获取加载/提交状态 | 无内置，需手动维护 loading 状态 |
| **滚动恢复** | 可插拔的 `ScrollRestoration` 组件 | 内置 `scrollBehavior` 配置 |
| **导航阻塞** | 内置 `useBlocker`，支持离开页面提示 | 有 `beforeRouteLeave` 守卫，但功能较弱 |
| **局部数据更新** | 内置 `useFetcher`，不触发导航更新数据 | 无内置，需手动调用接口 |
| **路由配置** | 支持声明式和对象式两种写法 | 仅支持对象式写法 |















