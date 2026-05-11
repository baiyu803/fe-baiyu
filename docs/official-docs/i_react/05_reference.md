::: info
前面的章节是 React 官网的入门教程，参考页面是 React 官方核心 [API 手册](https://zh-hans.react.dev/reference/react)

- 主要讲的是

    - React 核心

        - Hooks：组件里用的 React 特性

        - 内置组件：可直接写在 JSX 的官方组件

        - 顶层 API：定义组件、创建元素、优化渲染

        - 指示符：给打包器用的 RSC 相关指令

    - React DOM（Web 专用）

        - 浏览器环境专属 Hooks、API

        - 客户端 / 服务端渲染 API

    - React 编译器

    - React Hook 的 EsLint 插件

    - React 规则

    - 过时 API
:::
::: tip
对于笔记来说，该章节只做对前面章节的补充，完整学习请查看官网
:::


### 一、React 内置 Hook

官网列举了 18 个内置 Hook

- 必须掌握的：`useState useEffect useRef useContext useReducer useMemo useCallback useLayoutEffect`

- 了解即可：`useActionState useId useImperativeHandle useDeferredValue useTransition useOptimistic useEffectEvent`

- 可以不用管：`useDebugValue useInsertionEffect useSyncExternalStore`


#### 1.1 必须掌握的 Hook

前面章节已经学习了 `useState useEffect useRef useContext useReducer`，所以只补充 `useMemo useCallback useLayoutEffect`

:star2: **useMemo**

- `useMemo` 是 React 内置的**性能优化 Hook**，核心作用是：缓存一个计算结果，避免组件每次重渲染时重复执行高开销的计算逻辑

```jsx
const cachedValue = useMemo(calculateValue, dependencies)
```
- `calculateValue` 是一个函数，用于计算缓存的值 （纯函数，不能写 API 请求、定时器、Dom操作等副作用）

- `dependencies` 是一个数组，用于指定缓存的依赖项，当依赖项发生变化时，缓存的值会重新计算

    - 依赖不能是对象数组，不能不写

看一个完整的例子

```jsx
import { useState, useMemo } from 'react';

// 模拟一个高开销的计算函数
function getExpensiveList(filter, list) {
  console.log('高开销计算执行了');
  return list.filter(item => item.includes(filter));
}

export default function App() {
  const [filter, setFilter] = useState('');
  const [count, setCount] = useState(0);
  const list = ['apple', 'banana', 'orange', 'grape'];

  // ✅ 使用 useMemo：只有 filter 或 list 变化时才重新计算
  const filteredList = useMemo(() => {
    return getExpensiveList(filter, list);
  }, [filter, list]);

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>加1</button>
      <ul>
        {filteredList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

:eight_spoked_asterisk: 可记忆 JSX ，也可以记忆另一个 Hook 依赖

- 两种写法功能上是相同的

::: code-group
```jsx [第一种写法]
export default function TodoList({ todos, tab, theme }) {
  // 告诉 React 在重新渲染之间缓存你的计算结果...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...所以只要这些依赖项不变...
  );
  return (
    <div className={theme}>
      {/* ... List 也就会接受到相同的 props 并且会跳过重新渲染 */}
      <List items={visibleTodos} />
    </div>
  );
}
```
```jsx [第二种写法]
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```
:::

:eight_spoked_asterisk: 可记忆一个函数

```jsx
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

- 这看起来很笨拙，记忆函数很常见，但 React 有一个专门的内置 Hook `useCallback`，用于缓存一个函数，避免每次重渲染时都创建一个新的函数

::: tip
不要滥用 useMemo，它本身也有性能开销
:::


:star2: **useCallback**

- 允许在多次渲染中缓存一个函数，避免每次重渲染时都创建一个新的函数

```jsx
const cachedFn = useCallback(fn, dependencies)
```
- 将上面 useMemo 缓存一个函数的写法改成 useCallback

```jsx
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```


::: tip
`useCallback` 只应作用于性能优化，不要滥用

- 使用它缓存函数仅在少数情况下有意义

  - 将其作为 props 传递给包装 `memo` 中的组件

  - 传递的函数可能作为某些 Hook 的依赖项
