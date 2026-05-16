
### 一、Await

- 用于渲染延迟值并自动处理错误

```jsx{1,10-18}
import { Await, useLoaderData } from "react-router-dom";

function Book() {
  const { book, reviews } = useLoaderData();
  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.description}</p>
      <React.Suspense fallback={<ReviewsSkeleton />}>
        <Await
          resolve={reviews}
          errorElement={
            <div>Could not load reviews 😬</div>
          }
          children={(resolvedReviews) => (
            <Reviews items={resolvedReviews} />
          )}
        />
      </React.Suspense>
    </div>
  );
}
```

- 注意：`<Await>` 需要渲染在父元素 `<React.Suspense>` 或 `<React.SuspenseList>` 子元素内，以启用备注 UI

#### 1.1 类型生命

```ts
declare function Await(
  props: AwaitProps
): React.ReactElement;

interface AwaitProps {
  children: React.ReactNode | AwaitResolveRenderFunction;
  errorElement?: React.ReactNode;
  resolve: TrackedPromise | any;
}

interface AwaitResolveRenderFunction {
  (data: Awaited<any>): React.ReactElement;
}
```

#### 1.2 children 选项

- 可以是 react 元素，也可以是函数

    - 元素选项：直接渲染一个 react 元素

    - 函数选项：参数是 Promise 解析后的值，返回一个 react 元素

::: code-group
```jsx [元素]
<Await resolve={reviewsPromise}>
  <Reviews />
</Await>;

function Reviews() {
  const resolvedReviews = useAsyncValue();
  return <div>{/* ... */}</div>;
}
```
```jsx [函数]
<Await resolve={reviewsPromise}>
  {(resolvedReviews) => <Reviews items={resolvedReviews} />}
</Await>
```
:::


#### 1.2 errorElement 选项

- 当 Promise 被拒绝时，错误元素会代替子元素渲染

```jsx
<Await
  resolve={reviewsPromise}
  errorElement={<ReviewsError />}
>
  <Reviews />
</Await>;

function ReviewsError() {
  const error = useAsyncError();
  return <div>{error.message}</div>;
}
```

#### 1.3 resolve 选项

- 接受一个从 defer loader 返回的 Promise 值进行解析和渲染

```jsx{12-16,24,33}
import {
  defer,
  Route,
  useLoaderData,
  Await,
} from "react-router-dom";

// given this route
<Route
  loader={async () => {
    let book = await getBook();
    let reviews = getReviews(); // not awaited
    return defer({
      book,
      reviews, // this is a promise
    });
  }}
  element={<Book />}
/>;

function Book() {
  const {
    book,
    reviews, // this is the same promise
  } = useLoaderData();
  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.description}</p>
      <React.Suspense fallback={<ReviewsSkeleton />}>
        <Await
          // and is the promise we pass to Await
          resolve={reviews}
        >
          <Reviews />
        </Await>
      </React.Suspense>
    </div>
  );
}
```

### 二、Form

- 是对 HTML form 表单元素的封装

```jsx
import { Form } from "react-router-dom";

function NewEvent() {
  return (
    <Form method="post" action="events">
      <input type="text" name="title" />
      <input type="text" name="description" />
      <button type="submit">Create</button>
    </Form>
  );
}
```

- 需要确保输入项有 name，否则 `FormData` 将不会包含该字段的值

#### 2.1 action

- 表单提交到的 URL，与 form 默认使用完整 URL 不同的是，Form 使用的是当前组件路由的相对 URL

#### 2.2 method

- 表单提交方法，是 `post`、`get`、`put`、`delete` 等 HTTP 方法，默认是 `get`

::: tip
Form 组件会自动处理表单数据的提交，无需手动处理。但是项目中一般用的少，基本都是用封装好的组件库，了解就行
:::


### 三、Link

- 类似 vue-router 中的 router-link 组件，用于导航到其他路由

    - 原生超链接 a 标签会整页刷新

    - Link 组件是 SPA 无刷新跳转

```jsx
import { Link } from 'react-router-dom'

<Link to="/user/detail/123">查看详情</Link>
```


#### 3.1 relative

- 控制路由是「相对当前路由」跳转，还是「绝对路径」跳转，不添加 `relative 选项时，默认会是绝对路径跳转

- `relative` 有两个值

    - `path`：相对当前所在路由层级跳转（推荐企业级用）

    - `route`：相对路由对象

- 加啥当前有个页面是 `/users/123/edit`

```jsx
<Link to="detail">详情</Link>
// 结果：/detail （从根开始）

<Link to="detail" relative="path">详情</Link>
// 结果：/users/123/edit/detail

<Link to="../" relative="path">返回用户页</Link>
// 结果：/users/123
```

::: tip
相对当前所在路由跳转，除了使用 Link 组件，企业一般多用 `useNavigate`

```jsx
const navigate = useNavigate()

// 相对当前路径跳 log
navigate('log', { relative: 'path' })

// 回上一级
navigate('../', { relative: 'path' })
```
:::


#### 3.2 preventScrollReset

- 防止点击链接时滚动位置重置到窗口顶部

```jsx
<Link to="?tab=one" preventScrollReset={true} />
```

#### 3.3 state

- 为新位置设置一个有状态的值，该值存储在历史状态中，在对应路由组件中可以通过 `useLocation` 获取到

```jsx
<Link to="new-path" state={{ some: "value" }} />

