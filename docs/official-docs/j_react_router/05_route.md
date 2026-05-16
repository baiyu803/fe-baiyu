
### 一、Route

- routes 路由是 React Router 应用中最重要的部分。它是传递给路由器创建函数的对象

```jsx
import { createBrowserRouter } from "react-router-dom";
const router = createBrowserRouter([
  {
    element: <Team />,
    path: "teams/:teamId",
    loader: async ({ request, params }) => {
      return fetch(
        `/fake/api/teams/${params.teamId}.json`,
        { signal: request.signal }
      );
    },
    action: async ({ request }) => {
      return updateFakeTeam(await request.formData());
    },
    errorElement: <ErrorBoundary />,
  },
  {
    element: <List />,
    path: "list",
  },
]);
```
- 也可以使用 JSX 声明路由，元素的 props 与路由对象的属性相同

```jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// 👇 用 createRoutesFromElements 把 JSX 转成路由配置
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* 动态路由 teams/:teamId */}
      <Route
        path="teams/:teamId"
        element={<Team />}
        loader={async ({ request, params }) => {
          return fetch(`/fake/api/teams/${params.teamId}.json`, {
            signal: request.signal,
          });
        }}
        action={async ({ request }) => {
          return updateFakeTeam(await request.formData());
        }}
        errorElement={<ErrorBoundary />}
      />

      {/* list 路由 */}
      <Route path="list" element={<List />} />
    </>
  )
);
```

::: tip
我更喜欢对象式写法，可能是Vue的思维习惯。官网提示大多数 React Router 用户习惯使用 JSX 风格，后续的示例多为使用 JSX。

- 但实际问了 AI 后，仍是对象写法偏多

- JSX 写法基本只用于老项目、简单项目等
:::


#### 1.1 类型声明

```js
interface RouteObject {
  path?: string;
  index?: boolean;
  children?: RouteObject[];
  caseSensitive?: boolean;
  id?: string;
  loader?: LoaderFunction;
  action?: ActionFunction;
  element?: React.ReactNode | null;
  hydrateFallbackElement?: React.ReactNode | null;
  errorElement?: React.ReactNode | null;
  Component?: React.ComponentType | null;
  HydrateFallback?: React.ComponentType | null;
  ErrorBoundary?: React.ComponentType | null;
  handle?: RouteObject["handle"];
  shouldRevalidate?: ShouldRevalidateFunction;
  lazy?: LazyRouteFunction<RouteObject>;
}
```

::: tip
loader、action、errorElement、ErrorBoundary、hydrateFallbackElement、HydrateFallback、lazy 都必须使用数据路由器 `createBrowserRouter`，否则无效
:::

:star2: `index`

- 确定该路由是否为**索引路由**

    - 索引路由会渲染到其父路由的 `Outlet` 中，地址为父路由的 URL（类似于默认子路由）

```jsx
<Route path="/teams" element={<Teams />}>
  <Route index element={<TeamsIndex />} />
  <Route path=":teamId" element={<Team />} />
</Route>
```

:star2: `children`

- 子路由配置，在对象数组中定义，接受一个数组，每个元素都是一个路由对象。

:star2: `caseSensitive`

- 指示路由是否区分大小写

```jsx
<Route caseSensitive path="/wEll-aCtuA11y" />
```

- 将匹配 "wEll-aCtuA11y"，不匹配 "well-actuA11y"

:star2: `id`

- 路由的唯一标识符

- 比如最典型的用途是用 `useRouteLoaderData` 通过路由 ID 来获取指定路由 loader 返回的数据

::: code-group
```js [路由]
const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    loader: rootLoader,
    Component: RootLayout,
    children: [
      {
        id: 'userList',
        path: 'users',
        loader: userListLoader,
        Component: UserList,
      },
    ],
  },
])
```
```jsx [某组件]
import { useRouteLoaderData } from 'react-router-dom'

function SomeComponent() {
  const rootData = useRouteLoaderData('root')
  const userListData = useRouteLoaderData('userList')

  return null
}
```
:::

:star2: `loader`

- 路由加载器在路由渲染之前被调用，并通过 `useLoaderData` 来获取加载器返回的数据

```jsx
<Route
  path="/teams/:teamId"
  loader={({ params }) => {
    return fetchTeam(params.teamId);
  }}
/>;

function Team() {
  let team = useLoaderData();
  // ...
}
```