:::

:star2: **useLayoutEffect**

::: danger
`useLayoutEffect` 可能会影响性能，尽可能使用 `useEffect`

但仍需要掌握使用
:::

- `useLayoutEffect` 是 `useEffect` 的一个版本，在**浏览器重新绘制屏幕之前触发**

  - 一般是用来在浏览器重新绘制屏幕前计算布局

```jsx
useLayoutEffect(setup, dependencies?)
```

- 和 useEffect 一样，`setup` 是一个函数，用于在组件挂载或更新时执行副作用操作，可以返回一个清理函数

- Effect 只在客户端上运行，在服务端渲染中不会运行

- 如果在 useLayoutEffect 内部触发状态更新，React 将立即执行所有剩余的 Effects，包括 useEffect

```jsx
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // 你还不知道真正的高度

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // 现在重新渲染，你知道了真实的高度
  }, []);

  // ... 在下方的渲染逻辑中使用 tooltipHeight ...
}
```

- 在这个例子中，有个需要注意的地方，初次挂载时，会执行 useLayoutEffect ，这里测量了高度，更新状态会立即出发重新渲染

  - 也就是说 Tooltip 组件进行了两次渲染，一次是 tooltipHeight 为 0，一次是 tooltipHeight 为真实高度

::: tip
这里就有一个和 useEffect 不同的地方。虽然 useLayoutEffect 也是两次渲染，但是实际看到的是最新的那一次，简单的说就是没有闪烁的问题。如果使用下面的代码，会发现组件是有闪烁的情况

```jsx
useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
}, []);
```
:::

#### 1.2 了解即可的 Hook

:arrow_right: **useActionState**

- 是 React 19 新增的内置 Hook，主要用于表单 Action 场景

```jsx
const [state, formAction, isPending] = useActionState(action, initialState);
```
- `action` 是自己定义的提交逻辑函数，`formAction` 是 React 包装后的 action

- 处理表单提交后的返回状态，提交中的状态，服务端Action的执行结果

```jsx
function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    error: null
  });

  return (
    <form action={formAction}>
      <input name="username" />
      <input name="password" type="password" />

      <button disabled={isPending}>
        {isPending ? '登录中...' : '登录'}
      </button>

      {state.error && <p>{state.error}</p>}
    </form>
  );
}
```

:arrow_right: **useId**

- 生成稳定且唯一的 Id

- 一般情况下可能会使用下面两种方式生成id

```jsx
const id = Math.random();
const id = Date.now();
```
- 但是在 React SSR 中，这两种方式会出现问题，因为

```txt
服务端生成的 id
≠
客户端 hydration 时生成的 id
```

- 所以一般会使用 `useId` 来生成 id，解决 SSR 场景下客户端和服务端 id 不一致的问题

```jsx
import { useId } from 'react';

function Input() {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>用户名</label>
      <input id={id} />
    </>
  );
}
```


:arrow_right: **useImperativeHandle**

- 低频使用但重要的 Hook，一句话：**控制父组件通过 ref 能拿到什么**。之前章节有控制只能到子组件的 focus 方法

::: code-group
```jsx [父组件]
function App() {
  const ref = useRef();

  return (
    <>
      <MyInput ref={ref} />

      <button onClick={() => ref.current.focus()}>
        聚焦
      </button>

      <button onClick={() => ref.current.clear()}>
        清空
      </button>
    </>
  );
}
```
```jsx [子组件]
import { useRef, useImperativeHandle } from 'react';

const MyInput = (ref => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },

      clear() {
        inputRef.current.value = '';
      }
    };
  });

  return <input ref={inputRef} />;
});

export default MyInput;
```
:::

- 这里父组件通过 ref 只能拿到子组件的 focus 方法 clear 方法

::: tip
为什么业务里不高频，因为 React 更推荐声明式 API，Imperative 是命令式的意思

那 React 为什么要提供它呢，因为现实世界存在命令式需求，它作为声明式体系里的“逃生口”

多用于一些动词，比如聚焦、清空、提交、关闭等
:::

:arrow_right: **useDeferredValue**

