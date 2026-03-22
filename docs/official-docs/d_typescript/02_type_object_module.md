---
theme: cyanosis
highlight: vs2015
---

::: info
本篇笔记是在 [基础笔记](/official-docs/d_typescript/01_basic.html) 的基础上做补充。主要是围绕类型、对象、模块展开
:::

### 一、类型别名

- 使用 `type` 关键字来定义类型别名
- 常用于为联合类型或复杂类型创建名称
- 类型别名不能重复声明

```ts
type ID = number | string;
type Point = { x: number; y: number };
type Callback = (data: string) => void;
```

::: tip
类型别名和接口相似，但也有区别

|特性         | 类型别名 (type) | 接口 (interface) |
|----------------|---------------|-----------------|
| 定义本质           | 给任意类型起别名 | 仅描述对象、函数的结构类型 |
| 扩展性          | 不支持直接扩展，使用 & 交叉类型 | 支持 extends 继承 |
| 重复定义           | 不能       | 允许，声明合并        |
:::


### 二、非空断言操作符 !

- 使用 `!` 后缀来断言表达式不为 `null` 或 `undefined`

- 用于告诉 TypeScript 你确信该值存在，即使类型系统无法确认

- 谨慎使用，可能会导致运行时错误

```ts
function liveDangerously(x?: number | null) {
  // 没有错误
  console.log(x!.toFixed());
}
```


### 三、缩小类型范围

- 这一节按照我同事说法就是脱裤子放屁，主要是说让ts类型检查更明确一个参数是什么类型，然后处理它

- 原js中已有的方法：typeof, instanceof, in, 等式、赋值语句、控制流分析等

- ts新提供的方法：as 断言、is 类型谓词、never 类型等

