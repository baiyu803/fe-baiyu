### 一、类型守卫

- 类型守卫是 TypeScript 中用于在运行时检查类型，并在编译时缩小类型范围的表达式或函数。它帮助 TypeScript 在特定的代码块中推断出更具体的类型

- 常见的类型守卫有很多

    - 自定义类型守卫 ( `is` 关键字 )
        - 使用 is 关键字定义自己的类型守卫函数
  
    - `typeof` 类型守卫    
      - 用于检查基本类型（string、number、boolean、symbol、bigint、function、object）
    - `instanceof` 类型守卫
      - 用于检查对象是否是某个类的实例。
    - `in` 操作符守卫
      - 用于检查对象是否包含某个属性
    - 字面量类型守卫
    - 真值缩小
    - 相等性缩小

::: code-group
```ts [自定义类型守卫]
interface Fish {
  swim(): void;
  name: string;
}

interface Bird {
  fly(): void;
  name: string;
}

// 自定义类型守卫：返回类型是 pet is Fish
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim();  // TypeScript 知道是 Fish
  } else {
    pet.fly();   // TypeScript 知道是 Bird
  }
}
```
```ts [typeof 类型守卫 ]
function printValue(value: string | number) {
  if (typeof value === "string") {
    // 这里 TypeScript 知道 value 是 string
    console.log(value.toUpperCase());
  } else {
    // 这里 TypeScript 知道 value 是 number
    console.log(value.toFixed(2));
  }
}
```
```ts [instanceof 类型守卫]
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();  // TypeScript 知道是 Dog
  } else {
    animal.meow();  // TypeScript 知道是 Cat
  }
}
```
```ts [in 操作符守卫]
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function move(animal: Bird | Fish) {
  if ("fly" in animal) {
    animal.fly();  // TypeScript 知道是 Bird
  } else {
    animal.swim(); // TypeScript 知道是 Fish
  }
}
```
```ts [字面量类型守卫]
type Square = {
  kind: "square";
  size: number;
};

type Circle = {
  kind: "circle";
  radius: number;
};

type Shape = Square | Circle;

function getArea(shape: Shape) {
  if (shape.kind === "square") {
    return shape.size * shape.size;  // 知道是 Square
  } else {
    return Math.PI * shape.radius ** 2;  // 知道是 Circle
  }
}
```
```ts [真值缩小]
function printLength(str: string | null | undefined) {
  if (str) {
    // 这里 str 不是 null 或 undefined
    console.log(str.length);
  } else {
    console.log("No string provided");
  }
}
```
```ts [相等性缩小]
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // 由于 x 和 y 相等，它们的类型必须重叠
    // 这里 x 和 y 都是 string
    x.toUpperCase();
    y.toLowerCase();
  }
}
```
:::

::: tip
- 选择建议
    - 检查基本类型：用 typeof

    - 检查类实例：用 instanceof

    - 检查对象属性：用 in

    - 检查复杂逻辑：用自定义类型守卫（is）

    - 检查可辨识联合：用字面量类型（kind/type 字段）
:::


### 二、可辨识联合

- 合并单例类型，联合类型，类型守卫和类型别名来创建一个叫做可辨识联合的高级模式。具备三个要素

    - 单例类型 - 可辨识的特征
    - 一个类型别名包含了那些类型的联合 - 联合类型
    - 类型守卫

```ts
interface Square {
  kind: 'square';
  size: number;
}
interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}
interface Circle {
  kind: 'circle';
  radius: number;
}
// kind 字段是可辨识的特征
type Shape = Square | Rectangle | Circle;
function area(s: Shape) {
  switch (s.kind) {
    case 'square':
      return s.size * s.size;
    case 'rectangle':
      return s.height * s.width;
    case 'circle':
      return Math.PI * s.radius ** 2;
  }
}
```


### 三、映射类型

- 虽然前面多讲了，但是这里在记录下，因为他是实用工具类型的基础

- **类型映射** 是 TypeScript 中用于根据已有的类型创建**新类型**的一种机制。

- 比如，常见的将一个已知的类型每个属性都变为可选的或者只读的

