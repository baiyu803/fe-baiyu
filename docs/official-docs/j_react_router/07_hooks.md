
官网提供了很多 hook，有些必须掌握，有些了解，有些暂时不用看


### 一、必学 Hooks

- 一共有 10 个，分别是 `useActionData`、`useLoaderData`、`useLocation`、`useMatch`、`useNavigate`、`useNavigation`、`useOutletContext`、`useParams`、`useRouteError`、`useSearchParams`

#### 1.1 useActionData

- 专门用于处理数据路由中的表单提交（Actions）

  - 简单说，它就是用来获取表单提交后，服务端返回的响应数据的

- 当一个 `<Form>` 被提交，或者手动触发了 `useSubmit`，React Router 会调用当前路由对应的 `action` 函数。这个`action` 函数的返回值，就会通过 `useActionData` 提供给组件

- 返回值是什么

  - 当表单没有被提交过，或者当前路由没有 action，返回 `undefined`

  - 提交成功后，返回的就是 `action` 函数的返回值

  - 在 `action` 正在执行期间，`useActionData` 还是返回上一次提交的数据，不会清空

```jsx
import { Form, useActionData } from "react-router-dom";

// 对应的 action 函数（定义在路由配置里）
export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  
  // 模拟校验
  if (!email.includes("@")) {
    return { error: "请输入有效的邮箱地址" };
  }
  
  return { ok: true };
}

// 组件
function Newsletter() {
  const actionData = useActionData();

  return (
    <Form method="post">
      <input type="email" name="email" />
      <button type="submit">订阅</button>
      
      {actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p>}
      {actionData?.ok && <p style={{ color: 'green' }}>订阅成功！</p>}
    </Form>
  );
}
```

::: tip
`useActionData` 只在当前路由的 `action` 执行后才会有值，如果在父组件里调用是拿不到子路由值的

与 `useLoaderData` 区别在于，`useLoaderData` 是在路由加载完成后，返回路由配置里的 `loader` 函数的返回值，而 `useActionData` 是在表单提交后，返回 `action` 函数的返回值
:::


#### 1.2 useLoaderData

- 用来获取当前路由的 `loader` 函数返回的数据

  - 关键点：**loader 在组件渲染之前执行**，所有组件挂载时数据已经就绪，不会出现页面闪烁的情况

- 返回值是什么

  - 返回的是 `loader` 函数的返回值

  - 如果 `loader` 抛出 `Response` 对象（比如 404），则会触发 `errorElement` 选项

```jsx
// loader
export async function loader() {
  const posts = await fetch("/api/posts").then(r => r.json());
  return { posts };
}

// 组件
function BlogList() {
  const { posts } = useLoaderData();
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```
::: tip
`useLoaderData` 只在当前路由的 `loader` 执行后才会有值。但有提供 `useRouteLoaderData` 来获取其他路由的 `loader` 函数返回的数据
:::


#### 1.3 useLocation

- 用来获取当前页面的**路由信息对象**

- 返回的对象，包括以下常用属性

  - `pathname`：当前页面的路径名，比如 `/blog/123`

  - `search`：当前页面的查询参数，比如 `?page=2&sort=asc`

  - `hash`：当前页面的哈希值，比如 `#top`

  - `state`：通过 `navigate` 或 `<Link>` 传递的状态数据

  - `key`：当前历史条目的唯一标识


```jsx
import { useLocation } from "react-router-dom";

function CurrentPage() {
  const location = useLocation();
  
  console.log(location.pathname); // "/user/123"
  console.log(location.search);   // "?tab=profile"
  console.log(location.hash);     // "#bio"
  console.log(location.state);    // { from: "/home" }
  console.log(location.key);      // "abc123"

  return <div>当前路径：{location.pathname}</div>;
}
```

#### 1.4 useMatch

- 用来判断当前路径是否匹配某个特定模式

- 核心作用就是拿一个路径模式（pattern）去和当前 URL 做匹配，匹配成功就返回匹配信息，失败就返回 `null`

  - 只接受一个参数，就是路径模式（pattern）

