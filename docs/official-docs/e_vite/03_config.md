
::: info
只简单记录我觉得比较有用的配置
:::

### 一、配置 Vite

- 当以命h行方式运行`vite` 时，Vite 会自动尝试解析项目根目录下的 `vite.config.js` 文件。

```js
export default {
  // 配置选项
}
```

- 注意，即使没有在 `package.json` 配置了 `"type": "module"`，Vite 也支持在配置文件中使用 ES 模块语法，因为 Vite 会自动处理。

- 也可以通过 `--config` 显示地指定一个配置文件

```
vite --config my-config.js
```


#### 1.1 配置智能提示

- 其实就是提供 TypeScript 类型支持，让开发者在编写配置时获得自动补全和类型检查功能。通常是通过从 'vite' 导入 `defineConfig` 来实现：

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

- 当然，还可以通过 IDE、jsdoc、satisfies等实现，但不是主流，不介绍


#### 1.2 条件配置

- 其实，如果不想给开发环境和线上环境分别制定配置文件，想使用同一个配置文件，可能会有些差别，这时就可以使用条件配置

```js
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // dev 独有配置
    }
  } else {
    // command === 'build'
    return {
      // build 独有配置
    }
  }
})
```

- 在 Vite 的 API 中，在开发环境下 `command` 的值为 `serve`，`mode` 默认为`development`；而在生产环境下 command 为 `build`，mode 默认为 `production`

    - 说 mode 是默认，是因为可以在命令行里覆盖它，所以上面代码用 command 判断更为准确
```bash
vite build --mode staging
```


- `isSsrBuild, isPreview`，可以不用，是对应 SSR，预览相关的配置


#### 1.3 异步配置

```js
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // vite 配置
  }
})
```

#### 1.4 在配置中使用环境变量

- 前面有说在 `.env` 文件中定义环境变量，但是不能在配置文件中通过 `import.meta.env` 直接访问文件中的环境变量

    - 原因是 vite.config.ts 运行在 Node 侧（Vite 启动/构建时先执行它），import.meta.env 是给前端源码用的，在“被 Vite 处理后”注入的。也就是在执行时机上，配置文件先执行

- 但是如果想在配置文件中访问，可以通过 `loadEnv(mode, process.cwd(), '')` 主动访问


```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      // 提供从 env var 派生的显式应用程序级常量。
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    // 例如：使用 env var 有条件地设置开发服务器端口。
    server: {
      port: env.APP_PORT ? Number(env.APP_PORT) : 5173,
    },
  }
})
```


### 二、共享选项

|配置参数         | 类型             | 默认值             | 备注   |
|----------------|-----------------|-------------------|-------------------|
| root  |  `string` |  `process.cwd()` | 指定项目根目录，index.html 文件所在位置  |
| base  | `string`  | `/`  | 开发或生产环境服务的公共基础路径  |
| mode  | `string`  | `development` 用于开发，`production` 用于构建  | 在配置中可以覆盖掉，也可以通过命令行 `--mode` 覆盖  |
| define  | `Record<string, any>`  |   | 定义全局常量替换方式，开发时会被定义在全局，构建时被静态替换，有点类似 `.env` 文件的全局变量  |
| plugins  | `(Plugin \| Plugin[] \| Promise<Plugin \| Plugin[]>)[]`  |   |   |
| publicDir  | `string \| false`  | `pubilc`  | 指定静态资源服务的文件夹，设置为 false 可以关闭此功能  |
| cacheDir  | `string`  | `node_modules/.vite`  | 存储缓存文件的目录  |
| resolve.alias  |   |   | 设置别名的，比如`@`，可以对象写法，也可以数组写法，一般对象  |
| css.modules  |   |   | 配置 CSS modules 的行为  |
| logLevel  | `'info' \| 'warn' \| 'error' \| 'silent'`  | `info`  | 调整控制台输出的级别  |
| envDir  | `string \| false`  | `root`  | 指定`.env`文件的目录，设置为 false 是禁用 .env 文件加载  |
| clearScreen  | `boolean`  | `true`  | 设置为 `false` 可以避免 Vite 清屏而错过在终端中打印某些关键信息。命令行模式下可以通过 `--clearScreen false` 设置  |