:star2: `action`

- 路由操作函数，用于处理表单数据、提交数据等

```jsx
<Route
  path="/teams/:teamId"
  action={({ request }) => {
    const formData = await request.formData();
    return updateTeam(formData);
  }}
/>
```

:star2: `element` 与 `Component`

- 都是指定路由的渲染组件

- `element` 与 `Component` 是等价的，只是 `element` 是 React 元素，而 `Component` 是 React 组件类型

    - 它两是互斥的，新项目用的 `Component` 比较多

```jsx
const routes = [
  {
    path: '/users',
    element: <UserPage />,
  },
]
// 或
<Route path="/users" element={<UserPage />} />
```
```jsx
const routes = [
  {
    path: '/users',
    Component: UserPage,
  },
]
// 或
<Route path="/users" Component={UserPage} />
```

:star2: `errorElement` 与 `ErrorBoundary`

- 都是指定路由的错误处理组件

- 也是等价的，区别和上面一样

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RootErrorPage />,
    // 或
    ErrorBoundary: RootErrorBoundary,
  },
])
```

:star2: `hydrateFallbackElement` 与 `HydrateFallback`

- 服务端渲染并利用部分水合

:star2: `handle`

- 可以理解成 React Router 给每条路由预留的**自定义扩展字段**

    - 本身不参与路由匹配、不控制渲染和跳转，主要作用是提供一些业务元信息，然后通过 `useMatches` 来获取

```jsx
const routes = [
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: 'dashboard',
        Component: Dashboard,
        handle: {
          breadcrumb: '首页',
        },
      }
    ],
  },
]

...
import { useMatches } from 'react-router-dom'
const matches = useMatches()
```

:star2: `lazy`

- 路由级懒加载配置

- 当用户真正访问到这条路由时，才去加载这条路由相关的组件、loader、action、ErrorBoundary 等代码

::: code-group
```jsx [UserPage.tsx]
// pages/UserPage.tsx

export async function loader() {
  return getUserList()
}

export async function action() {
  // 表单提交、数据变更等
}

export function ErrorBoundary() {
  return <div>用户页面出错了</div>
}

export function Component() {
  return <UserPage />
}
```
```jsx [route.js]
const routes = [
  {
    path: '/users',
    lazy: () => import('@/pages/UserPage')
  },
]
```
:::

- 可以减少首屏包体积
- 按业务模块拆包


### 二、action

```jsx
<Route
  path="/song/:songId/edit"
  element={<EditSong />}
  action={async ({ params, request }) => {
    let formData = await request.formData();
    return fakeUpdateSong(params.songId, formData);
  }}
  loader={({ params }) => {
    return fakeGetSong(params.songId);
  }}
/>
```

- 路由操作函数，用于处理表单数据、提交数据等

- 官网具体的说法是当应用向路由发送非 GET 请求时，会调用路由的 action 函数。可以有以下几种方式

```jsx
// forms
<Form method="post" action="/songs" />;
<fetcher.Form method="put" action="/songs/123/edit" />;

// imperative submissions
let submit = useSubmit();
submit(data, {
  method: "delete",
  action: "/songs/123",
});
fetcher.submit(data, {
  method: "patch",
  action: "/songs/123/edit",
});
```

- 这几种方式可以先记着，后面会讲到


#### 2.1 两个参数属性

- `params` 是路由参数，`request` 是请求对象

    - 路由参数从动态段中解析出来的

    - `request` 是一个发送到路由的 `FetchRequest` 实例。最常见的用例是解析请求中的 `FormData` 数据。FormData 是一个键值对集合，用于表示表单数据

```js
<Form method="post">
  <input name="songTitle" />
  <textarea name="lyrics" />
  <button type="submit">Save</button>
</Form>;

// accessed by the same names
formData.get("songTitle");
formData.get("lyrics");
```

#### 2.2 throw 操作

- 可以在 action 函数中抛出错误，来触发错误处理组件的渲染

- 比如教程中的 demo

```jsx
import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

