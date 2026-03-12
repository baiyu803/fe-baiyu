---
theme: cyanosis
highlight: vs2015
---

### 一、基础类型

TypeScript 支持与 JavaScript 几乎相同的数据类型，此外还提供了实用的枚举、元组等类型。

#### 1.1 基础类型实例

::: code-group
```ts [基础实例]
// Boolean、Number、String 类型
let isDone: boolean = false;
let decLiteral: number = 6;
let name: string = 'bob';

// 数组类型
let list: number[] = [1, 2, 3];
// 或者使用数组泛型写法
let list2: Array<number> = [1, 2, 3];

// Tuple 元组：元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。
let x: [string, number];
x = ['hello', 10]; // 正确
// x = [10, 'hello']; // 错误

// Enum 枚举，用于定义一组有名字的常量
enum Color {
  Red = 1,
  Green,
  Blue,
}
let c: Color = Color.Green;
let colorName: string = Color[2];  // 'Green'

// Unknown 类型：表示未知类型，任何值都可以赋值给 unknown 类型，但 unknown 类型的值只能赋值给 any 和 unknown 类型
let notSure: unknown = 4;
notSure = 'maybe a string instead';

// Any 类型：表示任意类型，可以绕过类型检查
let anyValue: any = 4;
anyValue = 'now a string';

// Void 类型：表示没有任何类型，通常用于函数没有返回值时
function warnUser(): void {
  console.log('This is a warning message');
}

// Null 和 Undefined 类型：默认情况下 null 和 undefined 是所有类型的子类型
let u: undefined = undefined;
let n: null = null;

// Never 类型：表示那些永不存在的值的类型，常用于抛出异常或无限循环的函数
function error(message: string): never {
  throw new Error(message);
}

// Object 类型：表示非原始类型
function create(o: object | null): void {}
create({ prop: 0 }); // 正确
create(null); // 正确
// create(42); // 错误
```

```ts [unknown类型扩展]
// unknown类型：可以接收任何类型的值，但使用前必须做类型判断
let unknownValue: unknown = "我是字符串";
unknownValue = 123; // 合法（赋值层面和any一致）
unknownValue = { name: "张三" }; // 合法

// 直接调用方法，TS会报错（必须先校验类型）
unknownValue.fly(); // ❌ 报错：对象类型为 unknown

// 赋值给其他类型也会报错（必须先窄化类型）
let num: number = unknownValue; // ❌ 报错：不能将类型 unknown 分配给类型 number

// ✅ 正确用法：先做类型判断，再使用
if (typeof unknownValue === "number") {
  unknownValue.toFixed(); // 合法（TS知道此时是number类型）
  let n: number = unknownValue; // 合法
}
```
:::

::: tip
- 元祖类型，当访问一个越界的元素时会报错，因为元组的长度和类型都是固定的。

- 枚举类型，默认从 0 开始为元素编号，也可以手动指定成员的数值

- any 和 unknown 都是用来表示类型不确定的值，但 any 类型会绕过类型检查，而 unknown 类型则更安全，需要先进行类型检查才能使用。可以说 unknown 是类型安全的 any
:::


#### 1.2 类型断言

- 告诉编辑器这个数据就是这个类型，不用查了。两种写法

```ts
let someValue: any = 'this is a string';

// 尖括号写法
let strLength: number = (<string>someValue).length;

// as 语法
let strLength2: number = (someValue as string).length;
```

- 两种方法等价，但是在 ts 里使用 JSX 时，只有 `as` 语法断言可以使用。


### 二、接口

- 通过 `interface` 关键字定义，用来描述对象的形状（属性、方法等）

- 定义时，可以定义可选属性、只读属性、函数类型、索引类型等

```ts
interface Person {
  readonly id: number;
  name: string;
  age?: number;
  sayHello(): void;
  [propName: string]: any;
}

let student:Person = {
  id: 123,
  name: "张三",
  age: 20,
  sayHello: function() {
    console.log("Hello");
  }
}
```

#### 2.1 函数类型

- 接口除了描述普通对象外，还可以描述函数类型，定义函数的结构（参数类型和返回值类型）

``` ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
}
```

#### 2.2 可索引类型

```ts
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ['Bob', 'Fred'];
```

- 注意，使用索引类型后，其他属性的类型必须是索引类型的子类型，比如上最上面的，都是 any 的子类型，再比如下面的例子：

```ts
interface NumberDictionary {
  [index: string]: number;
  length: number; // 可以，length是number类型
  name: string; // 错误，`name`的类型与索引类型返回值的类型不匹配
}
```

#### 2.3 类类型

- 定义类时，使用 `implements` 来实现接口，强制一个类符合某个契约

```ts
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}
```

- 需要注意的是，类实现接口时，只检查实例部分，静态部分不在检查范围内


#### 2.4 继承接口

- 和类一样，接口也可以相互继承，使用 `extends` 关键字。一个接口可以继承**多个接口**，创建出多个接口的合成接口