```jsx
import { useMatch } from "react-router-dom";

function App() {
  const match = useMatch("/user/:id");

  console.log(match);
  // 如果当前路径是 /user/123，返回：
  // {
  //   params: { id: "123" },
  //   pathname: "/user/123",
  //   pathnameBase: "/user/123",
  //   pattern: { path: "/user/:id", ... }
  // }
  // 如果当前路径不匹配，返回 null
}
```

#### 1.5 useNavigate

- 用来做**命令式路由跳转**的 Hook。它返回一个 `navigate` 函数，可以在事件回调、登录成功、接口提交成功、定时跳转等场景里手动控制跳转

  - 就是让你可以实现编程式导航

```jsx
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    // 登录逻辑
    await login();

    // 登录成功后跳转
    navigate("/dashboard");
  };

  return <button onClick={handleLogin}>登录</button>;
}
```

- `navigate` 函数的参数

  - `to`：跳转的目标路径

  - `options`: 可选的配置对象，用于自定义跳转行为

    - `replace`：是否替换当前历史条目，而不是添加新的条目

    - `state`：通过 `navigate` 或 `<Link>` 传递的状态数据

    - `relative`：是否相对跳转，而不是绝对跳转

  - 也可以接收数字，实现前进后退

```jsx
navigate("/user/list");
navigate("/user/list?page=1&keyword=tom");
navigate(1);
navigate(-1);
navigate("/home", { replace: true });
navigate("/home", { state: { from: "/user" } });
navigate("/home", { relative: true });
```

::: tip
- 普通菜单跳转：`Link / NavLink`

- 事件完成后跳转：`useNavigate`

- loader/action 里跳转：`redirect`

- 权限组件渲染时跳转：`<Navigate />`
:::

#### 1.6 useNavigation

- 作用不是跳转，而是观察当前路由导航/提交/加载的状态

  - 可以用来做全局 loading、表单提交中的禁用状态、提交按钮 busy 状态、乐观 UI 等

  - 只在 Data Router 场景下有意义

- `useNavigation()` 返回的是一个 `navigation` 对象，常用字段有

```js
navigation.state;
navigation.location;
navigation.formData;
navigation.formAction;
navigation.formMethod;
navigation.formEncType;
```

- 最核心的是 `navigation.state`，它包含了当前导航的状态，比如 `loading`、`idle`、`submitting` 等。

```js
// 正常的导航和 GET 表单提交会经历以下状态
idle → loading → idle

// 使用 POST、PUT、PATCH 或 DELETE 提交的表单会经历以下状态：
idle → submitting → loading → idle

// 例子
import { useNavigation } from "react-router-dom";

const isSubmitting = navigation.state === "submitting";
```

- `navigation.formData` 可以做乐观 UI 等操作，它可以拿到当前正在提交的表单数据

```jsx
const navigation = useNavigation();

const creatingName = navigation.formData?.get("name");
```

#### 1.7 useOutletContext

- 用于子路由读取父路由 `<Outlet context={...} />` 传下来的数据的 Hook

  - 虽然有 React Context，但是在嵌套路由里，一般内置到了 `Outlet` 组件里，所以不需要自己实现

::: code-group
```jsx [DashboardLayout]
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  const user = {
    id: 1,
    name: "张三",
    role: "admin",
  };

  return (
    <div>
      <h1>后台系统</h1>

      <Outlet context={{ user }} />
    </div>
  );
}

export default DashboardLayout;
```
```jsx [Profile]
import { useOutletContext } from "react-router-dom";

function Profile() {
  const { user } = useOutletContext();

  return (
    <div>
      当前用户：{user.name}
    </div>
  );
}

export default Profile;
```
```jsx [对应路由]
const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);
```
:::

::: tip
多层嵌套路由要注意，`useOutletContext` 读取的是离当前子路由最近的那个 `<Outlet context={...} />` 提供的值
:::

#### 1.8 useParams

- 读取动态路由参数的 Hook，比如 `/user/:id` 里的 `id`

```jsx
{
  path: "/project/:projectId/task/:taskId",
  element: <TaskDetail />,
}
```
- 当访问 `/project/123/task/456` 时，`useParams` 会返回 `{ projectId: "123", taskId: "456" }`