export async function action({ params }) {
  if(params.contactId === 'xlp1tzs') {
    throw new Error("Cannot delete this contact");
  }
  await deleteContact(params.contactId);
  return redirect("/");
}
```

#### 2.3 每个路由可处理多个操作

```jsx
async function action({ request }) {
  let formData = await request.formData();
  let intent = formData.get("intent");

  if (intent === "edit") {
    await editSong(formData);
    return { ok: true };
  }

  if (intent === "add") {
    await addSong(formData);
    return { ok: true };
  }

  throw json(
    { message: "Invalid intent" },
    { status: 400 }
  );
}

function Component() {
  let song = useLoaderData();

  // When the song exists, show an edit form
  if (song) {
    return (
      <Form method="post">
        <p>Edit song lyrics:</p>
        {/* Edit song inputs */}
        <button type="submit" name="intent" value="edit">
          Edit
        </button>
      </Form>
    );
  }

  // Otherwise show a form to add a new song
  return (
    <Form method="post">
      <p>Add new lyrics:</p>
      {/* Add song inputs */}
      <button type="submit" name="intent" value="add">
        Add
      </button>
    </Form>
  );
}
```

### 三、errorElement

- 在教程demo项目中，可以发现如果没有设置 `errorElement`，那么当抛出错误时，会默认渲染一个错误页面，提示用户出错了，这个页面是不可控的

- 可以通过 `errorElement` 来自定义错误页面组件

```jsx
<Route
  path="/invoices/:id"
  loader={loadInvoice}
  action={updateInvoice}
  element={<Invoice />}
  errorElement={<ErrorBoundary />}
/>;

function Invoice() {
  return <div>Happy {path}</div>;
}

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  return <div>Dang!{error.message}</div>;
}
```

- 当 `loader`、`action` 或组件渲染中抛出错误时，会渲染 `ErrorBoundary` 组件，在组件里，可以通过 `useRouteError` 来获取错误信息

    - 错误可以是执行的错误，也可以是手动 `throw` 抛出的错误


### 四、lazy

- 为了保持应用程序包较小并支持路由的代码分割，每个路由都可以提供一个**异步函数**来解析路由定义中不匹配的部分（loader，，action/ Component，element/ ErrorBoundary，errorElement等等）

- 实际例子上面已经给到。现在可以补充一个例子，就是多个路由或者子路由的代码块可以放在一个文件中，然后在路由定义中引入这个文件。

```jsx
let dashboardRoute = {
  path: "dashboard",
  async lazy() {
    let { Layout } = await import("./pages/Dashboard");
    return { Component: Layout };
  },
  children: [
    {
      index: true,
      async lazy() {
        let { Index } = await import("./pages/Dashboard");
        return { Component: Index };
      },
    },
    {
      path: "messages",
      async lazy() {
        let { messagesLoader, Messages } = await import(
          "./pages/Dashboard"
        );
        return {
          loader: messagesLoader,
          Component: Messages,
        };
      },
    },
  ],
};
```

### 五、loader

- 每个路由都可以定义一个“加载器”函数，以便在渲染路由元素之前向其提供数据

- 非常建议跟着教程手打一遍 demo，里面有几个例子


### 六、shouldRevalidate

- `shouldRevalidate` 是 `loader` 重新校验控制函数

    - 作用是当路由变化准备重新执行路由的 loader 时，先问一下 shouldRevalidate 是否真的需要重新执行 loader

- 比如路由从 `/users?page=1` 变成 `/users?page=2`，通常会重新执行 loader，因为 URl 变了，数据可能也变了

- 如果是 `/users?modal=a` 变成 `/users?modal=b`，通常不会重新执行 loader

```jsx
{
  path: '/users',
  loader: userListLoader,
  Component: UserList,
  shouldRevalidate: ({ currentUrl, nextUrl, defaultShouldRevalidate }) => {
    // 如果只是 modal 参数变化，不重新请求列表数据
    if (
      currentUrl.pathname === nextUrl.pathname &&
      currentUrl.searchParams.get('page') === nextUrl.searchParams.get('page') &&
      currentUrl.searchParams.get('keyword') === nextUrl.searchParams.get('keyword')
    ) {
      return false
    }

    return defaultShouldRevalidate
  },
}
```

- 一般默认兜底返回 `defaultShouldRevalidate`

- shouldRevalidate 函数接受的参数有很多，需要时可以查

    - `currentUrl` 当前路由的 URL
    - `nextUrl` 下一个路由的 URL
    - `defaultShouldRevalidate` React Router 默认判断结果
















