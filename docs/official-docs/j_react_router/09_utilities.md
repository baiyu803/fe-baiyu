
### 一、createSearchParams

- 快速创建 URL 查询参数

```jsx
import { Link, createSearchParams } from 'react-router-dom'

<Link
  to={{
    pathname: "/user/list",
    search: createSearchParams({
      keyword: "测试",
      page: 1,
      size: 10
    }).toString()
  }}
>
  查询用户
</Link>
```

- 等价于跳转 `/user/list?keyword=测试&page=1&size=10`

```jsx
const navigate = useNavigate()

navigate({
  pathname: "/search",
  search: createSearchParams({ id: 123, type: "edit" }).toString()
})
```

### 二、defer

- 允许通过传递 promise 而不是已解析的值来延迟 loader 返回的值

```jsx
async function loader() {
  let product = await getProduct();
  let reviews = getProductReviews();
  return defer({ product, reviews });
}
```

### 三、generatePath

- `generatePath` 将一组参数插入到带有占位符的路由路径字符串中

- 当希望从路由路径中移除占位符，使其静态匹配而不是使用动态参数时，此功能非常有用

```jsx
generatePath("/users/:id", { id: "42" }); // "/users/42"
generatePath("/files/:type/*", {
  type: "img",
  "*": "cat.jpg",
}); // "/files/img/cat.jpg"
```


### 四、isRouteErrorResponse

- 判断是否是路由错误响应，错误处理时使用

    - 用于判断错误是否是主动 throw 抛出，主动抛出为 true，被动抛出为 false

- 当为 true 时，error 包含
```jsx
{
  status: 401,        // HTTP 状态码
  statusText: "Unauthorized",
  data: { message: "请登录" }, // 你 json() 里传的数据
  internal: true,
}
```

- 例子：

```jsx
import { isRouteErrorResponse } from "react-router-dom";

function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops!</h1>
        <h2>{error.status}</h2>
        <p>{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
      </div>
    );
  } else {
    return <div>Oops</div>;
  }
}
```




