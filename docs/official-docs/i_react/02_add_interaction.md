### 一、响应事件

*   就是给标签元素添加事件处理函数

#### 1.1 基本使用

```jsx
function AlertButton({ message, children }) {
  function handleClick() {
    alert(message);
  }
  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="正在播放！">
        播放电影
      </AlertButton>
    </div>
  );
}
```

*   函数通常在**组件内部**定义，可以直接访问 props 中的数据
    *   可以看到，函数也是作为 props 传递给组件的

*   事件处理函数名称一般以 `handle` 开头，例如 `handleClick`、`handleChange` 等

::: tip
可以直接定义成内涵的事件处理函数，也可以使用更简洁的箭头函数

```jsx
<button onClick={function handleClick() {
  alert('你点击了我！');
}}>

<button onClick={() => {
  alert('你点击了我！');
}}>
```

但要注意，是 `onClick={handleClick}`，不是 `onClick={handleClick()}`
:::

#### 1.2 将事件处理函数作为 props 传递给子组件

*   在父组件中定义子组件的事件处理函数，然后将其作为 props 传递给子组件

*   有点类似 vue 中的 `emit`、`@` 语法

```jsx
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`正在播放 ${movieName}！`);
  }

  return (
    <Button onClick={handlePlayClick}>
      播放 "{movieName}"
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="魔女宅急便" />
    </div>
  );
}
```

::: tip
事件处理函数 props 应该以 on 开头，后跟一个大写字母
:::

#### 1.3 事件传播

*   就是事件从子组件冒泡到父组件的过程

    *   可以使用 `event.stopPropagation()` 来阻止事件冒泡

```jsx
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

::: tip
在 React 中所有事件都会传播，除了 onScroll，它仅适用于你附加到的 JSX 标签

通过在事件名称末尾添加 `Capture` 可以用来捕获事件

```jsx
<div onClickCapture={() => { /* 这会首先执行 */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

:::

#### 1.4 阻止默认行为

*   使用 `event.preventDefault()` 来阻止默认行为，一般是表单提交

```jsx
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('提交表单！');
    }}>
      <input />
      <button>发送</button>
    </form>
  );
}
```

### 二、state：组件的记忆

#### 2.1 基本使用

*   其实就是组件自己的状态数据，类似 vue 中的 `data` 函数返回的对象

*   react 中定义状态的函数是 `useState`

    *   `useState` 函数返回一个数组，数组的第一个元素是当前状态值，第二个元素是更新状态值的函数

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

::: tip
这是遇到的第一个 Hook，在 React 中，useState 以及任何其他以“use”开头的函数都被称为 Hook

Hooks 是以 `use` 开头的函数，只能在组件或自定义 Hook 的最顶层调用
:::

#### 2.2 剖析 useState

```jsx
const [count, setCount] = useState(0);
```

*   首先，第二个参数不一定非要 set 前缀，可以随意命名，但一般推荐 `[thing, setThing]`

*   其次，调用 `setCount` 函数可以更新状态值，**同时会触发组件重新渲染**

    *   组件第一次渲染，count 会取传入的 0 作为默认值

    *   更新任意 state 触发重新渲染后，也就是重新执行组件函数，count 会取上次更新后的值

### 三、渲染和提交

*   组件显示到屏幕之前，其必须被 React 渲染

*   React 渲染这个过程可以分为三步

    *   触发一次渲染

    *   渲染组件

    *   提交到DOM

*   最后才会进行浏览器绘制（浏览器渲染）

#### 3.1 触发一次渲染

*   有两种情况会导致组件渲染

    *   组件的初次渲染

    *   组件或其祖先之一的状态 state 发生了改变

*   初次渲染其实就是通过调用 `createRoot` 方法并传入目标 DOM 节点，然后用你的组件调用 `render` 函数完成的

    *   其实就是 React 渲染树的根节点，React 项目的入口文件写的内容

```jsx
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

### 四、state 如同一张快照

*   这个章节只讲了一个东西：React 每次渲染调用组件函数，它的 props、事件处理函数和内部变量都是根据**当前渲染时的 state** 被计算出来了，相当于是一张快照

    *   即在这次渲染中的任何操作，state 都不会改变。设置 state 只会为**下一次渲染**变更 state 的值

*   经典案例：

```jsx
export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

*   这里点击 +3 按钮，会触发 3 次 state 更新，但是最终 number 只会增加 1，因为 number 值一直没变

::: tip
看文档时有个疑问，为什么触发了三次 setNumber 设置，怎么不是渲染三次？

*   React 在 onClick /onChange 等合成事件中会开启批量更新，多次调用 state 更新函数不会立即渲染，会等待事件回调执行完成后，合并更新一次
:::

*   但有一种**函数式写法**，可以实现真正的 + 3

```jsx
export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

*   `setNumber(prev => prev + 1);` 这是 React useState 故意设计的固定行为，不需要考虑其 js 层面的问题，直接使用即可

    *   这里的 `prev` 是上一次渲染时的 state 值，每次点击按钮，都会取上一次渲染时的 state 值，而不是当前渲染时的 state 值，所以会实现真正的 + 3

### 五、把一系列 state 更新加入队列

**设置组件 state 会把一次重新渲染加入队列**。但有时可能会希望在下次渲染加入队列之前对 state 的值执行多次操作

*   这章节其实就能解释上章节的行为。讲的也是**批处理**和**更新函数**（上面的函数式写法）

    *   批处理：React 会批量处理 state 更新，只在事件回调执行完成后，才会触发一次重新渲染（上面的合成事件说明）

*   通过两个例子来讲解更明白些

#### 5.1 例子一

```jsx
export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

*   `n => n + 1` 被称为更新函数

*   执行原理

    *   React 会将此函数加入队列，以便在事件处理函数中的所有其他代码运行后进行处理

    *   在下一次渲染期间，React 会遍历队列并给你更新之后的最终 state

![alt](<../images/i_2_1.png>)

#### 5.2 例子二

```jsx
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

*   这个输出 6

```jsx
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

*   这个输出的是 42

*   更新函数会进入队列，但是其他值会直接更新 state，在队列中的内容直接忽略

::: tip
更新函数的命名也有惯例，一般取相应 state 变量的第一个字母命名

```jsx
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

:::

### 六、更新 state 中的对象

*   React 中的 state 在更改时基本都需要借助更新函数，不能直接修改 state 值

    *   比如之前的 number、string、boolean，在设置后默认其是只读的，不能直接修改

#### 6.1 基础使用

*   其实对象和数组也是如此，不能直接更改，需要借助更新函数来实现更新。而更新函数传值就需要是一个新的对象来覆盖旧对象，这样才能更新

```jsx
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
    </>
  );
}