[文档点击查看](https://typescript.uihtm.com/zh/handbook-v2/narrowing.html)

::: tip
- `is` 类型谓词是 ts 中函数返回值的一种特殊类型声明，作用是告诉 ts 编辑器该函数的返回值是一个布尔值，并且该布尔值用于确定参数是否为特定类型

::: code-group
```ts
function 函数名(参数名: any): 参数名 is 特定类型 {
  // 返回 true 或 false
  return 布尔值;
}
```
```ts [例子]
interface Dog {
  bark: () => void;
}
interface Cat {
  meow: () => void;
}

function isDog(animal: Dog | Cat): animal is Dog {
  return (animal as Dog).bark !== undefined;
}

function makeSound(animal: Dog | Cat) {
  if (isDog(animal)) {
    // ✅ TypeScript 现在知道：在这个代码块里，animal 一定是 Dog！
    animal.bark(); // 正常工作
  } else {
    // TypeScript 也知道：在这里，animal 一定是 Cat！
    animal.meow(); // 正常工作
  }
}
```
:::



### 四、函数进阶

- 大部分内容在基础笔记中有提到，比如函数类型表达式、泛型函数、可选参数、函数重载等。其中有讲到两个东西，一个是调用签名，一个是构造签名。其实调用签名在基础中有提到，但不知道是这个专有名词、

- TS 允许**一个对象本身当函数用**，这种写法就必须用**调用签名**，格式 `(参数): 返回值` ，注意使用的是冒号不是 =>

::: code-group
```ts [调用签名]
type DescribableFunction = {
  description: string;
  (someArg: number): boolean; // 这就是调用签名
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + ' 返回了 ' + fn(6));
}

function myFunc(someArg: number) {
  return someArg > 3;
}
myFunc.description = '默认描述';

doSomething(myFunc);
```
```ts [构造签名]
type SomeObject = any;
// ---cut---
type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor('你好');
}
```
:::


- 普通函数类型表达式

```ts
type GreetFunction = (name: string) => string;
```

- 调用签名

```ts
type GreetFunction = {
    (name: string): string;
}
```


### 五、对象类型

- 基础笔记中基本都有


### 六、类型操纵

- 大部分也是基础笔记中已经有的内容


#### 6.1 泛型

- 基础笔记都有


#### 6.2 keyof 类型运算符

- `keyof` 运算符接受一个对象类型，并生成其键的字符串或数字字面量联合类型

```ts
type Point = { x: number; y: number };
type P = keyof Point;  // 等价于 type P = "x" | "y";

type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;  // 等价于 type A = number;

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;  // 等价于 type M = string | number;
```

- 解释下为什么 Mapish 的 keyof 结果是 string | number：因为在 JavaScript 中，对象键总是被强制转换为字符串，所以 obj[0] 等同于 obj["0"]


#### 6.3 typeof 类型运算符

- js 中也有 typeof，主要用于在表达式上下文中使用。但是 ts 中也提供了 `typeof`，它可以在类型上下文中引用变量或属性的类型。

```ts
let s = "hello";
let n: typeof s; //  // 等价于 let n: string;
```
```ts
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;

function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
```

- ts 有意限制了可以使用 `typeof` 的表达式种类，它只能对标识符（变量名）或它们的属性使用是合法的。


#### 6.4 索引访问类型

- 可以使用索引访问类型来查找另一种类型的特定属性

```ts
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];  // type Age = number
```

- 索引类型本身就是一个类型，所以我们可以使用 `keyof` 或其他类型：

```ts
type I1 = Person["age" | "name"];  // type I1 = string | number
type I2 = Person[keyof Person];     // type I2 = string | number | boolean
type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];      // type I3 = string | boolean
```

#### 6.5 条件类型

- 条件类型类似于 js 中的条件表达式（条件 ? true 表达式 : false 表达式）。一般和泛型一起使用，不然就有些单调无用


```ts
type Flatten<T> = T extends any[] ? T[number] : T;

// 提取出元素类型。
type Str = Flatten<string[]>;

// 保持类型不变。
type Num = Flatten<number>;
```

- 还有些更复杂的，可以[原文档阅读](https://typescript.uihtm.com/zh/handbook-v2/type-manipulation/conditional-types.html)


#### 6.6 映射类型

- 映射类型建立在索引签名的语法上，使用 `in` 关键字来遍历键，从而从旧类型创建新类型：

```ts
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/91da7947d8d949d08ee2acb497feb14a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rGC55-l5ZGA:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjY3NDQ3MzQ2MTA4ODYwMCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1774274519&x-orig-sign=pf%2FmpUNHL4Xx%2Fd1E3jwDoyTthgw%3D)

- 还有些更复杂的，可以[原文档阅读](https://typescript.uihtm.com/zh/handbook-v2/type-manipulation/mapped-types.html)


#### 6.7 模版字面量类型

- 以字符串字面量类型为基础

```ts
type World = "world";
type Greeting = `hello ${World}`;  // "hello world"

type EmailLocaleIDs = 'welcome_email' | 'email_heading';
type FooterLocaleIDs = 'footer_title' | 'footer_sendoff';

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
```

- TypeScript 有提供一些方法来操作字符串类型，比如 `Uppercase<StringType>`、`Lowercase<StringType>`、`Capitalize<StringType>` 和 `Uncapitalize<StringType>`：

```ts
type Greeting = "hello, world";
type ShoutyGreeting = Uppercase<Greeting>;  // "HELLO, WORLD"  每个字符转为大写
type QuietGreeting = Lowercase<Greeting>;    // "hello, world"  每个字符转为小写
type CapitalizedGreeting = Capitalize<Greeting>;   // "Hello, world"  // 首字母转为大写
type UncapitalizedGreeting = Uncapitalize<CapitalizedGreeting>; // "hello, world"  // 首字母转为小写
```


- 还有些更复杂的，可以[原文档阅读](https://typescript.uihtm.com/zh/handbook-v2/type-manipulation/template-literal-types.html)


### 七、类

- 基础笔记基本够用，详细可阅读[原文档](https://typescript.uihtm.com/zh/handbook-v2/classes.html)

- 这里介绍一个关键字 `declare`，它的作用是告诉 TypeScript 编译器某个变量或类型已经存在，不需要在当前的编译上下文中实现，通常用于类型声明文件（.d.ts）中

- 比如，我们经常在使用全局的属性或方法时，会使用 `declare` 来声明这些全局对象，以避免 TypeScript 报错

```ts
// 告诉 TS：全局有个 $，它是 jQuery 类型
declare var $: any;

// 现在 TS 不报错了
$('#app').show();

// 告诉 TS：引入 'lodash' 时，它是这个类型
declare module 'lodash' {
  export function debounce(fn: Function, delay: number): Function;
}
```


### 八、模块


- ts 特定的 ES 模块语法，类型可以使用与 js 相同的语法导出和导入

```ts
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };

export interface Dog {
  breeds: string[];
  yearOfBirth: number;
}

// @filename: app.ts
import { Cat, Dog } from './animal.js';
type Animals = Cat | Dog;
```

- 但 ts 也通过两个用来声明类型导入的概念，扩展了 `import` 语法

```ts
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
// createCatName 是一个具体的方法
export const createCatName = () => 'fluffy';

// @filename: valid.ts
import type { Cat, Dog } from './animal.js';
export type Animals = Cat | Dog;

// @filename: app.ts
// @errors: 1361
import { createCatName } from './animal.js';
const name = createCatName();
```

- 也可以内联 `type` 导入

```ts
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => 'fluffy';
// ---cut---
// @filename: app.ts
import { createCatName, type Cat, type Dog } from './animal.js';

export type Animals = Cat | Dog;
const name = createCatName();
```

- 从上面可以看出，一个ts文件，类型和方法是可以同时导出的，在另一个文件中导入，可以分开也可以一起