- React 18 提供的并发特性 Hook，用于延迟低优先级 UI 的更新

- 和防抖不同的是，防抖需要指定固定延迟时间，而 `useDeferredValue` 没有固定的延迟时间，React 会在浏览器空闲时更新低优先级 UI

```jsx
const deferredValue = useDeferredValue(value,initialValue?)
```

- `value` 是需要延迟更新的值，`initialValue` 是初始值，可以没有

- 看下面两例子
::: code-group
```jsx [未使用延时更新]
function App() {
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <BigList text={text} />
    </>
  );
}
```
```jsx [使用延时更新]
function App() {
  const [text, setText] = useState('');

  const deferredText =
    useDeferredValue(text);

  return (
    <>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <BigList text={deferredText} />
    </>
  );
}
```
:::

- 如果 BigList 很重，input 每次输入都会触发 BigList 的更新，导致性能问题。

- 所以使用 `useDeferredValue` 可以避免这个问题，只在浏览器空闲时更新 BigList，避免阻塞 UI 更新。

:arrow_right: **useTransition**

- 属于并发渲染的核心 Hook，但是使用频率不算高，不过很重要。它是**把某些 state 更新标记为“低优先级更新”**

```jsx
const [isPending, startTransition] = useTransition();

// 然后
startTransition(() => {
  setXXX(...)
});
```
- 意思是，这里的更新不着急，优先处理用户交互，再处理 Transition 更新

- 看两个例子
::: code-group
```jsx [未使用Transition]
function App() {
  const [text, setText] = useState('');
  const [list, setList] = useState([]);

  function handleChange(e) {
    const value = e.target.value;

    setText(value);

    // 很重
    setList(generateBigList(value));
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />

      <BigList list={list} />
    </>
  );
}
```
```jsx [使用Transition]
function App() {
  const [text, setText] = useState('');
  const [list, setList] = useState([]);

  const [isPending, startTransition] =
    useTransition();

  function handleChange(e) {
    const value = e.target.value;

    // 高优先级
    setText(value);

    // 低优先级
    startTransition(() => {
      setList(generateBigList(value));
    });
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />

      {isPending && <p>更新中...</p>}

      <BigList list={list} />
    </>
  );
}
```
:::

- 它本质是告诉 React 这里的更新是低优先级的，可以被打断，不需要立刻完成

  - transition 更新，可以中断，可以丢弃，可以重做

  - 比如用户输入 a、ab、abc、abcd。React 可能直接跳过前端的更新，只渲染最后一次


::: tip
`useTransition` 和 `useDeferredValue` 的区别

- 前者是延迟更新逻辑，自己控制处理，然后是延迟值，React 自动处理

两者一般都使用在搜索筛选、tab切换、AI应用（md渲染）、图标、虚拟大列表等场景下
:::

:arrow_right: **useOptimistic**

- React 19 里的 Hook，使用频率偏低，但有变多趋势。它是“乐观更新”，先假装成功，再等服务器结果

```jsx
const [optimisticState, addOptimistic] = useOptimistic(state, updateFn?);
```

- `optimisticState` 是乐观更新后的 state，`addOptimistic` 是添加乐观更新的函数

- `state` 是当前 state，`updateFn` 是更新函数

::: code-group
```jsx [父组件]
function App() {
  const [todos, setTodos] = useState([]);

  async function saveTodo(text) {
    const newTodo =
      await api.createTodo(text);

    setTodos(prev => [
      ...prev,
      newTodo
    ]);
  }

  return (
    <TodoList
      todos={todos}
      saveTodo={saveTodo}
    />
  );
}
```
```jsx [子组件]
function TodoList({ todos, saveTodo }) {

  const [
    optimisticTodos,
    addOptimisticTodo
  ] = useOptimistic(
    todos,
    (state, newTodo) => [
      ...state,
      newTodo
    ]
  );

  async function handleAdd(text) {

    const optimisticTodo = {
      id: Date.now(),
      text
    };

    // 临时显示
    addOptimisticTodo(optimisticTodo);

    try {
      // 真正请求
      await saveTodo(text);

    } catch {
      // 不做任何事
      // 因为真实todos没更新
      // optimistic自然消失
    }
  }
}
```
:::