::: code-group
```ts [例子一]
type Person = {
  a: number;
  b: string
}
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 使用
type PersonPartial = Partial<Person>;
type ReadonlyPerson = Readonly<Person>;
```
```ts [例子二]
type Keys = 'option1' | 'option2';
type Flags = { [K in Keys]: boolean };

// 等价于
type Flags = {
  option1: boolean;
  option2: boolean;
};
```
```ts [例子三]
type Person = {
  a: number;
  b: string
}
type NullablePerson = { [P in keyof Person]: Person[P] | null };
type PartialPerson = { [P in keyof Person]?: Person[P] };

// 等价于
type NullablePerson = {
    a: number | null;
    b: string | null;
}
type PartialPerson = {
    a?: number | undefined;
    b?: string | undefined;
}
```
:::


### 四、实用工具类型

- TypeScript 提供了多个实用工具类型，用于在类型中进行操作。这些类型是全局可见的

- 官方文档列出了 20+ 个，实际不止，但常用的也不多

#### 4.1 `Partial<Type>`

- 构造类型`Type`，并将他所有的属性都变为可选的，它的返回类型表示输入类型的所有子类型
  
#### 4.2 `Readonly<Type>`

- 将所有属性设置为 `readonly`，也就是说构造出的类型的属性不能被再次赋值

```ts
// 类似于 Object.freeze
function freeze<T>(obj: T): Readonly<T>;
```

#### 4.3 `Record<Keys, Type>`

- 构造一个类型，其属性名的类型为 K，属性值的类型为 T

::: code-group
```ts [定义实现]
type MyRecord<K extends keyof any, T> = {
  [P in K]: T;
};
```
```ts [举例]
interface PageInfo {
  title: string;
}

type Page = 'home' | 'about' | 'contact';

const x: Record<Page, PageInfo> = {
  about: { title: 'about' },
  contact: { title: 'contact' },
  home: { title: 'home' },
};
```
:::


#### 4.4 `Required<Type>`

- 构造类型`Type`，并将他所有的属性都变为必填的

::: code-group
```ts [定义实现]
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```
```ts [举例]
interface Person {
  a?: number;
  b?: string
}
type RequiredPerson = Required<Person>;
```
:::


#### 4.5 `Pick<Type, Keys>`

- 从类型Type中挑选部分属性Keys来构造类型

::: code-group
```ts [定义实现]
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```
```ts [举例]
interface Person {
  a: number;
  b: string;
  c: boolean;
}
type PersonPick = Pick<Person, 'a' | 'b'>
```
:::


#### 4.6 `Omit<Type, Keys>`

- 从类型Type中获取所有属性，然后从中剔除Keys属性后构造一个类型

::: code-group
```ts [定义实现]
type Omit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};
```
```ts [举例]
interface Person {
  a: number;
  b: string;
  c: boolean;
}
type PersonOmit = Omit<Person, 'a' | 'b'>
```
:::

#### 4.7 `Exclude<Type, Union>`

- 从类型 Type 中剔除所有可以赋值给 Union 的属性，然后构造一个类型

::: code-group
```ts [定义实现]
type Exclude<T, U> = T extends U ? never : T;
```
```ts [举例]
type T0 = Exclude<'a' | 'b' | 'c', 'a'>; // "b" | "c"
type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>; // "c"
```
:::

::: tip
这里运用了分布式条件类型，当 `Type` 是联合类型时，条件类型会分发到联合类型的每个成员
:::


#### 4.8 `Extract<Type, Union>`

- 从类型Type中提取所有可以赋值给Union的类型，然后构造一个类型

::: code-group
```ts [定义实现]
type Extract<T, U> = T extends U ? T : never;
```
```ts [举例]
type T0 = Extract<'a' | 'b' | 'c', 'a'>; // "a"
type T1 = Extract<'a' | 'b' | 'c', 'a' | 'b'>; // "a" | "b"
```
:::


#### 4.9 `NonNullable<Type>`

- 从类型Type中剔除null和undefined，然后构造一个类型

::: code-group
```ts [定义实现]
type NonNullable<T> = T extends null | undefined ? never : T;
```
```ts [举例]
type T0 = NonNullable<number | null>; // number
type T1 = NonNullable<string | undefined>; // string
```
:::


#### 4.10 `ReturnType<Type>`

- 由函数类型 Type 的返回值类型构建一个新类型  

::: code-group
```ts [定义实现]
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```
```ts [举例]
type T0 = ReturnType<() => number>; // number
type T1 = ReturnType<() => void>; // void
type T2 = ReturnType<(<T>() => T)>;  // unknown
```
:::

