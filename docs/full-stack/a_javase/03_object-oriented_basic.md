
### 一、类与对象

- 除了面向过程编程，Java 还支持面向对象编程。

- 可以先定义一个类，然后创建许多这个类的实例对象。像这种编程方式就是**面向对象编程**。

#### 1.1 类的定义与对象创建

```java
public class Main {
    ...
}
```
- 这就是定义一个类的代码。之前一直看到的 demo

- 在 IDEA 中，可以有件文件夹新创建一个类。类的命名首字母大写

![a_3_1](../images/a_3_1.png)

- 这样目录下有了两个 `.java` 文件

![a_3_2](../images/a_3_2.png)

- 类是一系列实物的抽象，所有类会有一些自己的属性和方法

  - 属性就是类的成员变量

  - 属性和方法命名时，一般使用驼峰命名法，即第一个单词小写，后续单词首字母大写


```java
public class Person {   // 这里定义的人类具有三个属性，名字、年龄、性别
    String name;   // 直接在类中定义变量，表示类具有的属性
    int age;
    String sex;

    // 输出方法，接受一个参数，将属性与参数拼接后返回
    public String say(String message) {
        return "我是" + name + "，今年" + age + "岁，性别" + sex + "。" + message;
    }
}
```

:::tip
- 提问：这个为什么是 String say，不是void say ？

  - String say() — 返回数据，由调用者决定怎么用

  - void say() — 直接在方法内部输出，不返回数据

  - 选择根据实际情况来决定，返回数据还是直接输出。void say() 只能打印
:::

- 对象创建就是根据类的定义，创建一个具体的实例：`new 类名()`

```java
public static void main(String[] args) {
    new Person();   // 我们可以使用new关键字来创建某个类的对象，注意new后面需要跟上 类名()
  	// 这里创建出来的，就是一个具体的人了
}
```

#### 1.2 对象的使用

- 对象的使用就是调用对象的方法，或者访问对象的属性。

```java
public void main(String[] args) {
    Person p1 = new Person();
    Person p2 = p1;
    p1.name = "小明";   // 这个修改的是第一个对象的属性
    System.out.println(p2.name);  // 输出小明

    String message = p2.say("你好");
    System.out.println(message);  // 我是小明，今年0岁，性别null。你好
}
```

- 这段代码注意三个事情

  - 创建对象的实例时，需要使用 类名 作为变量类型

  - 对象是应用类型，p1 和 p2 是指向同一个对象的引用变量，也就是在内存中的存储地址。所以修改任意一个变量的属性，另一个变量的属性也会被修改

  - 当对象属性没有初始化时，属性会有初始值。比如整数默认是 `0`，引用类型默认是 `null`，布尔类型默认是 `false`

#### 1.3 方法的创建和使用

```java
返回值类型 方法名称() {
		方法体...
}
```

- 如果方法有返回值，就有定义具体的返回值类型，如果没有返回值，就是用 `void` 作为返回值类型

```java
public class Person {
    String name;
    int age;
    String sex;

    public String say(String message) {
        return "我是" + name + "，今年" + age + "岁，性别" + sex + "。" + message;
    }

    int sum(int a, int b) {
        return a + b;
    }
}

public void main(String[] args) {
    Person p1 = new Person();

    String message = p1.say("你好");
    System.out.println(message);

    int c = p1.sum(2, 4);
    System.out.println(c);
}
```

- 注意：**当方法返回值类型不是 void 时，方法必须有返回值（也就是 return 语句）。否则编译会报错**


#### 1.4 构造方法

- 每个类都有一个默认的构造方法，没有参数，也没有方法体。当对象创建时，会自动调用这个默认的构造方法。

  - 但是构造方法也可以手动定义，手动定义的构造方法会覆盖默认的构造方法。

  - 一般用来做些类的属性初始化工作。

```java
public class Person {
    String name;
    int age;
    String sex;

    Person(){    // 构造方法不需要指定返回值，并且方法名称与类名相同
        name = "小明";
        age = 18;
        sex = "男";
    }
}
```

- 也可以为构造方法设定参数

```java
public class Person {
    String name;
    int age;
    String sex;

    Person(String name, int age, String sex){   //跟普通方法是一样的
        this.name = name;
        this.age = age;
        this.sex = sex;
    }
}
```

