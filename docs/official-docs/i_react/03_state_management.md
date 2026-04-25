::: tip
状态管理是React和Vue的核心分水岭之一
:::

### 一、用 state 响应输入

*   React 和 Vue 一样，都是声明式 UI

*   观察下面一表单组件实现，会发现和 Vue 有明显区别

```jsx
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

*   上述代码中，有个疑问，前面章节有提到批处理的操作，多次设置 state ，会合并成一次重新渲染。为什么 handleSubmit 中的代码会触发两次重新渲染？（提交状态和结果状态都有实际表现）

    *   原因：**React 的批处理只会合并同一事件循环内的 state 更新**

    *   也就是同步代码和异步代码之分

```jsx
async function handleSubmit(e) {
  e.preventDefault();
  setStatus('submitting');   // ✅ 第一次 setState

  try {
    await submitForm(answer); // ⛔ 异步边界（断点）
    setStatus('success');     // ✅ 第二次 setState
  } catch (err) {
    setStatus('typing');
    setError(err);
  }
}
```

### 二、选择 State 结构

*   这章节主要介绍在组件实际开发中，要合理设计 state ，比如避免冗余和重复的 state，尽量合并两个 state 为一个

*   纯理论，业务开发经验多了就自然懂了

### 三、在组件间共享状态

*   讲的是如果希望两个组件的状态同步更改，可以将相关 state 从这两个组件中提取出来，放到一个父组件中，然后将这两个组件作为子组件，通过 props 传递 state 和更新函数给子组件

### 四、对 state 进行保留和重置

*   全篇章节只讲一件事：**只要在相同位置渲染的是相同组件， React 就会保留状态 state**

#### 4.1 在相同位置保留 state

*   先看一个例子

```jsx
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        使用好看的样式
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        加一
      </button>
    </div>
  );
}
```

![i\_3\_1](<../images/i_3_1.gif>)

*   可以看到，当切换组件时，状态 state 会被保留，不会被重置。

*   这个现象是 React 核心设计之一：

    *   状态是和“组件位置 + 类型”绑定的，而不是和 JSX 写法绑定的

*   简单的说，组件的卸载和加载在同一位置，组件还是同一个组件，状态 state 才会被保留。

*   比如下面的代码，也是同样的道理

```jsx
export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          使用好看的样式
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        使用好看的样式
      </label>
    </div>
  );
}
```

*   标签元素和 Counter 组件的位置都是相同的，所以状态 state 会被保留

    *   但是下面返回的 JSX 中的 div 标签改为 section，状态 state 就会被重置

#### 4.2 在相同位置重置 state

*   有两种方法重置

*   方法一：将组件渲染在不同位置

```jsx
export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        下一位玩家！
      </button>
    </div>
  );
}
```

*   是不是有些疑惑，上面那两确实是不同的位置

![i\_3\_2](<../images/i_3_2.png>)

*   方法二：使用 key 来重置 state

```jsx
{isPlayerA ? (
    <Counter key="Taylor" person="Taylor" />
) : (
    <Counter key="Sarah" person="Sarah" />
)}
```

::: tip
与 Vue 相比，Vue 中是没有这个概念的，只要组件被卸载，状态就会被重置。只有在复用组件时，在 key 没有变化时，才会保留状态 state
:::

### 五、迁移状态逻辑至 Reducer 中

这个章节可以理解为在业务开发中，如果对一个复杂对象或数组有频繁的增删改时，可以就这些操作抽象成一个函数，函数里实现这些操作，然后在增删改时直接调用函数就行

*   React 特意提供了一个 hook 来实现这个功能，叫做 `useReducer()`

#### 5.1 基础使用

*   看一个例子

::: code-group

```jsx [不使用 reducer 时]
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>布拉格的行程安排</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: '参观卡夫卡博物馆', done: true},
  {id: 1, text: '看木偶戏', done: false},
  {id: 2, text: '打卡列侬墙', done: false},
];
```

```jsx [使用 reducer 时]
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>布拉格的行程安排</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知 action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: '参观卡夫卡博物馆', done: true},
  {id: 1, text: '看木偶戏', done: false},
  {id: 2, text: '打卡列侬墙', done: false}
];
```

:::

*   可以看到，使用 `useReducer()` 时需要接受两个参数

    *   第一个参数是 reducer 函数

    *   第二个参数是初始状态

*   返回值也是一个数组，数组的第一个元素是状态 state，第二个元素是 `dispatch` 函数，用于触发状态更新

    *   `dispatch` 函数接受一个 action 对象，action 对象中一般包含 type 字段（也可以是其他的标识，但约定用 type），用于描述要执行的操作类型

*   reducer 函数的参数是当前状态 state 和 action 对象，返回值是新的状态 state。

    *   函数的定义是在组件函数外面的，因此函数也可以单独抽出来放在一个js文件里，然后在组件函数里引入使用

    *   函数中一般使用 `switch` 语句来处理不同的 action 类型，每个 case 对应一个操作，最后返回新的状态 state

        *   也可以使用 if/else 语句

::: tip
仔细看，其实就是将操作逻辑抽象出来一个函数
:::

#### 5.2 使用 Immer 简化 Reducer

*   与修改对象和数组一样，这里可以使用 Immer 库来简化代码

```jsx
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);
}
```

### 六、使用 Context 深层传递参数

*   组件嵌套过深时，使用 props 一层层传递会变得麻烦，所以有了 `Context` 来传递参数

    *   有点类似 Vue 中的 provide() 和 inject() 方法，用于在组件树中传递参数

*   先直接看一个例子

::: code-group

```jsx [App.jsx]
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>主标题</Heading>
      <Section level={2}>
        <Heading>副标题</Heading>
        <Heading>副标题</Heading>
        <Heading>副标题</Heading>
        <Section level={3}>
          <Heading>子标题</Heading>
          <Heading>子标题</Heading>
          <Heading>子标题</Heading>
          <Section level={4}>
            <Heading>子子标题</Heading>
            <Heading>子子标题</Heading>
            <Heading>子子标题</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```jsx [Section.jsx]
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```jsx [Heading.jsx]
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('未知的 level：' + level);
  }
}
```

```jsx [LevelContext.js]
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

