
> Lombok 是一个基于 Java 的项目，用于减少重复代码的编写，提高开发效率。

> 学习 Lombok 前至少需要掌握 Java 注解部分，笔记 demo 采用的版本为 Java17

###  一、前言

- 在以往编写项目时，尤其是在类进行类内部成员字段封装时，需要编写大量的get/set方法，这不仅使得类定义中充满了get和set方法，同时如果字段名称发生改变，又要挨个进行修改，甚至当字段变得很多时，构造方法的编写会非常麻烦

```java
public class Account {
    private int id;
    private String name;
    private int age;
    private String gender;
    private String password;
    private String description;
    ...

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    ...
}
```

- 通过使用 **Lombok（小辣椒）**就可以做到简化 Java 编程中的样板代码

    - 通过**注解**的方式，能够自动生成常见的代码，比如构造函数、getter 和 setter 方法、toString 方法、equals 和 hashCode 方法等

    - 使开发者能够专注于业务逻辑，而不必重复编写冗长的代码
    
    - 官网地址：https://projectlombok.org

- 比如下面的，自动生成了get/set方法和全参构造方法

::: code-group
```java [Lombok 注解]
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Student {
    private Integer sid;
    private String name;
    private String sex;
}
```
```java [等价于]
public class Student {
    private Integer sid;
    private String name;
    private String sex;

    // @AllArgsConstructor 生成：全参构造方法
    public Student(Integer sid, String name, String sex) {
        this.sid = sid;
        this.name = name;
        this.sex = sex;
    }

    // @Getter 生成：三个字段的 getter
    public Integer getSid() { return sid; }
    public String getName() { return name; }
    public String getSex() { return sex; }

    // @Setter 生成：三个字段的 setter
    public void setSid(Integer sid) { this.sid = sid; }
    public void setName(String name) { this.name = name; }
    public void setSex(String sex) { this.sex = sex; }
}
```
:::


### 二、安装 Lombok

- 学习了 Maven 后，安装 Lombok 也很简单，只需要在 pom.xml 中添加以下依赖即可

```xml
<dependencies>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.34</version>
    </dependency>
</dependencies>
```

- Lombok是如何做到一个注解就包揽了代码生成工作的呢？

- java 编译过程可以分成三个阶段

    - 所有源文件会被解析成语法树。

    - 调用注解处理器。如果注解处理器产生了新的源文件，新文件也要进行编译

    - 最后，语法树会被分析并转化成类文件

![2-1](../images/e/2_1.png)


### 三、使用 lombok

#### 3.1 类属性相关





