```

*   一般来说，创建新对象不会全部列举对象的所有属性，而是借助 `...` 对象扩展语法

*   而对象扩展语法是浅拷贝，所以只能复制一层，出现嵌套的情况需要多次使用

#### 6.2 使用 lmmer 编写简洁的更新逻辑

*   运行 `npm install use-immer` 添加 Immer 依赖

*   用 `import { useImmer } from 'use-immer'` 替换掉 `import { useState } from 'react'`

```jsx
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
    </>
  );
}
```

::: tip
在企业级应用中，简单状态用 useState，复杂对象或数组用 useImmer
:::

### 七、更新 state 中的数组

*   和对象类似，数组也需要更新函数来实现更新，而更新函数传值就需要是一个新的数组来覆盖旧数组

*   新数组的创建可以使用 `...` 运算符，也可以使用数组的一些原生方法

![alt](<../images/i_2_2.png>)

#### 7.1 向数组中添加元素

*   使用 `...` 运算符

```jsx
const [artists, setArtists] = useState([]);

setArtists(
  [
    { id: nextId++, name: name },
    ...artists,
    { id: nextId++, name: name }
  ]
);
```

#### 7.2 从数组中删除元素

*   使用 `filter` 方法过滤实现

```jsx
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

#### 7.3 转换数组

*   使用 `map` 方法转换实现

```jsx
setArtists(
  artistsmap(shape => {
      if (shape.type === 'square') {
        // 不作改变
        return shape;
      } else {
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
  })
);
```

#### 7.4 替换数组中的元素

*   使用 `map` 方法替换实现

```jsx
setArtists(
  artists.map((c, i) => {
      if (i === index) {
        return c + 1;
      } else {
        return c;
      }
    });
);
```

#### 7.5 向数组中插入元素

*   使用 `slice` 方法插入实现

```jsx
setArtists(
  [
    ...artists.slice(0, index),
    { id: nextId++, name: name },
    ...artists.slice(index)
  ]
);
```

::: tip
其实 slice 方法很强大，上面的操作都可以用 slice 方法来实现
:::

#### 7.6 翻转数组或者对数组排序

*   这个比较特殊，原生的数组方法都不可行，因为会改变原数组，而不是返回一个新的数组

*   这种操作需要先拷贝这个数组，然后改变拷贝后的值在传参

```jsx
const [list, setList] = useState(initialList);

function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    // nextList.sort()
    setList(nextList);
}
```

::: tip
注意，即使拷贝了数组，还是不能直接修改其内部的元素，因为这是浅拷贝【这个要特别注意，感觉业务中比较常见】
:::

#### 7.7 使用 Immer 编写简洁的更新逻辑

```jsx
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>艺术愿望清单</h1>
      <h2>我想看的艺术清单：</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

::: tip
使用 `use-immer` 后，更新函数的 callback 实现的更改逻辑就很想 Vue3 了，方便简洁
:::