- 创建对象实例时，就可以快速初始化对象的属性：`Person p1 = new Person("小明", 18, "男");`


#### 1.5 方法的重载

- 同一个类中，方法名相同，参数列表不同，就构成方法重载

  - 必须满足：方法名完全一样

  - 必须满足：参数列表不一样（三选一即可）

    - 参数个数不同

    - 参数类型不同
    - 参数顺序不同

- **返回值类型不同 ≠ 重载**

```java
public class Test {
    // ①无参
    public void say() {
        System.out.println("你好");
    }
    // ②1个int参数
    public void say(int num) {
        System.out.println("数字：" + num);
    }
    // ③1个String参数
    public void say(String msg) {
        System.out.println("消息：" + msg);
    }
    // ④两个参数，顺序不同
    public void say(int a, String b) {}
    public void say(String b, int a) {} // ✅合法重载
    
    public static void main(String[] args) {
        Test t = new Test();
        t.say();
        t.say(666);
        t.say("重载测试");
    }
}
```

#### 1.6 this 关键字

- `this` 是 Java 中指向**当前实例对象**的引用变量，可以简单理解为：**谁正在调用这个方法 / 构造器，this 就代表谁**

  - 只能在**实例方法、构造方法**中使用

  - 静态方法、静态代码块中不能使用（静态内容属于类，不绑定具体对象）

- 区分成员变量与局部变量（最常用）

  - 当方法的形参 / 局部变量名，和类的成员变量名重名时，必须用 `this.成员变量` 明确指代类的成员变量

```java
public class Person {
    // 成员变量
    private String name;
    private int age;

    // 带参构造：形参名和成员变量名完全相同
    public Person(String name, int age) {
        this.name = name;  // 左边 this.name = 成员变量；右边 name = 方法形参
        this.age = age;
    }

    // setter 方法同理
    public void setName(String name) {
        this.name = name;
    }
}
```
- 调用本类的普通成员方法（常用），但一般可以直接写方法名，不需要 `this.` 前缀

```java
public class Person {
    public void eat() {
        System.out.println("吃饭");
    }

    public void dailyLife() {
        this.eat();   // 等价于直接写 eat();
        System.out.println("睡觉");
    }
}
```

- 调用本类的其他构造方法：可以用 `this(参数列表)` 调用本类的其他重载构造方法，实现代码复用

```java
public class Person {
    private String name;
    private int age;
    private String gender;

    // 无参构造
    public Person() {
        this("未知姓名"); // 调用 1 个参数的构造方法，必须在第一行
        System.out.println("无参构造执行");
    }

    // 1 个参数的构造
    public Person(String name) {
        this(name, 0, "未知"); // 调用全参构造方法
    }

    // 全参构造
    public Person(String name, int age, String gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
}
```

- 作为返回值，返回当前对象（链式调用核心）

```java
public class Calculator {
    private int result = 0;

    // 加法方法，返回当前对象本身
    public Calculator add(int num) {
        result += num;
        return this;
    }

    public int getResult() {
        return result;
    }

    public static void main(String[] args) {
        Calculator cal = new Calculator();
        // 链式调用：连续多次调用 add 方法
        int sum = cal.add(1).add(2).add(3).getResult();
        System.out.println(sum); // 输出 6
    }
}
```

- 作为参数，传递当前对象

```java
// 辅助类
class Printer {
    public void printInfo(Person p) {
        System.out.println("人物姓名：" + p.getName());
    }
}

public class Person {
    private String name = "张三";

    public void showInfo() {
        Printer printer = new Printer();
        printer.printInfo(this); // 把当前 Person 对象作为参数传入
    }

    public String getName() {
        return name;
    }
}
```

#### 1.7 静态变量和静态方法

- 就是类中被 `static` 关键字修饰的变量和方法，不依赖于具体的对象实例，而是属于类本身

```java
public class Person {
    String name;
    static String info;    //这里我们定义一个info静态变量

    static void test(){
        System.out.println("静态变量的值为："+info);
    }
}
```