::: tip
`infer` 相当与类型推导助手，在泛型里，把“你不知道的类型”临时取个名，抽出来给你用

- 比如，在数组里想拿到数组里元素的类型
```ts
// 定义：提取数组元素类型
type GetArrayItem<T> = T extends (infer U)[] ? U : never;

// 使用
type Arr = string[];
type Item = GetArrayItem<Arr>; 
// 👆 Item 就是 string
```
- `infer U`：临时声明 U 是数组里的元素类型。TypeScript 自动帮你推导出 `U = string`

- 核心规则：
  - `infer` 只能在**条件类型**里使用（也就是 T extends xxx ? : 这种写法）
  - `infer` 只能用来「临时命名未知类型」
  - 它的作用只有一个：从复杂类型里，抠出内部的小类型

:::


#### 4.11 `Parameters<Type>`

- 由函数类型Type的参数类型来构建出一个元组类型

::: code-group
```ts [定义实现]
type Parameters<T> = T extends (...args: infer P) => P ? P : never;
```
```ts [举例]
type T0 = Parameters<(a: number, b: string) => void>; // [number, string]
```
:::


#### 4.12 `InstanceType<Type>`

- 由构造函数类型 Type 的实例类型来构建一个新类型

::: code-group
```ts [定义实现]
type InstanceType<T> = T extends new (...args: any[]) => infer I ? I : never;
```
```ts [举例]
type T0 = InstanceType<new () => Person>; // Person
```
:::


#### 4.13 `ConstructorParameters<Type>`

- 由构造函数类型来构建出一个元组类型或数组类型
  
- 用的不多

::: code-group
```ts [定义实现]
type ConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;
```
```ts [举例]
type T0 = ConstructorParameters<new (a: number, b: string) => Person>; // [number, string]
```
:::


### 五、Decorators 装饰器



::: tip
在 javaScript 中，装饰器目前处在建议征集的第三阶段，已接近完成。但在 TypeScript 里已作为一项实验性特性予以支持

注意，因为是实验性，所以在未来版本中可能会发生改变

要想启用，需要在命令行或者配置文件里添加 `--experimental-decorators` 标志位

```json
// tsconfig.json
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```
:::

- 装饰器是一种特殊类型的声明，它能被附加到**类声明、方法、访问符、属性或参数**上。装饰器使用`@expression` 这种形式，`expression` 是一个函数，当装饰器被应用到目标声明时，会调用这个函数，被装饰的声明信息被作为参数传入


#### 5.1 装饰器工厂

- 装饰器工厂是一个简单的函数，它返回一个表达式，以供装饰器在运行时调用

```ts
function color(value: string) {
  // 这是一个装饰器工厂
  return function (target) {
    //  这是装饰器
    // do something with "target" and "value"...
  };
}
```

#### 5.2 装饰器组合

- 多个装饰器可以同时应用到一个声明上

```ts
// 书写在同一行上
@f @g x
// 书写在多行上
@f
@g
x
```
- 装饰器的执行顺序是从内到外，从右到左执行的

- 如果使用装饰器工厂的话，可以看下面的例子

```ts
function f() {
  console.log('f(): evaluated');
  return function (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log('f(): called');
  };
}

function g() {
  console.log('g(): evaluated');
  return function (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log('g(): called');
  };
}

class C {
  @f()
  @g()
  method() {}
}

// 输出
// f(): evaluated
// g(): evaluated
// g(): called
// f(): called
```

#### 5.3 装饰器求值

- 类中不同声明上的装饰器将按一下规定的顺序应用
  -  参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员
  -  参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员
  -  参数装饰器应用到构造函数
  -  类装饰器应用到类声明
  
#### 5.4 类装饰器

-  类装饰器应用于类构造函数，可以用来监视，修改或替换类定义。 类装饰器不能用在声明文件中(.d.ts)，也不能用在任何外部上下文中（比如declare的类）

- 类装饰器表达式会在运行时当作函数被调用，**类的构造函数作为其唯一的参数**

- 看一个重载构造函数的例子