::: tip
观察上面的例子，会发现 addOptimisticTodo 仅仅是临时更新 UI，至于请求失败的UI回退，是另外的逻辑
:::

:arrow_right: **useEffectEvent**

- 也是 React 19 新增的 Hook。它能解决 `useEffect` 的**闭包陷阱**问题

- 一句话总结，在 effect 内，拿到最新的state，但又不让 effect 重新执行

- 看两个例子

::: code-group
```jsx [未使用useEffectEvent]
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      +1
    </button>
  );
}
```
```jsx [使用useEffectEvent]
import {
  useEffect,
  useEffectEvent
} from 'react';

function App() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    console.log(count);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      onTick();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      +1
    </button>
  );
}
```
:::

- 未使用例子里，不管 count 怎么变化，打印的都是 0

- 使用例子里，打印的都是最新的 count 值

  - 可以理解为，useEffectEvent 定义 Effect 专用事件函数，函数本身稳定，但内部 state 永远最新


### 二、React 内置组件

官网有提到六个，其中一个是实验性的。必须掌握`<Fragment>`、`<Suspense>`、`<StrictMode>`；理解`<Profiler>`；了解 `<Activity>` 和实验性的`<ViewTransition>`

#### 2.1 `<Fragment>`

- 不会生成真实 DOM 的包裹容器

- 常见用法是使用 `<>` 包裹多个子元素，避免生成额外的 DOM 元素，提高性能

```jsx
<>
  <Header />
  <Main />
</>
```
- 完整用法是 `<Fragment>`

```jsx
import { Fragment } from 'react';

<Fragment>
  <Header />
  <Main />
</Fragment>
```
- 只有在需要添加 `key` 时，才需要使用 `<Fragment>`

```jsx
items.map(item => (
  <Fragment key={item.id}>
    <dt>{item.title}</dt>
    <dd>{item.content}</dd>
  </Fragment>
))
```

- 即使是完整写法，也不会产生额外元素


#### 2.2 `<Suspense>` 

- 它是 React 提供的一个**异步渲染边界组件**。核心作用是当子组件还没准备好时，先显示 fallback

```jsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```
```txt
SomeComponent 没加载完成
↓
先显示 Loading
↓
准备好后再切换回来
```

- *它代表 React 从同步渲染走向异步渲染*，是 React 18/19 最大架构变化之一

- 最经典场景：懒加载。不使用 `<Suspense>` 时

```jsx
const Page = lazy(() => import('./Page'));
```
- 加载过程中没有 UI

- 使用 `<Suspense>` 后

```jsx
import { lazy, Suspense } from 'react';

const Page =
  lazy(() => import('./Page'));

function App() {
  return (
    <Suspense fallback={<h1>加载中...</h1>}>
      <Page />
    </Suspense>
  );
}
```
```txt
Page JS还没下载完
↓
显示 fallback
↓
下载完成
↓
渲染真实组件
```

::: tip
Suspense 的本质不是 lading，而是**等待某个异步依赖**，这个异步依赖可能是 JS chunk、数据请求、图片、Server Component 等

React 内部机制
```txt
捕获 Promise
↓
暂停当前渲染
↓
显示 fallback
↓
Promise resolve
↓
继续渲染
```
:::

- `<Suspense>` 内的组件可以是嵌套的，嵌套普通组件的话，需要所有组件都准备好，才会显示真实组件

- 也可以在 `<Suspense>` 内嵌套多个异步组件，每个组件都有自己的 fallback。嵌套异步组件时，不需要等待所有组件都准备好，只需要有一个组件准备好，就会显示真实组件，其他组件的 fallback 就会被隐藏


::: tip
- 只有启用了 Suspense 的数据源才会激活 Suspense 组件，它们包括：

  - 支持 Suspense 的框架如 Relay 和 Next.js。

  - 使用 lazy 懒加载组件代码。

  - 使用 use 读取缓存的 Promise 值。
:::


#### 2.3 `<StrictMode>`

- 它是 React 提供的一个**严格模式组件**。核心作用是开启严格模式，帮助发现潜在的问题。

  - 是开发阶段检查工具组件

