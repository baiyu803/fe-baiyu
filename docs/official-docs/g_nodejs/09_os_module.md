> os 模块提供操作系统相关的使用方法和属性

### 一、操作系统基本信息

```js
const os = require('os');

// 操作系统类型
console.log('操作系统:', os.type());
// 'Windows_NT', 'Linux', 'Darwin' (macOS)

// 平台
console.log('平台:', os.platform());
// 'win32', 'linux', 'darwin'

// 架构
console.log('CPU 架构:', os.arch());
// 'x64', 'arm64', 'ia32'

// 系统版本
console.log('系统版本:', os.release());
console.log('系统版本号:', os.version());

// 主机名
console.log('主机名:', os.hostname());

// 系统运行时间（秒）
console.log('系统运行时间:', os.uptime(), '秒');

// 系统启动时间
const bootTime = Date.now() - os.uptime() * 1000;
console.log('系统启动时间:', new Date(bootTime).toLocaleString());

// 系统负载（1分钟、5分钟、15分钟的平均负载，仅 Unix）
console.log('系统负载:', os.loadavg());
```


### 二、用户信息

```js
const os = require('os');

// 当前用户信息
console.log('当前用户:', os.userInfo());
/*
{
  uid: 501,
  gid: 20,
  username: 'username',
  homedir: '/Users/username',
  shell: '/bin/zsh'
}
*/

// 获取用户名
console.log('用户名:', os.userInfo().username);

// 获取主目录
console.log('主目录:', os.homedir());

// 获取临时目录
console.log('临时目录:', os.tmpdir());

// 获取系统临时文件路径
const tempPath = `${os.tmpdir()}/myapp-${Date.now()}`;
console.log('临时文件路径:', tempPath);
```

### 三、CPU 信息

```js
const os = require('os');

// CPU 核心数
console.log('CPU 核心数:', os.cpus().length);
```


### 四、内存信息

```js
const os = require('os');

// 总内存（字节）
const totalMemory = os.totalmem();
console.log('总内存:', (totalMemory / 1024 / 1024 / 1024).toFixed(2), 'GB');

// 空闲内存（字节）
const freeMemory = os.freemem();
console.log('空闲内存:', (freeMemory / 1024 / 1024 / 1024).toFixed(2), 'GB');

// 已用内存
const usedMemory = totalMemory - freeMemory;
console.log('已用内存:', (usedMemory / 1024 / 1024 / 1024).toFixed(2), 'GB');

// 内存使用率
const memoryUsagePercent = (usedMemory / totalMemory * 100).toFixed(2);
console.log('内存使用率:', memoryUsagePercent, '%');
```


### 五、网络信息

```js
const os = require('os');

// 获取所有网络接口
const networkInterfaces = os.networkInterfaces();

console.log('网络接口:');
Object.keys(networkInterfaces).forEach(interfaceName => {
    console.log(`\n${interfaceName}:`);
    networkInterfaces[interfaceName].forEach(details => {
        console.log(`  - 地址: ${details.address}`);
        console.log(`    子网掩码: ${details.netmask}`);
        console.log(`    协议族: ${details.family}`);
        console.log(`    内部接口: ${details.internal}`);
        console.log(`    广播地址: ${details.address}`);
        console.log(`    MAC: ${details.mac}`);
    });
});

// 获取本地 IP（非内部 IP）
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // 跳过内部地址和非 IPv4 地址
            if (!iface.internal && iface.family === 'IPv4') {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

console.log('本地 IP 地址:', getLocalIP());

// 获取所有非内部 IP
function getAllExternalIPs() {
    const ips = [];
    const interfaces = os.networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (!iface.internal && iface.family === 'IPv4') {
                ips.push({
                    name: name,
                    address: iface.address,
                    netmask: iface.netmask,
                    mac: iface.mac
                });
            }
        }
    }
    
    return ips;
}

console.log('外部 IP 列表:', getAllExternalIPs());
```


::: tip
实际应用

- 性能优化：根据 CPU 核心数调整并发数

- 系统监控：实时监控资源使用情况

- 跨平台工具：处理不同操作系统的差异

- 安装程序：获取系统目录、临时文件路径

- 健康检查：监控服务器健康状态
:::





