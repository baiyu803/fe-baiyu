### 一、模块

- 这里只讲两个东西，其他都是常用的，不记录了

#### 1.1 `export =` 和 `import = require()`

- 这是 TypeScript 为了兼容老的 CommonJS（Node.js）模块语法，专门设计的「兼容语法」，不是 ES 标准，也不是现代 TS 推荐写法

- 了解下有这个东西就行，现代写法一律用 ES6 import/export，它会自动兼容 CommonJs

::: code-group
```ts [ZipCodeValidator.ts]
let numberRegexp = /^[0-9]+$/;
class ZipCodeValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
export = ZipCodeValidator;
```
```ts [Test.ts]
import zip = require('./ZipCodeValidator');

// Some samples to try
let strings = ['Hello', '98052', '101'];

// Validators to use
let validator = new zip();

// Show whether each string passed each validator
strings.forEach(s => {
  console.log(
    `"${s}" - ${validator.isAcceptable(s) ? 'matches' : 'does not match'}`
  );
});
```
:::


#### 1.2 `declare module`

- 用于声明一个模块的类型，通常用在 `.d.ts` 文件中，为第三方库或全局模块提供类型定义

    - 给「文件 / 模块 / 包」定义类型。通俗的讲就是告诉 ts ，这是一个“模块”，可以 import 的东西

- 比如，在vue项目中经常导入图片、css、第三方库时会报错，因为 ts 本身不认识他们，这时候就需要 `declare module` 告诉 ts

- 一般是写在 .d.ts 文件中 (例如`typings.d.ts`，可直接复制使用)

```ts
// 图片资源
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.svg'

// 样式
declare module '*.css'
declare module '*.scss'

// Vue 文件
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
```


### 二、命名空间

- 使用 `namespace` 关键字来声明一个命名空间，需要对外暴露的成员必须用 `export` 导出

- 命名空间可以导出命名空间，接口，类型别名等

::: code-group
```ts [api.ts]
namespace Api {
  export namespace Auth {
    export interface SystemInfo {
      logo: string;
      systemName: string;
      nickname: string;
      avatar: string;
      email: string;
      tenantId: string;
    }
    
    export interface Domain {
      domainName: string;
    }
    
    export type EmailToken<T = any> = {
      email: string;
    } & T;
  }
  
  export namespace User {
    export interface UserInfo {
      id: number;
      name: string;
      role: string;
    }
  }
}
```
```ts [使用]
// 使用类型注解
const systemInfo: Api.Auth.SystemInfo = {
  logo: '/logo.png',
  systemName: 'MyApp',
  nickname: 'admin',
  avatar: '/avatar.png',
  email: 'admin@example.com',
  tenantId: 'tenant_001'
};

// 作为函数参数类型
function fetchSystemInfo(params: Api.Auth.Domain) {
  // ...
}
```
:::


#### 2.1 在 vue3 项目中的访问方式


**方式一**：全局类型访问（推荐），将命名空间定义在 `.d.ts` 声明文件中，无需导入即可在任意位置使用

::: code-group
```ts [api.d.ts]
// src/types/api.d.ts
declare namespace Api {
  namespace Auth {
    interface SystemInfo {
      logo: string;
      systemName: string;
    }
    
    interface Domain {
      domainName: string;
    }
  }
}
```
```vue [index.vue]
<!-- src/views/Login.vue -->
<script setup lang="ts">
import { reactive } from 'vue';

// 无需 import，直接使用命名空间类型
const systemInfo: Api.Auth.SystemInfo = reactive({
  logo: '',
  systemName: ''
});

async function getSystemInfo(params: Api.Auth.Domain) {
  // ...
}
</script>
```
:::

::: tip
注意一个点，在 `.d.ts` 文件里，绝大多数声明都必须写 `declare`，不写会报错
:::

**方式二**：模块导出导入，在 ts 文件中，将命名空间通过 ES 模块导出，在使用出导入

::: code-group
```ts [api.ts]
export namespace Api {
  export namespace Auth {
    export interface SystemInfo {
      logo: string;
      systemName: string;
    }
  }
}
```
```vue [index.vue]
<script setup lang="ts">
import type { Api } from '@/api';

const systemInfo: Api.Auth.SystemInfo = {
  logo: '',
  systemName: ''
};
</script>
```
:::

