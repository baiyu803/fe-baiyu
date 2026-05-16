
### 一、选择 Router

根据应用程序运行的环境，有几种路由可供选择

#### 1.1 使用 v6.4 数据 API

- 在 v6.4 中，引入了支持新数据 APIs 的新路由：

    - `createBrowserRouter`
    - `createMemoryRouter`
    - `createHashRouter`
    - `createStaticRouter`

- 以下路由不支持数据 API：

    - `<BrowserRouter />`
    - `<MemoryRouter />`
    - `<HashRouter />`
    - `<NativeRouter />`
    - `<StaticRouter />`

::: tip
建议在新应用程序中，使用 6.4 中的新路由函数，而不是旧的路由组件
:::

#### 1.2 web 项目

- 建议使用 `createBrowserRouter`

    - 如果将应用程序托管在静态文件服务器上，则需要将其配置为将所有请求发送到 index.html ，以避免出现 404 错误

- 如果由于某种原因无法使用完整的 URL，则可以使用 `createHashRouter`

- 对应的组件是 `<BrowserRouter />` 和 `<HashRouter />`


#### 1.3 测试

- 使用 `createMemoryRouter` 或 `<MemoryRouter />`

#### 1.4 React Native 项目

- 建议使用 `createNativeRouter` 或 `<NativeRouter />`


### 二、`createBrowserRouter`

- 它使用 DOM History API 来更新 URL 并管理历史记录栈

- 支持 v6.4 数据 API，例如 `loaders`、`actions`、`fetchers` 等

- 下面是它的类型定义

```js
function createBrowserRouter(
  routes: RouteObject[],
  opts?: {
    basename?: string;
    future?: FutureConfig;
    hydrationData?: HydrationState;
    dataStrategy?: DataStrategyFunction;
    patchRoutesOnNavigation?: PatchRoutesOnNavigationFunction;
    window?: Window;
  }
): RemixRouter;
```

- `routes` 是路由配置数组，每个路由配置都是一个对象，包含路由的路径、组件、子路由等信息

- `opts` 是路由选项对象，包含路由的配置信息，例如基础路径、未来配置、水合数据、数据策略、导航时的路由修补函数等

    - `basename` 是基础路径，用于在 URL 中添加前缀，例如 `/app`。这个是当无法将应用程序部署到域的根目录，而是部署到子目录时使用

    - 其他几个配置项用的不多，`patchRoutesOnNavigation` 是导航时的路由修补函数，用于在导航时动态修改路由配置，这个可以了解下。

```jsx{4,11-24}
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root, { rootLoader } from "./routes/root";
import Team, { teamLoader } from "./routes/team";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        path: "team",
        element: <Team />,
        loader: teamLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
```

### 三、`createHashRouter`

- 如果无法配置 Web 服务器将所有流量定向到 React Router 应用程序，那么这个路由就非常有用。它不使用普通 URL，而是使用 URL 的哈希 (#) 部分来管理 "应用程序 URL"

- 在功能使用上和 `createBrowserRouter` 相同

::: tip
不建议使用哈希 URL
:::


### 四、`createMemoryRouter`

- 内存路由不使用浏览器的历史记录，而是在内存中管理自己的历史堆栈

- 主要适用于 Storybook 等测试和组件开发工具，但也可用于在任何非浏览器环境中运行 React Router

- 对应的定义

```js
function createMemoryRouter(
  routes: RouteObject[],
  opts?: {
    basename?: string;
    future?: FutureConfig;
    hydrationData?: HydrationState;
    initialEntries?: InitialEntry[];
    initialIndex?: number;
  }
): RemixRouter;
```

- 使用例子

```jsx
import {
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";
import * as React from "react";
import {
  render,
  waitFor,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import CalendarEvent from "./routes/event";

test("event route", async () => {
  const FAKE_EVENT = { name: "test event" };
  const routes = [
    {
      path: "/events/:id",
      element: <CalendarEvent />,
      loader: () => FAKE_EVENT,
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ["/", "/events/123"],
    initialIndex: 1,
  });

  render(<RouterProvider router={router} />);

  await waitFor(() => screen.getByRole("heading"));
  expect(screen.getByRole("heading")).toHaveTextContent(
    FAKE_EVENT.name
  );
});
```

::: tip
一般项目开发也不会用到
:::

### 五、`<RouterProvider>`

- 所有数据路由对象都会传递给此组件，以渲染应用程序并启用其余数据 API

::: tip
官方提示：*由于数据 API 的设计中采用了数据获取和渲染分离的机制，你应该在 React 代码树之外创建路由器，并使用静态定义的路由集。*

- 这个意思是不要在单个组件里创建路由，也就是不要在组件渲染过程中临时创建路由

- 即：React Router 的 Data API 需要在组件渲染前就知道完整路由结构，这样它才能提前匹配路由、执行 `loader/action`、处理错误和管理导航状态。所以推荐把 `createBrowserRouter` 写在 React 组件外部，用静态路由配置创建一个稳定的 router，再通过 `<RouterProvider>` 挂到应用里
:::

```jsx{3,24-27}
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider
    router={router}
    fallbackElement={<BigSpinner />}
  />
);
```


::: tip
还有 `createStaticHandler`、`createStaticRouter`、`<StaticRouterProvider>`。不过都是和服务端渲染相关的，有需要在学习
:::
