let { state } = useLocation();
```

### 3.4 replace

- 是否替换当前路由，而不是添加到历史记录中

  - 不加 replace 时，是添加到历史记录中

```jsx
<Link to="/home" replace />
```

#### 3.5 reloadDocument

- 可用于跳出客户端路由

    - 没啥用，就是添加了相当于使用超链接 a


### 四、NavLink

- `Link` 单纯跳转，`NavLink` 继承 Link 所有功能 + 自带路由激活匹配，自动添加 active 类名

#### 4.1 className

- 和普通的 className 类似，但可以向其传递一个函数

```jsx
<NavLink
  to="/messages"
  className={({ isActive, isPending, isTransitioning }) =>
    [
      isPending ? "pending" : "",
      isActive ? "active" : "",
      isTransitioning ? "transitioning" : "",
    ].join(" ")
  }
>
  Messages
</NavLink>
```

#### 4.2 style

- 和普通的 style 类似，但可以向其传递一个函数

```jsx
<NavLink
  to="/messages"
  style={({ isActive, isPending, isTransitioning }) => {
    return {
      fontWeight: isActive ? "bold" : "",
      color: isPending ? "red" : "black",
      viewTransitionName: isTransitioning ? "slide" : "",
    };
  }}
>
  Messages
</NavLink>
```

#### 4.3 children

- 可以就渲染属性作为子元素传递，根据状态自定义内容

```jsx
<NavLink to="/tasks">
  {({ isActive, isPending, isTransitioning }) => (
    <span className={isActive ? "active" : ""}>Tasks</span>
  )}
</NavLink>
```

#### 4.4 end

- 更改了路由匹配逻辑，使其变得严格，只匹配完全匹配的路由

- 例如，`/tasks` 只能匹配 `/tasks`，但不会匹配 `/tasks/`、`/tasks/123` 等

    - 不加 end 时，是可以匹配的

```jsx
<NavLink to="/tasks" end />
```

#### 4.5 caseSensitive

- 是否开启大小写敏感匹配，默认是 false

```jsx
<NavLink to="/SpOnGe-bOB" caseSensitive />

// 不能匹配 /SpOnGe-bob
```

#### 4.6 reloadDocument

- 是否用于跳出客户端路由，默认是 false

#### 4.7 viewTransition

- 是否开启视图过渡，默认是 false

    - 开启后，过渡期间会向元素添加一个 class 名，为 `a`

```jsx
<NavLink to={to} viewTransition>
  <p>Image Number {idx}</p>
  <img src={src} alt={`Img ${idx}`} />
</NavLink>


a.transitioning p {
  view-transition-name: "image-title";
}

a.transitioning img {
  view-transition-name: "image-expand";
}
```


### 五、Navigate

- 用于导航到其他路由，与 Link 组件类似，只是它是一个函数组件，而不是一个类组件，所以不能在 JSX 中直接使用，需要在函数中调用

    - Link 是点击跳转，Navigate 是程序自动跳转，或者说是重定向

```jsx
import { Navigate } from "react-router-dom";

if (!token) {
  // 自动跳登录，用户看不见任何东西
  return <Navigate to="/login" replace />
}
```


### 六、Outlet

- 用于渲染子路由组件，通常用于路由组件中，根据路由匹配结果，渲染不同的子路由组件

### 七、Route 和 Routes

```jsx
<Routes>
  <Route path="/" element={<Dashboard />}>
    <Route
      path="messages"
      element={<DashboardMessages />}
    />
    <Route path="tasks" element={<DashboardTasks />} />
  </Route>
  <Route path="about" element={<AboutPage />} />
</Routes>
```

- 在数据 router 中，通常不建议这么用


### 八、ScrollRestoration

- 用来做浏览器前进 / 后退时，自动恢复滚动位置

```jsx
import { ScrollRestoration, RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([...])

function App() {
  return (
    <>
      <RouterProvider router={router} />
      {/* 全局放一个即可，整个项目生效 */}
      <ScrollRestoration />
    </>
  )
}
```

- 上面添加后作用于全局，但是有些时候，页面就是想回到顶部，怎么做呢？有多种方式

::: tip
- 先懂原理

    - `<ScrollRestoration>` 默认用 `location.key` 作为滚动缓存 `key`
    
    - 只要改变 key，滚动记录就会清空 → 返回时自动回到顶部

```jsx
<ScrollRestoration
  getKey={(location) => location.pathname}
/>
```
:::

:star: 方式一 

- 给跳转添加 state

```jsx
<Link 
  to="/user/123/edit"
  state={{ scrollToTop: true }}
>
  编辑
</Link>
```
- 然后手动判断自定义 getKey
```jsx
<ScrollRestoration
  getKey={(location) => {
    // 如果标记了 scrollToTop，就用新key，清空滚动
    return location.state?.scrollToTop
      ? Date.now().toString()
      : location.key;
  }}
/>
```

:star: 方式二 

- 单个页面强制不恢复滚动，使用 `useScrollRestoration`

```jsx
import { useScrollRestoration } from 'react-router-dom'

export default function UserList() {
  const scrollRestore = useScrollRestoration()

  useEffect(() => {
    // 进入该页面强制回到顶部
    scrollRestore.reset()
  }, [scrollRestore])

  return <div>用户列表</div>
}
```

:star: 方式三 

- 路由粒度控制

```jsx
{
  path: 'detail/:id',
  element: <Detail />,
  handle: { scrollRestoration: 'top' } // 自定义标记
}
```
```jsx
<ScrollRestoration
  getKey={(location, matches) => {
    const match = matches.at(-1)
    if (match?.handle?.scrollRestoration === 'top') {
      return Date.now().toString()
    }
    return location.key
  }}
/>
```




