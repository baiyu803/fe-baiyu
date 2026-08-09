

### 一、多线程

- 在之前的学习中，一直以来编写的都是单线程应用程序（运行main()方法的内容），也就是说只能同时执行一个任务

- 如果希望同时执行多个任务（两个方法同时在运行或者是两个计算同时在进行，也就是 ***并发*** 的），就需要用到 Java 多线程框架

- 实际上一个 Java 程序启动后，会创建很多辅助线程，不仅仅只运行一个主线程

  - `main`：用户主线程，默认创建的线程，用户程序从这里开始执行
  - `Reference Handler`：引用处理线程，负责处理对象的引用关系
  - `Finalizer`：终结器线程，负责处理对象的终结器方法
  - `Signal Dispatcher`：信号分发线程，负责处理信号量
  - `Common-Cleaner`：公共清理线程，负责清理对象的终结器方法
  - `Monitor Ctrl-Break`：监控 Ctrl+Break 等信号，负责处理 Ctrl+Break 等信号的处理
  - `Notification Thread`：通知线程，负责处理通知事件

![a_8_1](../images/a_8_1.png)

> 关于除了 main 线程默认以外的线程，涉及到 JVM 相关底层原理，在这里不做讲解，后续学习记录


### 二、线程的创建与启动

- 通过创建 `Thread` 对象来创建一个新的线程，`Thread` 构造方法中需要传入一个 `Runnable` 接口的实现

  - 其实就是编写要在另一个线程执行的逻辑

```java
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}
```

- 同时 `Runnable` 接口只有一个未实现方法，因此可以直接使用 `lambda` 表达式来实现：

```java
public static void main(String[] args) {
    Thread t = new Thread(() -> {    //直接编写逻辑
        System.out.println("我是另一个线程！");
    });
    t.start();   //调用此方法来开始执行此线程
}
```

- 创建好线程后，需要调用 `start()` 方法来启动线程，否则线程不会执行逻辑

  - **一个 Thread 实例只能 start 一次，否则会抛出 `IllegalThreadStateException` 异常**

- 创建线程的方式有多种

#### 2.1 继承 Thread 类（最简单）

- 步骤：
  - 自定义类继承 `Thread`

  - 重写 `run()` 方法，写线程任务
  - new 对象，调用 `start()` 启动

```java
// 1. 继承Thread
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("子线程执行：" + Thread.currentThread().getName());
    }
}

public class Test {
    public static void main(String[] args) {
        MyThread t = new MyThread();
        t.start(); // 启动新线程，自动执行run
        // t.run(); // 错误！仅普通方法调用，无新线程
    }
}
```

- 缺点：Java 单继承，继承 Thread 后无法再继承其他类，耦合高

- 优化：可直接实现 `Runnable` 接口，避免耦合高问题

#### 2.2 实现 Runnable 接口

- 步骤：
  - 自定义类实现 `Runnable` 接口

  - 实现 `run()` 任务方法
  - 把 Runnable 实例传入 Thread 构造器
  - 调用 `start()`()

```java
// 任务类，和线程本身解耦
class MyTask implements Runnable {
    @Override
    public void run() {
        System.out.println("Runnable子线程");
    }
}

public class Test {
    public static void main(String[] args) {
        Runnable task = new MyTask();
        Thread t = new Thread(task);
        t.start();
    }
}
```

#### 2.3 Lambda 简化写法（实际开发最常用）

```java
public class Test {
    public static void main(String[] args) {
        // 一行创建并启动线程
        new Thread(() -> {
            System.out.println("lambda子线程");
        }).start();
    }
}
```
- 最开始介绍的 demo 就是这种

#### 2.4 Callable + FutureTask（有返回值、可抛异常）

- 自行了解

::: tip
- 线程之间是独立的，同时运行的

- 下面的代码就是交替打印的

```java
public static void main(String[] args) {
    Thread t1 = new Thread(() -> {
        for (int i = 0; i < 50; i++) {
            System.out.println("我是一号线程："+i);
        }
    });
    Thread t2 = new Thread(() -> {
        for (int i = 0; i < 50; i++) {
            System.out.println("我是二号线程："+i);
        }
    });
    t1.start();
    t2.start();
}
```
:::

### 三、线程池

- 生产环境、大量并发任务首选，不手动 `new Thread`

- 业务开发不会频繁手动创建销毁 `Thread`（频繁创建销毁内核线程开销极大）

  - 线程池复用已有线程，降低消耗

  - 可控并发数量，防止无限创建线程导致 CPU / 内存打满、OOM 等问题

- 统一使用线程池：`Executors / ThreadPoolExecutor`

