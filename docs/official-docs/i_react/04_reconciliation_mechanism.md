::: info
- 脱围机制，是 React 提供的一组**打破自身纯渲染、单向数据流、状态驱动更新范式**的底仓 API，用来让你**跳出 React 监控**，直接操作 DOM、外部系统、存储不触发渲染的数据、处理非 React 生命周期的副作用

    - **纯渲染**：组件函数只根据 props/state 计算 JSX，不能有副作用（操作 DOM、网络、定时器、监听等）

    - **状态驱动**：只有 state/props 变化才触发重渲染，数据单向流动
    - **虚拟 DOM 托管**：React 全权管理 DOM 更新，开发者不直接操作原生 DOM

- 简单一句话：React 正常流程管不到、管不好的场景，就用脱围机制；业务主体逻辑尽量不用
:::

### 一、使用 ref 引用值

- 当希望组件更新某些信息，还想记住它，但不触发重新渲染时，你可以使用 `ref`

    - 调用 `useRef` Hook 并传入一个初始值，返回一个带有 `current` 属性的对象，该属性的初始值就是你传入的初始值

    - 为什么说是记住，因为虽然 `ref` 是一个普通的 **js 对象**，但是它和 state 一样，在每次渲染时会保留之前的信息

```jsx
import { useRef, useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  // let ref = useRef(0);
  let ref = useRef(count);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('你点击了 ' + ref.current + ' 次！');
  }

  function handleClick1() {
    setCount(count + 1);
  }

  return (
    <>
      <button onClick={handleClick}>
        点击我！
      </button>
      <button onClick={handleClick1}>
        你点击了 {count} 次
      </button>
    </>
  );
}
```

- 上面的代码中，不管 `useRef` 传入的是什么，它都会在每次渲染时保留之前的信息，直到组件卸载时才会被销毁

- `ref` 的最佳实践，两个原则

    - 将 `ref` 视为脱围机制

    - 不要在渲染过程中读取或写入 `ref.current`

::: tip
何时使用 ref

- 存储 timeout ID

- 存储和操作 DOM 元素

- 存储不需要被用来计算 JSX 的其他对象
:::


### 二、使用 ref 操作 DOM

- 和 Vue3 有点像

    - 先声明一个 ref 对象，然后传给组件的 ref，最后在组件中使用 `ref.current` 来操作 DOM 元素

::: code-group
```jsx [实例一]
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        聚焦输入框
      </button>
    </>
  );
}
```
```jsx [实例二]
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        聚焦输入框
      </button>
    </>
  );
}
```
```jsx [实例三]
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // 只暴露 focus，没有别的
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input ref={realInputRef} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>聚焦输入框</button>
    </>
  );
}
```
:::

- 父组件访问子组件 DOM 时，会先在父组件里声明一个 ref 对象，然后通过 props 传给子组件使用，见实例二

- 在实例二中，会发现，子组件暴露给父组件的权柄太大，除了 `focus` 方法，其他方法都可以被调用，这会导致父组件直接操作 DOM 元素，而不是通过 React 的虚拟 DOM 来更新 DOM，这会导致性能问题

    - 解决方法，就是使用 `useImperativeHandle` Hook，只暴露 `focus` 方法，其他方法都不暴露，见实例三


- 怎么在列表组件中使用 ref 操作 DOM 时？

    - 方法一是在父标签上添加 ref，然后通过 `querySelectorAll` 来获取所有子组件的 DOM 元素

    - 方法二是将函数传递给 ref 属性，这称为 ref 回调

```jsx
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState([
    { id:1, imageUrl: 'https://placecats.com/neo/320/240' },
    { id:2, imageUrl: 'https://placecats.com/neo/320/240' },
    { id:3, imageUrl: 'https://placecats.com/millie/320/240' },
    { id:4, imageUrl: 'https://placecats.com/millie/320/240' },
  ]);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // 首次运行时初始化 Map。
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[2])}>Millie</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat.imageUrl} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
```