```jsx
import { useParams } from "react-router-dom";

function TaskDetail() {
  const { projectId, taskId } = useParams();

  return (
    <div>
      <p>项目 ID：{projectId}</p>
      <p>任务 ID：{taskId}</p>
    </div>
  );
}
```

#### 1.9 useRouteError

- 专门配合 `errorElement / ErrorBoundary` 使用的 Hook

```text
loader / action / 组件渲染过程中抛错
        ↓
React Router 捕获错误
        ↓
渲染当前路由或父级路由的 errorElement
        ↓
errorElement 组件里用 useRouteError() 拿到错误信息
```

```jsx
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  console.error(error);

  return (
    <div>
      <h1>出错了</h1>
      <p>页面加载失败，请稍后重试</p>
    </div>
  );
}
```

- 如果子路由没有自己的 `errorElement`，错误会冒泡到父级最近的 `errorElement`。官方文档也明确说，没有 `errorElement` 的路由会把错误向父级冒泡


#### 1.10 useSearchParams

- 管理 URL 查询参数的 Hook，比如 `/user/list?page=1&keyword=tom` 里的 `keyword=tom`

  - 和 useState 很像，返回的是个数组，第一个元素是查询参数对象，第二个元素是更新查询参数的函数。

```jsx
const [searchParams, setSearchParams] = useSearchParams();

// 所有 search params 拿到的值都是字符串或者 null
const page = Number(searchParams.get("page") || 1);
const keyword = searchParams.get("keyword") || "";

setSearchParams({
  page: "1",
  keyword: "react",
});
```

- 通过 `setSearchParams` 更新查询参数，会触发路由重新渲染

  - 如果使用的是 Data Router，loader 默认也会重新校验执行

- `setSearchParams` 也支持函数式更新，比如

```jsx
setSearchParams((prev) => ({
  ...prev,
  page: "2",
}));
```

::: tip
- 一个很常见的坑，比如 `/users?page=3&keyword=react&status=active`

```jsx
setSearchParams({
  page: "1",
});
```

- 结果 URL 会变成 `/users?page=1`

- 所以，如果只是想改其中一个参数，建议基于旧参数修改

```jsx
setSearchParams((prev) => {
  const next = new URLSearchParams(prev);
  next.set("page", "1");
  return next;
});
```
:::

- 可以添加 `replace` 避免污染浏览器历史记录

```jsx
setSearchParams({
  page: "1",
}, {
  replace: true,
});
```


### 二、了解 Hooks

- 一共有 12 个，分别是 `useAsyncError`、`useAsyncValue`、`useBeforeUnload`、`useFetcher`、`useFormAction`、`useHref`、`useMatches`、`useRouteLoaderData`、`useRoutes`、`useSubmit`、`useBlocker`、`useNavigationType`、`useRevalidator`


#### 2.1 useAsyncError

- 配合 `<Await>` 使用的 Hook，返回**最近**的 Await 组件抛出的 rejection value

```jsx
import { Await, useAsyncError } from "react-router-dom";

function AsyncError() {
  const error = useAsyncError();

  return (
    <div>
      异步数据加载失败：
      {error instanceof Error ? error.message : "未知错误"}
    </div>
  );
}

function Page() {
  return (
    <Await
      resolve={promiseThatMayReject}
      errorElement={<AsyncError />}
    >
      {(data) => <div>{data.name}</div>}
    </Await>
  );
}
```

#### 2.2 useAsyncValue

- 返回最近的 `<Await>` 父组件解析完成后的数据

```jsx
import { Await, useAsyncValue } from "react-router-dom";

function UserInfo() {
  const user = useAsyncValue() as {
    id: number;
    name: string;
  };

  return <div>用户：{user.name}</div>;
}

function Page() {
  return (
    <Await resolve={userPromise}>
      <UserInfo />
    </Await>
  );
}
```

```txt
1. <Await resolve={userPromise}> 等待异步数据
2. Promise 成功后，渲染 children
3. children 里的组件用 useAsyncValue() 读取成功值
```

#### 2.3 useBeforeUnload

- 对浏览器原生 `window.onbeforeunload / beforeunload` 事件的一个封装 Hook

  - 用户刷新、关闭标签页、离开当前页面前，执行一些逻辑