```ts
interface Shape {
  color: string;
}
interface PenStroke {
  penWidth: number;
}

interface Square extends Shape {
  sideLength: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}
```

#### 2.5 混合类型

- 一个例子就是，一个对象可以同时作为函数(区别于调用方法)和对象使用，并带有额外的属性

```ts
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function (start: number) {} as Counter;
  counter.interval = 123;
  counter.reset = function () {};
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

#### 2.6 接口继承类

- 这个适用场景极窄，没看出有啥实际用处，可以[点击查看](https://typescript.uihtm.com/zh/handbook/interfaces.html#%E6%8E%A5%E5%8F%A3%E7%BB%A7%E6%89%BF%E7%B1%BB)



### 三、函数

- 完整的函数类型，包含函数的参数类型和返回值类型，例如：

```ts
let myAdd: (x: number, y?: number) => number = function(x: number, y?: number): number {
  return x + y;
};
```

::: tip
函数和返回值类型之间使用 `=>` 符号，返回值是函数类型的必要成分，即使函数没有返回值，也要写 `void`
:::

#### 3.1 推断类型

- 意思是可以只写一半

```ts
let myAdd = function (x: number, y?: number): number {
  return x + y;
};

// 或者
let myAdd: (baseValue: number, increment?: number) => number = function (x, y) {
  return x + y;
};
```

#### 3.2 可选参数和默认参数

- 这里单拿出来写是因为不使用 `?` 或默认参数时，那上面的 x 和 y 就得是必传的，不然报错

::: tip
可选参数必须跟在必需参数后面，但如果参数有默认值，它们可以出现在必需参数之前（但通常不建议这样做，因为调用时必须要给个默认值，或者undefined）。
:::

#### 3.3 剩余参数

- 记下怎么写类型就行

```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + ' ' + restOfName.join(' ');
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
```

#### 3.4 重载

- 更是鸡肋，这里看起来不是方法重载，像是类型标记重载一样，[点击查看](https://typescript.uihtm.com/zh/handbook/functions.html#%E9%87%8D%E8%BD%BD)


### 四、字面量类型

- 只有三种可用的字面量类型集合：字符串、数字和布尔值

- 也就是说这些值本身就可以代表一个类型，而不是变量

```js
interface ValidationSuccess {
  isValid: true;
  reason: null;
};

type Easing = "ease-in" | "ease-out" | "ease-in-out" | ValidationSuccess;
let a:Easing = "ease-in";

function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
  return (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
}
```


### 五、联合类型和交叉类型

#### 5.1 联合类型

- 表示一个值的类型可以是几个类型中的一个，用竖线实现

```ts
let message: number | string;
message = 1; // 有效
message = "hello"; // 有效
message = true; // 无效
```

- 具有公共字段的联合，使用时只能访问联合中所有类型共有的成员

```
// @errors: 2339

interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

declare function getSmallPet(): Fish | Bird;

let pet = getSmallPet();
pet.layEggs();

// 只有两种可能类型中的一种可用，下面的报错
pet.swim();
```

#### 5.2 交叉类型

- 把现有的类型加在一起，得到一个具有你需要的所有功能的单个类型，使用 `&` 连接

```ts
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// 这些接口被组合后拥有一致的错误处理，和它们自己的数据

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};
```


### 六、类

- js 中类有构造函数和方法，ts 在此基础上必须要有属性声明。除此外也多了些其他功能

```ts
class Greeter {
  greeting: string;
  private age: number;
  constructor(message: string, age: number) {
    this.greeting = message;
  }
  greet() {
    return 'Hello, ' + this.greeting;
  }
}

let greeter = new Greeter('world');
```

- 除了单独拿出来声明外，还有简写形式，也就是参数属性写法

```ts
class Greeter {
  constructor(public greeting: string, private age: number;) {}
  greet() {
    return 'Hello, ' + this.greeting;
  }
}
```

#### 6.1 继承

- 使用关键字 `extends` 实现继承。被继承的称为基类（或父类、超类），继承的称为派生类（或子类）

- 使用 `super();` 调用父类的构造函数

    - 子类必须在 constructor 方法中调用 super() 方法，否则新建实例时会报错
    - 这是因为子类没有自己的 this 对象，而是继承父类的 this 对象，然后对其加工

```ts
class Animal {
  name: string;
  constructor(theName: string) {
    this.name = theName;
  }
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 5) {
    console.log('Slithering...');
    super.move(distanceInMeters);
  }
}

class Horse extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 45) {
    console.log('Galloping...');
    super.move(distanceInMeters);
  }
}

let sam = new Snake('Sammy the Python');
let tom: Animal = new Horse('Tommy the Palomino');