```ts
// 完整示例
function classDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  console.log('1. 装饰器执行');
  return class extends constructor {
    newProperty = 'new property';
    hello = 'override';
    
    constructor(...args: any[]) {
      super(...args);
      console.log('3. 增强类构造函数执行');
      console.log('   this.hello =', this.hello);
      console.log('   this.newProperty =', this.newProperty);
      console.log('   this.property =', this.property);
    }
  };
}

@classDecorator
class Greeter {
  property = 'property';
  hello: string;
  
  constructor(m: string) {
    console.log('2. 原始类构造函数执行');
    this.hello = m;
    console.log('   设置 this.hello =', m);
  }
}

console.log('开始实例化');
const result = new Greeter('world');
console.log('实例化完成');
console.log('最终结果:', result);

// 输出顺序：
// 开始实例化
// 1. 装饰器执行
// 2. 原始类构造函数执行
//    设置 this.hello = world
// 3. 增强类构造函数执行
//    this.hello = override
//    this.newProperty = new property
//    this.property = property
// 实例化完成
// 最终结果: Greeter { property: 'property', hello: 'override', newProperty: 'new property' }
```

- 也可以去掉`hello = 'override';`，这样`hello`就会是`world`


#### 5.5 方法装饰器

- 它会被应用到方法的**属性描述符**上，可以用到监视、修改或替换方法定义

- 方法装饰器接受三个参数

    - 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
    - 方法成员的名字
    - 方法的属性描述符
```ts
// 属性描述符解构
interface PropertyDescriptor {
  configurable?: boolean;  // 能否删除、修改属性特性
  enumerable?: boolean;    // 能否被枚举（for...in）
  value?: any;            // 属性的值
  writable?: boolean;     // 能否被修改
  get?(): any;           // getter 函数
  set?(v: any): void;    // setter 函数
}
```
- 写装饰器时可以直接写普通函数，只有需要传入自定义参数时可以使用函数工厂

::: code-group
```ts [普通函数]
function methodDecorator(
  target: any,           // 对于实例方法：原型对象；静态方法：构造函数
  propertyKey: string,   // 方法名
  descriptor: PropertyDescriptor  // 属性描述符
) {
  console.log('descriptor:', descriptor);
}

class Example {
  @methodDecorator
  instanceMethod() {
    return 'instance';
  }
  
  @methodDecorator
  static staticMethod() {
    return 'static';
  }
}
```
```ts [函数工厂]
function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value;
  };
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return 'Hello, ' + this.greeting;
  }
}
```
:::


#### 5.6 访问器装饰器

- 应用于访问器的属性描述符并且可以用来监视，修改或替换一个访问器的定义

- 和方法装饰器一样，也是传入三个参数

```ts
class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() {
    return this._x;
  }

  @configurable(false)
  get y() {
    return this._y;
  }
}

function configurable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}
```

#### 5.7 属性装饰器

- 只传入两个参数，和上面的区别是，没有第三个参数'
- 如果装饰器返回一个值，它会被用作属性的属性描述符

```ts
// 属性验证装饰器
function validate(minLength: number, maxLength: number) {
  return function(target: any, propertyKey: string) {
    let value: string;
    
    // 使用 Object.defineProperty 来拦截属性的读写
    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      set(newValue: string) {
        if (newValue.length < minLength) {
          throw new Error(`${propertyKey} 长度不能小于 ${minLength}`);
        }
        if (newValue.length > maxLength) {
          throw new Error(`${propertyKey} 长度不能大于 ${maxLength}`);
        }
        value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class User {
  @validate(2, 20)
  username: string;
  
  @validate(6, 30)
  password: string;
  
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

// 使用
const user = new User('john', '123456');  // ✅ 正常
// const user2 = new User('j', '123456');   // ❌ Error: username 长度不能小于 2
// const user3 = new User('john', '123');    // ❌ Error: password 长度不能小于 6
```

#### 5.8 参数装饰器

```ts
function paramDecorator(
  target: any,           // 原型对象（实例方法）或构造函数（静态方法）
  propertyKey: string,   // 方法名
  parameterIndex: number // 参数的位置索引（从0开始）
) {
  console.log(`参数 ${parameterIndex} 被装饰`);
}

class Example {
  method(
    @paramDecorator param1: string,
    @paramDecorator param2: number
  ) {
    // 业务逻辑
  }
}
```

#### 5.9 元数据

- TypeScript 5.0 之前的老式装饰器元数据（emitDecoratorMetadata），需要配置，以及安装依赖包 reflect-metadata

