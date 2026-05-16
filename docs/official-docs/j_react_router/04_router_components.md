

### 一、`<BrowserRouter>`

- 这是 JSX 配置路由的写法，在配置路由时，JSX 和 `createBrowserRouter` 的对象写法在功能上没有任何区别，仅仅是一种风格偏好

    - 只是，在 v6 版本之后，有了数据 API，所以推荐对象写法

```jsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter basename="/app">
    {/* The rest of your app goes here */}
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
  </BrowserRouter>
);
```

- 也可以配置 `basename` 来添加前缀，例如 `/app`。


### 二、`<HashRouter>`

- 功能和 `BrowserRouter` 相同，只是在配置路由时，使用 URL 的哈希 (#) 部分来管理 "应用程序 URL"

- 使用区别前面有介绍

### 三、`<MemoryRouter>`

- 也是一样


::: tip
还有 `<NativeRouter>`，用在 React Native 中，以及 `<StaticRouter>`，用在服务端渲染中
:::















