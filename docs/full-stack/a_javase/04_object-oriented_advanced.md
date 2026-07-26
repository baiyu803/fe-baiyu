
### 一、基本类型包装类

- Java 中的**基本类型**，如果想通过对象的形式去使用他们，Java 提供的**基本类型包装类**，使得Java能够更好的体现面向对象的思想，同时也使得基本类型能够支持对象操作

#### 1.1 包装类介绍

- 所有的包装类层次结构如下：

![a_4_1](../images/a_4_1.png)

- 以 `Integer` 类为例

```java
public static void main(String[] args) {
    Integer i = new Integer(10);    // 将10包装为一个Integer类型的变量
}
```

- 包装类实际上就是将基本数据类型，封装成一个类（运用了封装的思想），可以来看看 Integer 类中是怎么写的：

```java
private final int value;  // 类中实际上就靠这个变量在存储包装的值

public Integer(int value) {
    this.value = value;
}
```

- 包装类型支持**自动装箱**，可以直接将一个对应的基本类型值作为对应包装类型引用变量的值

```java
public static void main(String[] args) {
    Integer i = 10;    // 将int类型值作为包装类型使用，这里就是运用了自动装箱，本质上就是被自动包装成了一个 Integer 类型的对象

    Integer i = Integer.valueOf(10);    // 上面的写法跟这里是等价的
}
```

- 既然能装箱，也是支持拆箱的

```java
public static void main(String[] args) {
    Integer i = 10;
    int a = i;
}

// 本质上就是
public static void main(String[] args) {
    Integer i = 10;
    int a = i.intValue();   // 通过此方法变成基本类型 int 值
}
```
::: info
自动装箱/拆箱 ：Java 自动在基本类型和包装类型之间转换，比如 `Integer i = 10` 实际是调用了 `Integer.valueOf(10)` ， `int a = i` 实际是调用了 `i.intValue()`
:::

- 得益于自动装箱/拆箱，可以让包装类型轻松地参与到基本类型的运算中：

```java
public static void main(String[] args) {
    Integer a = 10, b = 20;
    int c = a * b; 
    System.out.println(c);
}
```
::: tip
- 因为包装类是一个类，不是基本类型，所以说两个不同的对象，那么是不相等的
```java
public static void main(String[] args) {
    Integer a = new Integer(10);
    Integer b = new Integer(10);

    System.out.println(a == b);    //虽然a和b的值相同，但是并不是同一个对象，所以说==判断为假
}
```

- 但是自动装箱后，两个包装类型的值相同，那么就是相等的
```java
public static void main(String[] args) {
    Integer a = 10;
    Integer b = 10;

    System.out.println(a == b);    // true
}
```
- 那是因为 IntegerCache 会默认缓存-128~127之间的所有值，所以这两个对象是同一个对象

- 如果超出这个缓存范围的话，就会得到不同的对象了

```java
public static void main(String[] args) {
    Integer a = 128;
    Integer b = 128;

    System.out.println(a == b);    // false
}
```
:::

- 包装类支持字符串直接转换
```java
public static void main(String[] args) {
    Integer i = new Integer("666");
    // Integer i = Integer.valueOf("666");
    // Integer i = Integer.parseInt("666");

    System.out.println(i);    // 666
}
```
- 也支持对十六进制和八进制的字符串进行解码，得到对应的int值
```java
public static void main(String[] args) {
    Integer i = Integer.decode("0xA6");

    System.out.println(i);
}
```
- 也可以将十进制的整数转换为其他进制的字符串

```java
public static void main(String[] args) {
    System.out.println(Integer.toHexString(166));
}
```

#### 1.2 特殊包装类

- 除了上面几种基本类型包装类之外，还有两个比较特殊的包装类型：`BigInteger` 和 `BigDecimal`

- 我们知道，即使是最大的 `long` 类型，也只能表示64bit的数据，无法表示一个非常大的数，但是 `BigInteger` 没有这些限制

```java
public static void main(String[] args) {
    BigInteger i = BigInteger.valueOf(Long.MAX_VALUE);
    i = i.multiply(BigInteger.valueOf(Long.MAX_VALUE));   //即使是long的最大值乘以long的最大值，也能给你算出来
    System.out.println(i);
}
```
- 看看结果

![a_4_2](../images/a_4_2.png)


- 前面我们说了，浮点类型精度有限，对于需要精确计算的场景，就没办法了，而 `BigDecimal` 可以实现小数的精确计算

  - 但是注意，对于这种结果没有终点的，无限循环的小数，我们必须要限制长度，否则会出现异常

```java
public static void main(String[] args) {
    BigDecimal i = BigDecimal.valueOf(10);
    i = i.divide(BigDecimal.valueOf(3), 100, RoundingMode.CEILING);
  	//计算10/3的结果，精确到小数点后100位
  	//RoundingMode是舍入模式，就是精确到最后一位时，该怎么处理，这里CEILING表示向上取整
    System.out.println(i);
}
```

![a_4_3](../images/a_4_3.png)













































































