sam.move();
tom.move(34);
```

#### 6.2 公共、私有、受保护的修饰符

- `public \ private \ protected`

- 除了修饰属性外，还可以修饰构造函数，以及方法


#### 6.3 readonly 修饰符

- `readonly` 关键字将属性设置为只读，只能在声明时或构造函数中被初始化

```ts
class Octopus {
  readonly name: string;
  readonly numberOfLegs: number = 8;
  constructor(theName: string) {
    this.name = theName;
  }
}
let dad = new Octopus('Man with the 8 strong legs');
dad.name = 'Man with the 3-piece suit'; // 错误! name 是只读的.
```

#### 6.4 存取器


- ts 支持通过 `getters` 和 `setters` 来截取对对象成员的访问

```ts
const fullNameMaxLength = 10;

class Employee {
  private _fullName: string;

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    if (newName && newName.length > fullNameMaxLength) {
      throw new Error('fullName has a max length of ' + fullNameMaxLength);
    }

    this._fullName = newName;
  }
}

// 等价于
class Employee {
    _fullName: string;
}
```

#### 6.5 静态属性

- 类的静态属性存在于类本身而不是类的实例上

```ts
class Grid {
  static origin = {x: 0, y: 0};
  calculateDistanceFromOrigin(point: {x: number; y: number}) {
    let xDist = point.x - Grid.origin.x;
    let yDist = point.y - Grid.origin.y;
    return Math.sqrt(xDist * xDist + yDist * yDist);
  }
}

let grid1 = new Grid();
console.log(Grid.origin); // {x: 0, y: 0}
```

#### 6.6 抽象类

- 使用关键字 `abstract` 来定义抽象类，抽象类作为其他派生类的基类使用，不能被实例化

```ts
abstract class Department {
  constructor(public name: string) {}

  printName(): void {
    console.log('Department name: ' + this.name);
  }

  abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {
  constructor() {
    super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
  }

  printMeeting(): void {
    console.log('The Accounting Department meets each Monday at 10am.');
  }

  generateReports(): void {
    console.log('Generating accounting reports...');
  }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // 错误: 方法在声明的抽象类中不存在
```

#### 6.7 高级技巧

- 在 ts 中声明一个类时，实现上同时创建了两个类型：类的实例的类型，和类的构造函数的类型

- 类的实例的类型就比如上面的 `let department: Department;`,而类的构造函数的类型则是 `typeof Department`。

- 因为类可以创建类型，所以能够在允许使用接口的地方使用类

```ts
class Point {
  x: number;
  y: number;
}

interface Point3d extends Point {
  z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };
```


### 七、枚举


- 可以讲很深，但又不怎么实用，[点击查看](https://typescript.uihtm.com/zh/handbook/enums.html)


### 八、泛型

- 看一个简单的例子，一个函数希望传入什么返回什么

::: code-group
```ts [第一版]
function identity(arg: number): number {
  return arg;
}
```
```ts [第二版]
function identity(arg: any): any {
  return arg;
}
```
```ts [第三版]
function identity<T>(arg: T): T {
  return arg;
}
```
:::

- 第一版和第二版没有使用泛型的情况下，都有些限制，第一版只能传 number 类型，第二版则丢失了类型信息。第三版使用泛型，既保持了类型约束又不会丢失信息。

- 第三版中是添加了 `类型变量 T`，帮助我们捕获用户传入的类型（比如 number）

- 定义泛型函数后，有两种使用方式：
  
```ts
// 明确指定类型
let output = identity<string>("myString");

// 利用类型推断
let output = identity("myString");
```

#### 8.1 泛型类型


- 泛型函数的类型与非泛型函数的类型没什么不同，只是有一个**类型参数**在最前面，像函数声明一样：

```ts
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
```

#### 8.2 泛型接口

- 有了泛型类型，就可以写泛型接口

::: code-group
```ts [第一版]
interface GenericIdentityFn {
  <T>(arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```
```ts [第二版]
interface GenericIdentityFn<T> {
  (arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```
:::

- 第一版和第二版的区别是：第一版是接口中有泛型，第二版是整个接口是泛型。第一版调用时指定类型，第二版声明时指定类型。


#### 8.3 泛型类

- 泛型类看上去与泛型接口差不多。 泛型类使用 `<>` 括起泛型类型，跟在类名后面

```ts
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

#### 8.4 泛型约束

- 先看一个例子

```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length); // Error: T doesn't have .length
  return arg;
}
```

- - 因为 T 可以是任意类型，所以不保证有 length 属性，需要添加泛型约束

```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

**在泛型约束中使用类型参数**

- 可以声明一个类型参数，且它被另一个类型参数所约束。 比如，现在我们想要用属性名从对象里获取这个属性。 并且我们想要确保这个属性存在于对象obj上，因此我们需要在这两个类型之间使用约束

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, 'a'); // okay
getProperty(x, 'm'); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

::: tip
- keyof 运算符接受对象类型，并生成其键的字符串或数字字面量联合类型

```ts
type Point = { x: number; y: number };
type P = keyof Point;

// 等价于
type P = "x" | "y";
```
:::