**方式三**：三斜线指令引用（跨文件合并）

- 当命名空间分布在多个文件中时，使用 `/// <reference path="..." />` 进行合并：

::: code-group
```ts [api.ts]
namespace Api {
  export namespace Auth {
    export interface SystemInfo {
      logo: string;
    }
  }
}
```
```vue [index.ts]
/// <reference path="./auth.ts" />

namespace Api {
  export namespace User {
    export interface UserInfo {
      id: number;
      name: string;
    }
  }
}

// 现在可以访问 Api.Auth 和 Api.User
```
:::

**方式四**：全局命名空间扩展（declare global）

- 为 Vue 3 项目添加全局属性类型：

```ts
// src/types/global.d.ts
import { MessageApi } from 'naive-ui';

declare global {
  namespace Global {
    interface Window {
      $message: MessageApi;
    }
  }
  
  // 扩展 Vue 组件实例类型
  interface ComponentCustomProperties {
    $message: MessageApi;
  }
}

export {};
```
::: tip
现代 TS 建议

尽量别用 namespace，这是旧时代模块化方案。现在统一用：
  - ES Module import/export
  - 顶层直接 export interface/type/class

namespace 只适合：
  - 老项目兼容
  - 声明全局第三方库类型（.d.ts）
:::


### 三、`declare module` 和 `declare namespace` 有什么区别

- declare module = 给「文件 / 模块 / 包」定义类型

    - 作用：告诉 TS —— 这是一个 “模块”（可以 import 的东西）

- declare namespace = 给「对象 / 全局结构」定义内部结构\

    - 作用：告诉 TS —— 这是一个 “对象结构”


### 四、Symbols