- TypeScript 5.0+ 支持的新标准装饰器不会自动生成类型元数据。元数据需要通过 Symbol.metadata 手动存储和读取

- 元数据就是“关于数据的数据”，用来描述数据的额外信息

  - 元数据一般用在框架里，业务开发很少自定义，而是无感知的在使用，比如 nest.js 开发中常用

::: code-group
```ts []
// 告诉框架如何处理数据

class UserForm {
  @Required()           // 元数据：这个字段必填
  @MinLength(2)         // 元数据：最少2个字符
  name: string;
  
  @Email()              // 元数据：必须是邮箱格式
  email: string;
  
  @Sensitive()          // 元数据：敏感信息，输出时隐藏
  password: string;
}
```
```ts [详细实现]
import "reflect-metadata";

// ============ 元数据存储 Key ============
const VALIDATION_METADATA = Symbol('validation');
const SENSITIVE_METADATA = Symbol('sensitive');

// ============ 验证装饰器 ============

// Required 装饰器
function Required() {
  return function(target: any, propertyKey: string) {
    // 获取已有的验证规则
    const rules = Reflect.getMetadata(VALIDATION_METADATA, target, propertyKey) || [];
    rules.push({
      type: 'required',
      validate: (value: any) => value !== undefined && value !== null && value !== '',
      message: `${propertyKey} 不能为空`
    });
    Reflect.defineMetadata(VALIDATION_METADATA, rules, target, propertyKey);
  };
}

// MinLength 装饰器
function MinLength(length: number) {
  return function(target: any, propertyKey: string) {
    const rules = Reflect.getMetadata(VALIDATION_METADATA, target, propertyKey) || [];
    rules.push({
      type: 'minLength',
      value: length,
      validate: (value: any) => {
        if (value === undefined || value === null) return true; // 由 Required 处理空值
        return String(value).length >= length;
      },
      message: `${propertyKey} 长度不能小于 ${length}`
    });
    Reflect.defineMetadata(VALIDATION_METADATA, rules, target, propertyKey);
  };
}

// Email 装饰器
function Email() {
  return function(target: any, propertyKey: string) {
    const rules = Reflect.getMetadata(VALIDATION_METADATA, target, propertyKey) || [];
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    rules.push({
      type: 'email',
      validate: (value: any) => {
        if (value === undefined || value === null || value === '') return true;
        return emailRegex.test(String(value));
      },
      message: `${propertyKey} 格式不正确，必须是有效的邮箱地址`
    });
    Reflect.defineMetadata(VALIDATION_METADATA, rules, target, propertyKey);
  };
}

// Sensitive 装饰器
function Sensitive(maskFn?: (value: any) => string) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata(SENSITIVE_METADATA, {
      maskFn: maskFn || ((value: any) => '***'),
      propertyKey
    }, target, propertyKey);
  };
}

// ============ 验证器 ============

class Validator {
  static validate(obj: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const prototype = Object.getPrototypeOf(obj);
    
    // 遍历所有属性
    for (const key of Object.keys(obj)) {
      const rules = Reflect.getMetadata(VALIDATION_METADATA, prototype, key) || [];
      const value = obj[key];
      
      for (const rule of rules) {
        if (!rule.validate(value)) {
          errors.push(rule.message);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// ============ 序列化器（脱敏） ============

class Serializer {
  static serialize(obj: any): any {
    const result = { ...obj };
    const prototype = Object.getPrototypeOf(obj);
    
    for (const key of Object.keys(obj)) {
      const sensitiveMeta = Reflect.getMetadata(SENSITIVE_METADATA, prototype, key);
      if (sensitiveMeta) {
        result[key] = sensitiveMeta.maskFn(obj[key]);
      }
    }
    
    return result;
  }
}

// ============ 完整示例 ============

class UserForm {
  @Required()
  @MinLength(2)
  name: string;
  
  @Required()
  @Email()
  email: string;
  
  @Sensitive()
  password: string;
  
  @Sensitive((phone: string) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  })
  phone: string;
  
  constructor(name: string, email: string, password: string, phone: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
  }
}

// ============ 业务使用 ============

// 1. 验证表单
const validForm = new UserForm('张三', 'zhang@example.com', '123456', '13812345678');
const validationResult = Validator.validate(validForm);
console.log('验证结果:', validationResult);
// 输出: { valid: true, errors: [] }

// 2. 验证失败的情况
const invalidForm = new UserForm('', 'invalid-email', '123456', '13812345678');
const invalidResult = Validator.validate(invalidForm);
console.log('验证失败:', invalidResult);
// 输出: { valid: false, errors: ['name 不能为空', 'email 格式不正确'] }

// 3. 序列化（脱敏）
const user = new UserForm('李四', 'li@example.com', 'secret', '13987654321');
const serialized = Serializer.serialize(user);
console.log('序列化后:', serialized);
// 输出: { name: '李四', email: 'li@example.com', password: '***', phone: '139****4321' }

// 4. 完整的 API 响应处理
class ApiResponse {
  static success(data: any) {
    // 自动脱敏后返回
    return {
      code: 200,
      data: Serializer.serialize(data),
      timestamp: Date.now()
    };
  }
}

const userForm = new UserForm('王五', 'wang@example.com', 'pwd123', '15012345678');
console.log('API响应:', ApiResponse.success(userForm));
// 输出: {
//   code: 200,
//   data: { name: '王五', email: 'wang@example.com', password: '***', phone: '150****5678' },
//   timestamp: 1732345678901
// }
```
:::