- 静态属性和方法的使用：直接用**类名.属性名 / 类名.方法名** 调用

  - 上面静态方法 test 能直接访问静态变量 info，是因为静态方法和静态变量都属于类本身。如果直接访问 name，会报错，因为 name 是实例变量，**静态方法中不能直接访问实例变量**，因为静态方法中不能使用 `this` 关键字。

![a_3_3](../images/a_3_3.png)

- 静态内容在对象构造之前的就完成了初始化，实际上就是类初始化时完成的

  - 也就是说，静态变量和静态方法在**类加载时**就完成了初始化，不会因为对象的创建而改变


### 二、包的访问和控制

#### 2.1 包声明和导入

- `包` 其实就是用来区分类位置的东西，也可以用来将所有类进行分类

  - 比如前端，一个文件下组件过多后，都需要进行划分，创建不用的业务文件夹，然后将对应的组件放到对应的文件夹下

  - 不过，java 中有个特殊的定义，就是 `包` ，它有一定的规范，不能随意创建

- 先在 IDEA 创建一个 `包` ，比如 `com.test`

![a_3_4](../images/a_3_4.png)
![a_3_5](../images/a_3_5.png)
![a_3_6](../images/a_3_6.png)

- 去文件系统查看，发现 `com.test` 其实就是文件路径，只是路径中的斜杠被替换为点
- 可以在包中创建一个类，比如 `Person`

![a_3_7](../images/a_3_7.png)
![a_3_8](../images/a_3_8.png)

::: tip
- 这里会发现在包里创建的类文件，顶部有个 `package com.test;` 这行代码，这就是 `包` 的定义

  - 区别于 Main.java 文件，因为该文件在 src 根目录下，是默认包，不需要 package 声明 （**但是项目开发中不建议使用默认包**）

  - `package com.test;` 后面的 `com.test` 就是包名，必须和文件路径一一对应

- 声明后，相当于是告诉 java 编译器，这个文件里的类都属于 `com.test` 包。便于后续其他包的访问
:::

- 同一个包中的类之间可以直接访问，但当需要再一个包中使用其他包中的类时，需要先使用 `import` 语句导入该类，才能使用该类的成员变量和方法。

::: code-group
```java [Main.java]
import com.test.Person;   //使用import关键字导入其他包中的类

public class Main {
    public static void main(String[] args) {
        Person person = new Person();   //只有导入之后才可以使用，否则编译器不知道这个类从哪来的

        System.out.println(person.name);
    }
}
```
```java [Person.java]
package com.test;

public class Person {
    String name;
    int age;
    String sex;

    Person(){
        name = "小明";
        age = 18;
        sex = "男";
    }
}
```
:::

- 当一个包中有多个类时，可以分别导入每个类，也可以使用 `import com.test.*;` 导入所有类

- 上面的代码，直接运行会报错，这个就是下面要讲的访问权限控制

![a_3_9](../images/a_3_9.png)

::: info
- 当我们定义的类和系统再带的类冲突时，比如 `String` 类，需要在类名前添加包名，比如 `com.test.String`，才能正常访问

```java
public class Main {
    public static void main(java.lang.String[] args) {   //主方法的String参数是java.lang包下的，我们需要明确指定一下，只需要在类名前面添加包名就行了
				com.test.String string = new com.test.String();
    }
}
```
:::

#### 2.2 访问权限控制

- 类中的属性和方法都是有访问权限控制的，相信大家都不陌生

- 一共四种访问权限

![a_3_10](../images/a_3_10.png)

- 上面的报错，可以通过加上 public 来解决

```java
package com.test;

public class Person {
    public String name;
    int age;
    String sex;

    public Person(){
        name = "小明";
        age = 18;
        sex = "男";
    }
}
```

- 包括类的定义也是，也可以加上访问权限，比如 `public class Person {`，不能是protected或是private权限

- 类里静态方法的导入使用要麻烦些

::: code-group
```java [Main.java]
import static com.test.Person.test;    //静态导入test方法

public class Main {
    public static void main(String[] args) {
        test();    //直接使用就可以，就像在这个类定义的方法一样
    }
}
```
```java [Person.java]
package com.test;

public class Person {
    String name;
    int age;
    String sex;
    
    public static void test(){
        System.out.println("我是静态方法！");
    }
}
```
:::













































































