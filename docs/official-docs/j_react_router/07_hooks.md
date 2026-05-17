
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









































### 二、了解 Hooks

- 一共有 12 个，分别是 `useAsyncError`、`useAsyncValue`、`useBeforeUnload`、`useBlocker`、`useFetcher`、`useFormAction`、`useHref`、`useMatches`、`useNavigationType`、`useRevalidator`、`useRouteLoaderData`、`useRoutes`、`useSubmit`
