- 一些关于 `Symbols` 的介绍，包括一些方法，[原文阅读](https://typescript.uihtm.com/zh/reference/symbols.html)


### 五、三斜线指令

- 三斜线指令只能用在

    - `.d.ts` 类型声明文件（最常用、最推荐）
    - `.ts/.tsx` 普通脚本文件
    - `.js`文件（很少用）

- 有一个铁律：三斜线指令必须写在文件的最顶部，它的上面只能有单行或多行注释，或者其他三斜线指令


#### 5.1 `/// <reference path="..." />`

- 最常用的一种，用于声明文件间的依赖


#### 5.2 `/// <reference types="..." />`

- 用于声明对某个库的依赖，例如：`/// <reference types="node" />` 表示这个文件依赖于 Node.js 的类型定义

- 它和上面的类似，都是用于声明依赖。但是区别是上面的是引用本地文件，当前这个是引用 node_modules 里的 @types/xxx 类型包

::: tip
注意：虽然三斜线指令仍然可用，但在现代 TypeScript 项目中，更推荐使用 `import` 和 `export` 语法来管理模块依赖关系
:::

#### 5.3 `/// <reference no-default-lib="true"/>`


- 把一个文件标记成默认库。这个指令告诉编译器在编译过程中不要包含这个默认库（比如，lib.d.ts）


#### 5.4 `/// <amd-module />`

- 默认情况下生成的 AMD 模块都是匿名的。这个指令允许给编译器传入一个可选的模块名：

```ts
///<amd-module name='NamedModule'/>
export class C {}
```

#### 5.5 `/// <amd-dependency />`

- 该指令已被废弃，使用 `import "moduleName";` 语句代替。


### 六、类型兼容性

- TypeScript 的类型系统是**结构类型系统**（Structural Type System），这意味着类型兼容性基于成员的结构，而不是显式的继承关系

::: code-group
```ts [例子一]
// 结构相同，即使没有继承关系，也是兼容的
interface Point {
  x: number;
  y: number;
}

interface Coordinate {
  x: number;
  y: number;
}

// ✅ 完全兼容，即使名称不同
const point: Point = { x: 10, y: 20 };
const coord: Coordinate = point;  // 可以赋值
```
```ts [例子二]
interface Named {
  name: string;
}

let x: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: 'Alice', location: 'Seattle' };
x = y;

function greet(n: Named) {
  console.log('Hello, ' + n.name);
}
greet(y); // OK
```
:::

- 这与 Java/C# 的**名义类型系统**（Nominal Type System）不同

#### 6.1 比较两个函数

```ts
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```

#### 6.2 枚举

- 枚举类型与数字类型兼容，并且数字类型与枚举类型兼容。不同枚举类型之间是不兼容的

```ts
enum Status {
  Ready,
  Waiting,
}
enum Color {
  Red,
  Blue,
  Green,
}

let status = Status.Ready;
status = Status.Waiting; // ok
status = 0; // ok
status = 1; // ok
status = 2; // Error
status = Color.Green; // Error
```


#### 6.3 类

-  比较两个类类型的对象时，只有实例的成员会被比较。 静态成员和构造函数不在比较的范围内

```ts
class Animal {
  feet: number;
  constructor(name: string, numFeet: number) {}
}

class Size {
  feet: number;
  constructor(numFeet: number) {}
}

let a: Animal;
let s: Size;

a = s; // OK
s = a; // OK
```

#### 6.4 泛型

::: code-group
```ts [例子一]
interface Empty<T> {}
let x: Empty<number>;
let y: Empty<string>;

x = y; // OK, because y matches structure of x
```
```ts [例子二]
interface NotEmpty<T> {
  data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y; // Error, because x and y are not compatible
```
:::


::: tip
- 初看没啥用，实际在业务开发中挺多应用的

::: code-group
```ts [API响应数据处理]
// API 返回的数据结构
interface ApiResponse {
  data: {
    id: number;
    name: string;
    email: string;
  };
  code: number;
}

// 前端业务组件使用的类型
interface UserInfo {
  id: number;
  name: string;
  email: string;
  avatar?: string;  // 可选字段
}

async function fetchUser() {
  const res: ApiResponse = await api.get('/user');
  
  // ✅ 兼容：ApiResponse.data 可以直接赋值给 UserInfo
  const user: UserInfo = res.data;  
  // 因为 UserInfo 的所有必需字段 ApiResponse.data 都有
}
```
```ts [组件 Props 传递]
<script setup lang="ts">
// 子组件期望的类型
interface ButtonProps {
  text: string;
  disabled?: boolean;
  onClick: () => void;
}

// 父组件传入的对象
const buttonConfig = {
  text: '提交',
  onClick: () => console.log('click'),
  theme: 'primary'  // 多出的属性
};

// ✅ 兼容：多出的属性不影响兼容性
// 只要必需的属性都存在
const props: ButtonProps = buttonConfig;
</script>

<template>
  <Button v-bind="buttonConfig" />
</template>
```
```ts [条件渲染与类型守卫]
// 不同类型的数据，但结构兼容
interface SuccessResult {
  status: 'success';
  data: any;
  message?: string;
}

interface ErrorResult {
  status: 'error';
  message: string;
  code: number;
}

type ApiResult = SuccessResult | ErrorResult;

function handleResult(result: ApiResult) {
  // ✅ 兼容：可以访问共有的 status 字段
  if (result.status === 'success') {
    // TypeScript 自动推断 result 是 SuccessResult
    console.log(result.data);
  } else {
    // TypeScript 自动推断 result 是 ErrorResult
    console.log(result.code);
  }
}
```
:::


### 七、类型推论

#### 7.1 基础

- 有些没有明确指出类型的地方，类型推论会帮助提供类型

```ts
let x = 3;
```

- 这里 x 的类型被推论为 number。这种推断发生在初始化变量和成员，设置默认参数值和决定函数返回值时

#### 7.2 最佳通用类型

- 当需要从多个表达式中推断类型时，会使用这些表达式的类型来推断出一个最合适的通用类型
```ts
let arr = [0, 1, null];  // 类型被推断为 (number | null)[]
```

#### 7.3 上下文类型

- 上下文类型的类型推论会按照相反的方向进行，表达式会从上下文获取类型信息

```ts
window.onmousedown = function(mouseEvent) {
  console.log(mouseEvent.button);  // 根据上下文 mouseEvent 被推断为 MouseEvent
  console.log(mouseEvent.kangaroo); //<- Error!
};

window.onscroll = function (uiEvent) {
  console.log(uiEvent.button); //<- Error!
};
```

- 如果这个函数不是在上下文归类的位置上，那么这个函数的参数类型将隐式的成为any类型，而且也不会报错（除非你开启了--noImplicitAny选项）

```ts
const handler = function (uiEvent) {
  console.log(uiEvent.button); //<- OK
};
```




