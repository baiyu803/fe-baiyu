
### 一、json

- 是 React Router 专门用来在 `loader /action` 中返回 JSON 数据的工具函数

- 作用就是：把 JS 对象 → 标准 JSON 响应返回给组件

```jsx
import { json } from "react-router-dom";

const loader = async () => {
  const data = getSomeData();
  return json(data);
};
```

### 二、redirect

- 是 React Router 专门用来在 `loader /action` 中返回重定向响应的工具函数，用来重定向到另一个路由

```jsx
import { redirect } from "react-router-dom";

const loader = async () => {
  return redirect("/detail/123");
};
```

### 三、redirectDocument

|特性|redirect|redirectDocument|
|--|--|--|
|跳转方式|单页内部无刷新|整页浏览器刷新|
|速度|快|慢|
|状态保留|保留|清空|
|适用场景|登录失效、权限拦截、正常跳转|必须重置应用、清除缓存、跨域跳转|
|使用频率|极多|极少


### 四、replace



```jsx
return replace("/otherapp/login");
```

- 等价于

```jsx
return redirect("/otherapp/login", { replace: true });
```