```java
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;

public class PoolTest {
    public static void main(String[] args) {
        // 核心线程5个
        ExecutorService pool = Executors.newFixedThreadPool(5);
        // 提交无返回任务
        pool.execute(() -> System.out.println("固定线程池任务"));
        // 提交有返回任务
        Future<Integer> future = pool.submit(() -> 100 + 200);
        System.out.println(future.get());
        pool.shutdown(); // 关闭线程池
    }
}
```

- 除了使用 `newFixedThreadPool` 创建固定线程池，还可以使用 `newSingleThreadExecutor` 创建单线程池，`newCachedThreadPool` 创建缓存线程池，`newScheduledThreadPool` 创建定时线程池

- **但是，生产标准一般禁止使用 `Executors` 快捷创建线程池**，推荐手动创建 `ThreadPoolExecutor`

```java
import java.util.concurrent.*;

public class ThreadPoolDemo {
    public static void main(String[] args) {
        // 手动创建线程池
        ExecutorService pool = new ThreadPoolExecutor(
                5,                      // 核心线程5
                10,                     // 最大线程10
                60L,                    // 空闲线程存活60秒
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(100), // 有界队列，最多存100个等待任务
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.CallerRunsPolicy() // 拒绝策略
        );

        // 提交无返回任务 execute
        pool.execute(() -> {
            System.out.println(Thread.currentThread().getName() + " 执行任务");
        });

        // 提交有返回任务 submit
        Future<String> future = pool.submit(() -> {
            return "任务执行完成";
        });
        try {
            String result = future.get(); // 阻塞获取结果
            System.out.println(result);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 优雅关闭：执行完现有任务再关闭
        pool.shutdown();
    }
}
```

> 关于线程池还有很多内容，就不展开了


### 四、线程的休眠和中断

#### 4.1 线程休眠 sleep

- 让当前线程主动进入阻塞状态，放弃 CPU 时间片，休眠指定毫秒，时间到自动恢复就绪态

- 属于静态方法，永远休眠**当前执行代码的线程**，不是调用者线程

- 核心特点

  - 休眠期间不会释放锁

  - 必须捕获 / 抛出 `InterruptedException`（可中断异常）

  - 时间只是最小等待时长，睡醒后不会立刻运行，需要等待 CPU 调度

```java
public class SleepDemo {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("开始休眠");
        // 当前主线程休眠2秒
        Thread.sleep(2000);
        System.out.println("休眠结束");
    }
}
```

::: tip
- 易错点

```java
Thread t = new Thread(() -> {});
t.sleep(1000); // 坑！静态方法，实际休眠main主线程，不是t
```
:::


#### 4.2 线程中断 interrupt

- 协商式终止线程，仅设置中断标记，不强制终止线程执行

- 三个核心 API

  - `thread.interrupt()`：给目标线程打中断标记（只是设置布尔标识，不会直接杀死线程）

  - `thread.isInterrupted()`：查询线程的中断标记，不清除标记
  - `Thread.interrupted()`：静态方法，查询当前线程中断标记，**查询后清空标记**

- 两种中断响应机制

- 第一种：线程处于阻塞态（sleep/wait/join）

```java
Thread t = new Thread(() -> {
    try {
        Thread.sleep(10000);
    } catch (InterruptedException e) {
        // 休眠中被中断，进入这里，标记已自动重置为false
        System.out.println("线程被中断");
    }
});
t.start();
Thread.sleep(1000);
t.interrupt(); // 1秒后打断sleep
```

- 第二种：线程正常运行，不会抛异常，仅修改中断标记，需要业务代码手动循环判断标记退出

```java
public static void main(String[] args) {
    Thread t = new Thread(() -> {
        System.out.println("线程开始运行！");
        while (true){
            if(Thread.currentThread().isInterrupted()){   // 判断是否存在中断标志
                System.out.println("发现中断信号，复位，继续运行...");
                Thread.interrupted();  // 复位中断标记（返回值是当前是否有中断标记，这里不用管）
            }
        }
    });
    t.start();
    try {
        Thread.sleep(3000);   // 休眠3秒，一定比线程t先醒来
        t.interrupt();   // 调用t的interrupt方法
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}
```

### 五、线程优先级

- 实际上，Java 程序中的每个线程并不是平均分配CPU时间的，为了使得线程资源分配更加合理，Java采用的是抢占式调度方式，优先级越高的线程，优先使用CPU资源

- 优先级一般分为三种

  - MIN_PRIORITY 最低优先级

  - MAX_PRIORITY 最高优先级
  - NOM_PRIORITY 常规优先级


```java
public static void main(String[] args) {
    Thread t = new Thread(() -> {
        System.out.println("线程开始运行！");
    });
    t.setPriority(Thread.MIN_PRIORITY);  // 通过使用 setPriority 方法来设定优先级
    t.start();
}
```

- **优先级越高的线程，获得CPU资源的概率会越大，并不是说一定优先级越高的线程越先执行**




















