::: tip
- React 每次更新有两个阶段，渲染和提交。在第一次渲染阶段，DOM 节点还没有被创建，所以 ref 是没有值的。只有第一次提交后，DOM 节点才会被创建，所以 ref 才会有值。

- 尽量少使用 ref 实现一些破环性操作，比如手动删除 DOM ，这个会和 React 的虚拟 DOM 冲突，导致崩溃报错
:::
::: info
用 flushSync 同步更新 state

- 先看一段代码

```jsx
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        添加
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: '待办 #' + (i + 1)
  });
}
```
- 运行后操作它，你会发现，每次添加一个待办事项，都会滚动到最后一个添加 **之前** 的待办事项

    - 这是因为合成事件要都执行完后，才触发重新渲染，所以是先滚动到底部，再添加新的待办事项

- 如果你想要在添加新的待办事项后，滚动到新的待办事项，你可以使用 `flushSync` 来立即同步更新 state

```jsx
import { flushSync } from 'react-dom';

function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
}
```

::: tip
这里可以注意一个事情，组件重新渲染后，滚动条的位置仍在底部，没有更新

- 原因是 React 重新渲染只更新属性，不重置状态。状态除了 state，滚动条位置也算

    - 只有卸载才会重置
:::

::: danger
从 React 19 开始， ref 可作为 prop 使用 。在 React 18 及更早版本中，需要通过 `forwardRef` 来获取 ref 
:::

### 三、使用 Effect 进行同步

- Effect 是 React 中用于处理副作用的Hook。副作用指的是与组价渲染无关的操作，比如数据获取、订阅事件、修改 DOM 等。

- 与事件处理程序不同，**Effect 由渲染本身引起**，而非特定的交互。默认情况下，Effect 会在每次渲染后执行，包括初始渲染。

    - 如果所有依赖项都与上一次渲染时相同，React 会跳过本次 Effect

- 如何编写 Effect

    - 声明一个 Effect

    - 指定 Effect 依赖

    - 必要时添加清理函数