- 可以为整个应用启用严格模式

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
- 也可以给部分组件开启

```jsx
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```
::: tip
开启严格模式有，仅在开发环境下有效的行为：

- 组件将 **额外重新渲染一次** 以查找由于非纯渲染而引起的错误。
- 组件将 **额外重新运行一次 Effect** 以查找由于缺少 Effect 清理而引起的错误。
- 组件将 **额外重新运行一次 refs 回调** 以查找由于缺少 ref 清理函数而引起的错误。
- 组件将被 **检查是否使用了已弃用的 API**。
:::


#### 2.4 `<Profiler>` 

- 这个组件只需要理解就行，它允许你编程式测量 React 树的渲染性能

```jsx
import { StrictMode, Profiler } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const onRender = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
  console.log(id, phase, actualDuration, baseDuration, startTime, commitTime)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Profiler id="App" onRender={onRender}>
      <App />
    </Profiler>
  </StrictMode>,
)
```

- 也可以给部分组件测试

::: danger
进行性能分析会增加一些额外的开销，因此 **在默认情况下，它在生产环境中是被禁用的**。如果要启用生产环境下的性能分析，你需要启用 特殊的带有性能分析功能的生产构建
:::

#### 2.5 `<Activity>` 和 `ViewTransition`

- 了解下就行

- Activity，用于控制 UI 活跃状态的 React 新组件，方向偏页面生命周期、后台保活和资源调度，目前生态使用极少

- ViewTransition，用于实现页面切换和共享元素过渡动画的 React 新组件，本质基于浏览器 View Transition API，目标是让 Web 拥有接近原生 App 的转场体验，目前仍偏实验性


### 三、React 内置 API

官网有提到12个，其中3个实验性的。必须掌握`createContext`、`lazy`、`memo`、`startTransition`、`use`、`cache`；其他不管，需要时再查看


#### 3.1 `createContext`

- 是跨组件共享数据的 API，之前章节有讲过

#### 3.2 `lazy` 

- 组件懒加载 API

  - 组件需要时再加载，而不是一开始全部打包下载

```jsx
// 常规写法
import UserPage from './UserPage';

// 懒加载写法
import { lazy, Suspense } from 'react';

const UserPage = lazy(() => import('./UserPage'));

function App() {
  return (
    <Suspense fallback={<h1>加载中...</h1>}>
      <UserPage />
    </Suspense>
  );
}
```
- 使用组件懒加载，**webpack/Vite 会自动代码分割，生成独立 chunk**，只在需要时加载

::: tip
只能 default export 要懒加载的组件，不能命名导出
:::

#### 3.3 `memo` 

- **组件级缓存优化 API**，当 props 没变化时，跳过组件重新渲染

- 常用写法

```jsx
import { memo } from 'react';

const MemoButton = memo(function SomeComponent(props) {
  // ...
});
// 或者
function Button(props) {return <button {...props}>按钮</button>}
export default memo(Button);
```
::: tip
memo 只比较 props，不比较 state、context。且它是 **浅层比较**，只能比较基本类型和对象的引用地址。
:::

#### 3.4 `startTransition` 

- **低优先级更新 API**

- 和 `useTransition` 很像，但是它是 API 函数，可以直接用

```jsx
startTransition(() => {})
```

- 看下面的使用实例，其实和上面的 `useTransition` 一样，就是缺了个 pending 状态

```jsx
import { startTransition } from 'react';

function handleChange(e) {
  const value = e.target.value;

  // 高优先级
  setText(value);

  // 低优先级
  startTransition(() => {
    setList(generateBigList(value));
  });
}
```

#### 3.5 `use`

- 是 React 19 新增的**读取异步资源的 API**

  - 核心作用是直接在组件里读取 Promise

```jsx
const data = use(fetchData());
```

- `use` 也代表 React 正在进入“异步组件时代”

  - 以前 React 组件必须同步 render，现在可以“等待异步资源”

- 对比下面传统和现在获取数据的方式