```jsx
import { useBeforeUnload } from "react-router-dom";
import { useCallback, useState } from "react";

function EditPage() {
  const [content, setContent] = useState("");

  useBeforeUnload(
    useCallback(() => {
      localStorage.setItem("draft", content);
    }, [content])
  );

  return (
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  );
}
```

#### 2.4 useFetcher

- 用来做不改变当前 URL、不跳转页面的 `loader/action` 请求

  - 在当前页面里偷偷调用某个 `loader/action`，但不发生路由跳转

```jsx
import { useFetcher } from "react-router-dom";

function FavoriteButton({ id, favorited }) {
  const fetcher = useFetcher();

  const isSubmitting = fetcher.state === "submitting";

  return (
    <fetcher.Form method="post" action={`/items/${id}/favorite`}>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "处理中..." : favorited ? "已收藏" : "收藏"}
      </button>
    </fetcher.Form>
  );
}
```
- 点击按钮后，调用 `/items/:id/favorite` 这个路由的 `action`，但当前页面不跳走

#### 2.5 useHref

- 一个比较底层的 Hook，用来把一个 `to` 路径解析成最终可放到 `<a href="">` 上的 `href` 字符串

```jsx
import { useHref } from "react-router-dom";

function CustomLink() {
  const href = useHref("/users");

  return <a href={href}>用户列表</a>;
}
```

#### 2.6 useMatches

- 用来获取当前 URL 命中的所有路由匹配信息

  - 读取当前命中的整条路由链，包括父路由、子路由的 data、params、handle


#### 2.7 useRouteLoaderData

- 用来按 route id 读取某个路由的 loader 数据

```jsx
const data = useRouteLoaderData("root");
```

#### 2.8 useRoutes

- useRoutes 是 `<Routes>` 的函数式等价写法，只不过它用 JavaScript 对象来定义路由，而不是用 `<Route>` 元素

::: code-group
```jsx [普通JSX写法]
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:id" element={<UserDetail />} />
    </Routes>
  );
}
```
```jsx [useRoutes写法]
import { useRoutes } from "react-router-dom";

function App() {
  return useRoutes([
    { path: "/", element: <Home /> },
    { path: "/users", element: <UserList /> },
    { path: "/users/:id", element: <UserDetail /> },
  ]);
}
```
:::

#### 2.9 useSubmit

- 用来在 JS 代码里主动提交表单或数据

```jsx
import { Form, useSubmit } from "react-router-dom";

function SearchPage() {
  const submit = useSubmit();

  return (
    <Form method="get">
      <input
        name="keyword"
        onChange={(event) => {
          submit(event.currentTarget.form);
        }}
      />
    </Form>
  );
}
```

#### 2.10 useBlocker

- 用来阻止用户离开当前路由，并让你展示自定义确认 UI

  - 站内路由跳转拦截

```jsx
import { useBlocker } from "react-router-dom";
import { useState } from "react";

function EditPage() {
  const [value, setValue] = useState("");
  const isDirty = value.length > 0;

  const blocker = useBlocker(isDirty);

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {blocker.state === "blocked" && (
        <div>
          <p>你有未保存的内容，确定要离开吗？</p>

          <button onClick={() => blocker.proceed()}>
            确定离开
          </button>

          <button onClick={() => blocker.reset()}>
            取消
          </button>
        </div>
      )}
    </div>
  );
}
```


#### 2.11 useNavigationType

- 判断当前这次页面进入方式

  - 当前页面是通过 push、replace，还是浏览器前进/后退进来的

  - 返回值只有三种："POP"、"PUSH"、"REPLACE"

```jsx
import { useNavigationType } from "react-router-dom";

function Page() {
  const navigationType = useNavigationType();

  return <div>当前导航类型：{navigationType}</div>;
}
```

#### 2.12 useRevalidator

- 用来手动触发当前页面 loader 重新执行

  - 手动刷新当前路由数据

```jsx
import { useRevalidator } from "react-router-dom";

function RefreshButton() {
  const revalidator = useRevalidator();

  return (
    <button onClick={() => revalidator.revalidate()}>
      刷新数据
    </button>
  );
}
```