- 清理函数的执行时机

	- 组件卸载前
 	- 依赖项发生变化时：先执行上一次清理 → 再执行新的副作用	  	

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // 副作用代码
  
  // 可选：清理函数
  return () => {
    // 清理副作用（取消订阅、清除定时器等）
  }
}, [依赖数组])
```

- 来看一个完整的例子

::: code-group
```jsx [App.jsx]
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        服务器 URL：{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>欢迎来到 {roomId} 房间！</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        选择聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">所有</option>
          <option value="travel">旅游</option>
          <option value="music">音乐</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```
```jsx [chat.js]
export function createConnection(serverUrl, roomId) {
  // 实际的实现将会连接到服务器
  return {
    connect() {
      console.log('✅ 连接到 "' + roomId + '" 房间，位于' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 断开 "' + roomId + '" 房间，位于' + serverUrl);
    }
  };
}
```
:::

- 注意一个事情：**空的依赖数组 `[]` 对应于组件的“挂载”**

    - 这个意思是，只有在组件挂载时才会执行一次，后续的渲染都不会执行

```jsx
useEffect(() => {
  console.log('每次渲染后都执行')
})
useEffect(() => {
  console.log('每次渲染后 count 变化时才会执行', count)
}, [count])

// 只执行一次
useEffect(() => {
  console.log('组件挂载时执行一次')
  fetchData()
  
  return () => {
    console.log('组件卸载时清理')
    cleanup()
  }
}, [])
```
::: danger
默认情况下，Effect 会在每次渲染后运行。正因如此，以下代码会陷入死循环：
```jsx
useEffect(() => {
  setCount(count + 1)
})
```
:::

::: tip
带有依赖数组的 Effect 会在依赖项发生变化时执行。有点类似 Vue 的 watch。

- 要注意，依赖项是数组，可以有多个。但是如果指定的依赖项与 React 根据 Effect 内部代码所推断出的依赖项不匹配时，React 会报错
  - 所以，要确保依赖项是正确的，否则会导致性能问题
:::

- 按需添加清理函数，一般是取消订阅、清除定时器、移除事件监听器、重置状态等

::: code-group
```jsx [实例一]
useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
        connection.disconnect();
    };
}, []);
```
```jsx [实例二]
useEffect(() => {
    function handleScroll(e) {
        console.log(window.scrollX, window.scrollY);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);
```
```jsx [实例三]
useEffect(() => {
    const node = ref.current;
    node.style.opacity = 1; // 触发动画
    return () => {
        node.style.opacity = 0; // 重置为初始值
    };
}, []);
```
```jsx [实例四]
useEffect(() => {
    let ignore = false;

    async function startFetching() {
        const json = await fetchTodos(userId);
        if (!ignore) {
            setTodos(json);
        }
    }

    startFetching();

    return () => {
        ignore = true;
    };
}, [userId]);
```
:::

- Effect 不是万能的，有些场景下，不需要使用 Effect


### 四、你可能不需要 Effect

- 整个章节都在讲在哪些情况下不需要使用 Effect，Effect 能力很强，但是移除不必要的 Effect 可以让代码更加容易理解，运行得更快，并且更少出错

- 有两种不必使用 Effect 的常见情况

    - 不必使用 Effect 来转换渲染所需的数据

    - 不必使用 Effect 来处理用户事件

::: info
章节的摘要

- 如果可以在渲染期间计算某些内容，则不需要使用 Effect

- 想要缓存昂贵的计算，可以使用 `useMemo` 而不是 `useEffect`

- 想要重置整个组件树的 state，可以传入不同的 `key`

- 想要在 prop 变化时重置某些特定的 state，请在渲染期间处理

- 组件显示时就需要执行的代码应该放在 Effect 中，否则应该放在事件处理函数中

- 如果你需要更新多个组件的 state，最好在单个事件处理函数中处理

- 比起直接在组件中使用 Effect，现代框架提供了更加高效的，内置的数据获取机制
:::


### 五、响应式 Effect 的生命周期

- 这章节其实没讲什么新东西，只是规定了些定义和使用标准，有时间也可以[查看文档](https://zh-hans.react.dev/learn/lifecycle-of-reactive-effects)

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // 副作用代码
  
  // 可选：清理函数
  return () => {
    // 清理副作用（取消订阅、清除定时器等）
  }
}, [依赖数组])
```

- *响应式 Effect 的生命周期*，讲了两个事情，一个是响应式，一个是生命周期

    - **响应式**：在组件主体内声明的值是“响应式”的

        - Props 和 state 并不是唯一的响应式值，从它们计算出的值也是响应式的，因为每次变化都要重新渲染。常量一般写在组件主体外面所以不是响应式的

        - Effect 的副作用代码如果有使用到，应该添加到依赖数组中。React 会验证是否将每个响应式值都指定为了依赖项

    - **生命周期**：Effect 的生命周期是依赖项的同步周期。每个 Effect 都有自己的独立生命周期，它随着依赖项的变化而开始和结束

        - 组件挂载时，执行；依赖项变化时，执行；组件卸载时，执行清理函数（如果有）

        - 有两个特别的情况，一是空数组依赖项，相当于只在组件挂载时执行一次；二是没有依赖项，相当于在每次渲染后都执行


### 六、将事件从 Effect 中分开

- 主要讲 Effect Event。使用 `useEffectEvent` 这个特殊的 Hook 从 Effect 中提取非响应式逻辑

- 先看官网中的一个例子

::: code-group
```jsx [App.jsx]
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```
```js [chat.js]
export function createConnection(serverUrl, roomId) {
  // 真正的实现实际上会连接到服务器
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```
```js [notifications.js]
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```
:::

- 这个例子中，useEffect 的依赖项是 `roomId, theme`。因此，当 `roomId` 或 `theme` 变化时，Effect 会重新执行。但这里有个问题，roomId 变化要重新执行是符合预期的，但是 theme 变化要重新执行是不符合预期的。

    - 因此，`showNotification('Connected!', theme);` 不应该被当做响应式逻辑，需要将隔离开来

#### 6.1 声明一个 Effect Event 

- Effect Event 是 Effect 逻辑的一部分，但是其行为更像事件处理函数。它内部的逻辑不是响应式的，而且能直接使用 props 和 state

- 优化上面的代码

```jsx
import { useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 声明所有依赖项
  // ...
```

- 可以看到，关于 theme 的逻辑带提取出来了，所以依赖项里也要删除

::: info
传入 useEffectEvent 的回调函数可以接受一个参数

```jsx
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ 声明所有依赖项
  // ...
}
```
:::

::: tip
Effect Event 的局限性

- 只在 Effect 内部调用他们

- 永远不要把他们传给其他的组件或者 Hook
:::


### 七、移除 Effect 依赖

- **要改变依赖，请改变代码**

    - 这句话的意思是，Effect 的依赖项是根据代码的依赖关系来确定的，如果你想移除某些依赖项，你需要在代码中移除对应的依赖项

::: tip
开发中不要抑制 linter 对依赖的检查，为什么？

- 先看一个例子
```jsx
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        计数器：{count}
        <button onClick={() => setCount(0)}>重置</button>
      </h1>
      <hr />
      <p>
        每秒递增：
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

- 这个例子使用 `// eslint-disable-next-line react-hooks/exhaustive-deps` 来抑制 linter 对依赖的检查，但是会出现一个不直观的bug

    - useEffect 只在组件挂载时执行一次，后面的每次重新渲染都不会执行，再结合 state 的快照能力，会发现 `onTick` 中实际运行的一直是 `setCount(0 + 1)`
:::

- **对象和函数作为依赖，会使 Effect 比你需要的更频繁地重新同步**

    - 因为对象和函数是引用类型，所以每次重新渲染时，它们的引用都会改变，从而导致 Effect 重新执行，即使它们的内容没有改变


### 八、使用自定义 Hook 复用逻辑

::: info
先说两个规则

- React Hook 只能在两个地方调用

    - 函数组件内部**顶层**。即主体代码里，不能在循环、条件判断、嵌套函数等地方调用 Hook

    - 自定义 Hook 内部。如果一个函数里调用了 Hook，那么这个函数应该是自定义 Hook

- Hook 的名称必须永远以 `use` 开头

    - 自定义 Hook 本质上就是以 `use` 开头的**普通函数**
:::

- 自定义 Hook 的核心定位就是复用逻辑，不复用UI

- 基本语法

```jsx
// 1. 定义自定义Hook（useXXX）
function useCount() {
  // 内部使用原生Hook
  const [count, setCount] = React.useState(0);

  const add = () => setCount(prev => prev + 1);
  
  // 导出状态、方法，给组件用
  return { count, add };
}

// 2. 组件中直接使用
function Demo() {
  // 像用 useState 一样直接调用
  const { count, add } = useCount();

  return <button onClick={add}>{count}</button>;
}
```

- 看一个例子

```jsx
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

- 这是一个监听网络状态并更新相关状态的组件，实际业务中可能有多个组件需要监听网络状态，所以可以提取出一个自定义 Hook 来复用这个逻辑

::: code-group
```jsx [App.jsx]
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```
```js [useOnlineStatus.js]
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```
:::

- 当切换网络状态时，两个组件会跟着变化

    - 自定义 Hook 共享的是状态逻辑，而不是状态本身。相当于将 Hook 逻辑直接复制到了组件中

- 再看几个实际业务中的例子

- 窗口大小监听 `useWindowSize`

```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const resize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return size;
}
```

- 本地存储 `useLocalStorage`

```jsx
function useLocalStorage(key, initValue) {
  const [value, setValue] = useState(() => {
    const cache = localStorage.getItem(key);
    return cache ? JSON.parse(cache) : initValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// 使用
const [name, setName] = useLocalStorage('username', '');
```