::: code-group
```jsx [传统]
function User() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  if (!user) {
    return <Loading />;
  }

  return <div>{user.name}</div>;
}
```
```jsx [现在]
import { Suspense, use } from 'react';

function User() {
  const user = use(fetchUser());

  return <h1>{user.name}</h1>;
}

export default function App() {
  return (
    <Suspense fallback={<p>加载中...</p>}>
      <User />
    </Suspense>
  );
}
```
:::

::: tip
它给变了 React 数据获取模式

旧模式：render > effect > fetch > setState > rerender

use 模式: render 时直接拿数据
:::


#### 3.6 `cache`

- **函数结果缓存 API**

- 当函数的参数没有变化时，缓存结果，避免重复计算

```jsx
import { cache } from 'react';

const getUser = cache(async (id) => {
  console.log('fetch user');

  const res =
    await fetch(`/api/user/${id}`);

  return res.json();
});

async function Profile() {
  const user = await getUser(1);

  return <div>{user.name}</div>;
}

async function Sidebar() {
  const user = await getUser(1);

  return <div>{user.email}</div>;
}
```


### 四、React-dom 内置 Hook

- 官网只提供了 `useFormStatus` 一个 Hook，用于获取表单状态

```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? '提交中...' : '提交'}
    </button>
  );
}

function Form() {
  async function submit(formData) {
    // 提交逻辑
  }

  return (
    <form action={submit}>
      <input name="name" />
      <SubmitButton />
    </form>
  );
}
```

- 因为 `SubmitButton` 在 `<form>` 内部，所以能感知这个表单是否正在提交

::: tip
`useFormStatus` 只能读取 **父级form** 的状态。也就是说，它只能在 `<form>` 内部使用。
:::


### 五、React-dom 内置 API

官网提供了8个API，其中 `createPortal` 是要掌握，`flushSync` 要理解，其他6个资源提示类 API 了解即可

#### 5.1 `createPortal` 

- 把 React 子树渲染到另一个 DOM 节点里

  - 逻辑上它还是当前组件的子节点，视觉和 DOM 位置上却传送到了别的地方

- 有点类似 Vue3 中的 `Teleport` 组件

```jsx
createPortal(children, domNode, key?)
```

- children : 要传送的 React 子树
- domNode : 目标 DOM 节点，比如 `document.body` 或 `document.getElementById('modal-root')`
- key : 传送时的唯一标识，用于优化性能。一般很少手动用

```jsx
import { createPortal } from 'react-dom';

function Modal({ open, onClose, children }) {
  if (!open) return null;

  return createPortal(
    <div className="mask" onClick={onClose}>
      <div
        className="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export default function App() {
  return (
    <Modal open={true} onClose={() => {}}>
      <h2>标题</h2>
      <p>这是一个弹窗内容</p>
    </Modal>
  );
}
```

#### 5.2 `flushSync`

- 强制 React 立刻把回调里的更新刷到 DOM 上

  - 就是把本来可能会被批处理、延后提交的更新，改为同步完成

```jsx
flushSync(() => {})
```
- 尽量少使用，将它作为最后的手段，因为

  - 会影响性能

  - 不一定只刷新你回调里的更新

  - 可能让 Suspense 组件的 fallback 重新显示出来


#### 5.3 其他资源提示类 API

- prefetchDNS：先查 DNS
- preconnect：先建连接
- preload：先下载资源
- preloadModule：先下载 ESM 模块
- preinit：先下载并初始化脚本/样式
- preinitModule：先下载并初始化模块


### 六、客户端 API

官网说明了两个 API

#### 6.1 `createRoot`

- `createRoot` 是 React 客户端渲染的入口 API，用来在一个 DOM 容器上创建 React 根节点，再通过 `root.render()` 把应用挂载进去

```jsx
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <App />
)
```

- 一个完整的 React 应用一般只会有一个 `createRoot` 调用；如果只是给老页面局部加一点 React 功能，也可以有多个 root

- 可以调用 `root.unmount()` 销毁 React 根节点，释放内存


#### 6.2 `hydrateRoot`

- `hydrateRoot` 是 React 在客户端接管服务端已渲染 HTML 的入口 API，用来复用现有 DOM 并绑定 React 的事件和交互能力，使 SSR 页面变成真正可交互的应用