:::

*   使用起来很简单

    *   第一步：使用 `createContext()` 创建 context 对象，并**将其从一个文件中导出**

    *   第二步：在需要使用 context 的组件中引入 context 对象，然后使用 `useContext()` 函数获取 context 值

    *   第三部：提供 context 值，使用 `LevelContext.Provider` 组件包裹需要使用 context 的组件树

*   传递的值还可以计算出新的值

::: code-group

```jsx [App.jsx]
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>主标题</Heading>
      <Section>
        <Heading>副标题</Heading>
        <Heading>副标题</Heading>
        <Heading>副标题</Heading>
        <Section>
          <Heading>子标题</Heading>
          <Heading>子标题</Heading>
          <Heading>子标题</Heading>
          <Section>
            <Heading>子子标题</Heading>
            <Heading>子子标题</Heading>
            <Heading>子子标题</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```jsx [Section.jsx]
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```jsx [LevelContext.js]
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

:::

::: tip
Context 和 Vue 中的依赖注入一样，能不用就别用，使用过多对于调试来说是一个问题
:::

### 七、使用 Reducer 和 Context 拓展你的应用

*   先看一个只使用了 `Reducer` 的例子

::: code-group

```jsx [App.jsx]
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Day off in Kyoto</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```jsx [AddTask.jsx]
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```jsx [TaskList.jsx]
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

:::

*   观察案例

    *   tasks 数据是不是被层层传递

    *   dispatch 被包装成函数，也被层层传递

*思考：如果数据量很大，很复杂，编辑操作也很复杂，嵌套很深怎么办*

*   再看下 `Reducer` 和 `Context` 的组合使用，以下改造步骤

    *   创建 context

    *   将 state 和 dispatch 函数放入 context

    *   在组件书中的任何地方使用 context

    *   优化：将 reducer 和 context 合并到一个文件中

::: code-group

```jsx [App.jsx]
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```jsx [TaskContext.jsx]
import { createContext, useReducer } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```jsx [AddTask.jsx]
import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```jsx [TaskList.jsx]
import { useState, useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(TasksDispatchContext);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Delete
      </button>
    </label>
  );
}
```

:::

::: tip
除了上面的优化，将 reducer 和 context 合并到一个文件中外，还可以导出使用 context 的函数

:::code-group

```jsx [TaskContext.jsx]
import { createContext, useContext, useReducer } from 'react'; // [!code focus]

const TasksContext = createContext(null); // [!code focus]

const TasksDispatchContext = createContext(null); // [!code focus]

export function TasksProvider({ children }) {
  ...
}

export function useTasks() { // [!code focus]
  return useContext(TasksContext); // [!code focus]
} // [!code focus]

export function useTasksDispatch() { // [!code focus]
  return useContext(TasksDispatchContext); // [!code focus]
} // [!code focus]

function tasksReducer(tasks, action) {
  ...
}

const initialTasks = [
  ...
];
```

```jsx [AddTask.jsx]
import { useState } from 'react';
import { useTasksDispatch } from './TasksContext.js'; // [!code focus]

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch(); // [!code focus]
  ...
}
```

```jsx [TaskList.jsx]
import { useState } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js'; // [!code focus]

export default function TaskList() {
  const tasks = useTasks(); // [!code focus]
  return (
    ...
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch(); // [!code focus]
  ...
}
```

*   像 useTasks 和 useTasksDispatch 这样的函数被称为自定义 Hook

    *   如果你的函数名以 `use` 开头，它就被认为是一个自定义 Hook。这让你可以使用其他 Hook
:::        