- `define` 实例，对于 TypeScript 开发者来说，要在 `vite-env.d.ts` 文件中添加类型声明

::: code-group
```js [vite.config.js]
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
    __API_URL__: 'window.__backend_api_url',
  },
})
```
```vue [app.vue]
<script setup lang="ts">
// 使用 window 对象方式访问（定义在 index.html 或通过后端注入）
const appVersion = (window as any).__APP_VERSION__ || 'v1.0.0'
const apiUrl = (window as any).__API_URL__ || 'http://localhost:3000'
</script>

<template>
  <div>App Version: {{ appVersion }}</div>
  <div>API URL: {{ apiUrl }}</div>
</template>
```
```ts [vite-env.d.ts]
/// <reference types="vite/client" />

// Vite 全局常量类型声明（对应 vite.config.ts 中的 define 配置）
declare const __APP_VERSION__: string
declare const __API_URL__: string
```
:::

### 三、服务器选项

```js
server: {
  host: 'localhost',
  port: 5173,
  strictPort: false,
  open: false,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',  // 后端服务地址
      changeOrigin: true,               // 修改请求头中的 Origin
      rewrite: (path) => path.replace(/^\/api/, ''),  // 路径重写
    },
  },
},
```

- `host`: 设置服务器应监听哪个IP地址，如果将此设置为 0.0.0.0 或者 true 将监听所有地址

- `port`: 指定开发服务器端口，如果端口被占用，Vite 会自定尝试下一个可用端口

- `strictPort`: 设置为 `true` 时，若端口被只能用，会直接退出，而不是尝试下一个端口

- `open`: 开发服务器启动时，自动在浏览器打开应用程序。可以接受字符串值，指定URL路径名

- `proxy`: 为开发服务器配置自定义代理规则。期望接收一个 `{ key: options }` 对象。其中 key 可以是正则表达式

::: tip
还有很多，可以官网了解，这些是简单够用的
:::


### 四、构建选项

```js
build: {
  target: 'modules',
  outDir: 'dist',
  assetsDir: 'assets',
  sourcemap: false,
  minify: 'esbuild',
  cssCodeSplit: true,
  emptyOutDir: true,
  reportCompressedSize: true,
  chunkSizeWarningLimit: 500,
},
```


### 五、预览选项

- 配置参数 `preview`，主要用于预览的配置。对应 `"preview": "vite preview"`，主要用于上线前的测试构建打包的产物

```js
preview: {
  host: 'localhost',
  port: 4173,
  strictPort: false,
  open: false,
},
```


### 六、依赖优化选项


- 配置参数 `optimizeDeps` ，主要用于依赖预构建，通常用 esbuild 在开发启动前把第三方包先处理一遍。主要解决两类问题

    - 提升开发启动速度（冷启动、首屏依赖扫描更快）

    - 兼容 CommonJS/UMD 依赖，让它们在 ESM 开发服务器里更稳定可用

::: tip
- 一般是用于本地开发使用，线上环境用不到

常见场景：

- 某些包在 dev 下报错（尤其 CJS 包）
- 启动慢，且某些大依赖反复被扫描
- Monorepo/本地 link 包导致依赖识别不稳定

常用项：

- optimizeDeps.include：强制预构建某些包
- optimizeDeps.exclude：排除某些包不预构建
- optimizeDeps.esbuildOptions：调整预构建行为
:::


### 七、SSR 选项

- 配置参数 `ssr`，主要用于服务端渲染（SSR）的配置。包括构建、依赖优化等 SSR 特定设置

- 在 SPA 项目中不需要


### 八、Worker 选项

- 配置参数 `worker`，主要用于 Web Worker 的配置。包括构建、格式等 Worker 特定设置



::: tip
- 上面说那多么配置项，其实在大多数项目里，都用不到，因为 Vite 是开箱即用的，预设配置已经足够覆盖大部分场景。

- 下面是一个新项目chu'j初始的 vite.config.ts 配置示例：

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
```
:::