### 六、声明合并

#### 6.1 合并接口

- 合并的机制是把双方的成员放到一个同名的接口里

- 接口的非函数成员应该是唯一的，如果不唯一也必须是相同的类型，否则会报错。对于函数成员，则是重载关系，且后面的接口拥有更高的优先级

#### 6.2 合并命名空间

- 命名空间的合并仅针对导出成员的合并，对于非导出成员，是不合并的，也只有原有的命名空间方法可以访问

#### 6.3 命名空间与类和函数和枚举类型合并

- 命名空间与类和函数和枚举类型的合并，是把命名空间的成员和类、函数、枚举类型的成员合并到一个作用域里。

::: code-group
```ts [与类]
class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export class AlbumLabel {}
}
```
```ts [与函数]
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}

namespace buildLabel {
  export let suffix = '';
  export let prefix = 'Hello, ';
}

console.log(buildLabel('Sam Smith'));
```
```ts [与枚举]
enum Color {
  red = 1,
  green = 2,
  blue = 4,
}

namespace Color {
  export function mixColor(colorName: string) {
    if (colorName == 'yellow') {
      return Color.red + Color.green;
    } else if (colorName == 'white') {
      return Color.red + Color.green + Color.blue;
    } else if (colorName == 'magenta') {
      return Color.red + Color.blue;
    } else if (colorName == 'cyan') {
      return Color.green + Color.blue;
    }
  }
}
```
:::

::: tip
TypeScript 并非允许所有的合并，目前，类不能与其他类或变量合并
:::


### 七、JSX

- 暂时不记录，因为没使用过 JSX，记录也不会，[原文档阅读](https://typescript.uihtm.com/zh/reference/jsx.html)


### 八、混入

- 上面声明合并有提到，类不能与其他类合并。但是可以通过混入模拟类的合并
- 混入的思想是：通过组合多个类的功能到一个类，实现多重继承的效果（ts 类只能继承一个）
- 先看混入示例
```ts
// Disposable Mixin
class Disposable {
  isDisposed: boolean;
  dispose() {
    this.isDisposed = true;
  }
}
// Activatable Mixin
class Activatable {
  isActive: boolean;
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}
class SmartObject {
  constructor() {
    setInterval(
      () => console.log(this.isActive + ' : ' + this.isDisposed),
      500
    );
  }
  interact() {
    this.activate();
  }
}
interface SmartObject extends Disposable, Activatable {}
applyMixins(SmartObject, [Disposable, Activatable]);
let smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);
////////////////////////////////////////
// In your runtime library somewhere
////////////////////////////////////////
function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      );
    });
  });
}
```

- 解释下，`interface SmartObject extends Disposable, Activatable {}` 是做类型合并的，相同名称的类和接口是可以实现声明合并的，这样 TypeScript 编译器会认为 SmartObject 类具有 Disposable 和 Activatable 的成员。但它不产生任何 JS 代码，运行时 SmartObject 还是只有自己的方法。所以需要 `applyMixins` 方法，它会将 mixin 类的方法复制到目标类上，这样运行时也能调用这些方法。




