### 七、React 服务器组件

#### 7.1 服务器组件

- 定义：服务器组件是一种新型的组件，它在打包之前，在独立于客户端应用程序或 SSR 服务器的环境中提前渲染
  - 服务器组件返回给浏览器时不全是 HTML，而是首屏 HTML + 一份 RSC Payload（React Server Component Payload）
- 看完官网有些懵逼，所以结论先行，在看实例
::: info
- 它主要用在“既要 React 组件开发体验，又想把一部分渲染和取数放到服务端做”的场景里。两个核心用途：
  - 一类是在构建时读取静态内容并直接产出结果，避免把大依赖打进前端包
  - 另一类是在请求时直接访问数据层，在组件里取数据并渲染，减少客户端 useEffect + fetch 带来的二次请求和瀑布问题
```txt
你可以把它理解成：
以前：
浏览器先加载页面
再跑 JS
再 useEffect
再请求接口
再 setState 渲染
用了 Server Components 之后：
有些组件根本不去浏览器执行
它们在服务端把数据取好、内容拼好
浏览器拿到的是“已经算好的 UI 结果”
只有真正需要交互的部分，才下发到客户端执行
```
:::

- 看官网的一个例子
::: code-group
```jsx [未使用服务器组件]
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)
function Page({page}) {
  const [content, setContent] = useState('');
  // 注意: 在第一次页面渲染 **之后** 加载。
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```jsx [使用服务器组件]
import marked from 'marked'; // 不会包括在 bundle 中
import sanitizeHtml from 'sanitize-html'; // 不会包括在 bundle 中
async function Page({page}) {
  // 注意: 会在应用构建的 **渲染过程中** 加载
  const content = await file.readFile(`${page}.md`);
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
:::
- 现在有另一个问题，服务器组件更多是渲染展示，那怎么添加交互呢
  - 由于服务器组件不会发给浏览器，所以它们不能使用交互的 API，例如 useState。要给服务器组件添加交互性，可以使用 `"use client"` 指令把他们和客户端组件组合在一起
::: code-group
```jsx [服务器组件]
import Expandable from './Expandable';
async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```jsx [用于客户端的组件]
"use client"
export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```
:::

- 其工作原理是，首先将 Notes 作为服务器组件渲染，然后指引打包器为客户端组件 Expandable 创建一个包。在浏览器中，客户端组件会接收服务器组件的输出并作为 props 传递

::: tip
这节内容放在 Next.js App Router 中最好理解
因为在纯 React 里看 Server Components，容易只看见概念。
到了 Next.js 里就很具体了：
- app/page.tsx 默认就是服务器组件
- 可以直接在组件里 await fetch(...)
- 需要交互时再写 "use client"
- 页面、布局、数据获取、首屏渲染串起来就通了
:::

#### 7.2 Server Functions
- 它是让 Client Component 能“调用一个实际运行在服务器上的异步函数”的机制
- 和 Server Components 不是一回事
  - Server Components：组件本身在服务端渲染
  - Server Functions：函数在服务端执行，但可以被客户端触发调用
- Server Function 通常用 `"use server"` 标记。框架会自动为这个函数创建一个“服务器函数引用”。当客户端里调用它时，React 会发一个请求到服务器，让服务器执行这个函数，并把结果返回回来
  - 服务器函数可以在服务器组件中，也可以单独文件定义
::: info
在异步函数顶部添加 'use server' 以将该函数标记为可由客户端调用。我们将这些函数称为 服务器函数
```jsx
async function addToCart(data) {
  'use server';
  // ...
}
```
:::

- 看一个例子

::: code-group
```jsx [服务器函数文件]
// requestUsername.js
'use server';
export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```
```jsx [客户端组件]
// UsernameForm.js
'use client';
import { useActionState } from 'react';
import requestUsername from './requestUsername';
function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');
  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">请求</button>
      </form>
      <p>最后一次提交的请求的返回值： {returnValue}</p>
    </>
  );
}
```
:::

::: tip
参考页面还有其他的内容，比如服务端API、React Compiler、React 服务器组件等，有需要即学即用
:::






