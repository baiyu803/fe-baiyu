
::: info
只简单记录几个我觉得比较有用的特性
:::


### 一、CSS Modules

- 任何以 `.module.css` 结尾的文件都被视为 CSS Modules 文件。导入这样的文件会返回一个相应的模块对象，其中键是类名，值是生成的唯一类名

- 比如： 

::: code-group
```css [example.module.css]
.red {
  color: red;
}
.apply-color {
    color: blue;
}
```
```vue [app.vue]
<script setup lang="ts">
import classes from './css/example.module.css'
</script>

<template>
  <div :class="classes.red">测试 CSS Moudle</div>
</template>
```
:::

- 这样使用，div 标签会获得一个唯一的类名，实现 CSS 的模块化作用域，避免样式冲突。如下：

```xml
<div class="_red_fa3rh_1">测试 CSS Moudle</div>
```

- 除了上面的写法外，也可以这样写

```vue
<script setup lang="ts">
import { applyColor } from './css/example.module.css'
</script>

<template>
  <div :class="applyColor">测试 CSS Moudle</div>
  <!-- 等价于 <div class="_apply-color_1otgo_7">测试 CSS Moudle</div> -->
</template>
```
- 但是这种带有连字符的类名，需要开启 camelCase 格式变量名转换

```js [vite.config.js]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
})
```


### 二、静态资源处理

- Vite 内置了对静态资源的处理，可以通过 `import` 或 `?url`、`?raw` 等查询参数来引用资源

- 例如：

```js
  import imgUrl from './img.png' // 默认导入会返回解析后的 URL
  import rawSvg from './logo.svg?raw' // 以字符串形式导入
  import worker from './worker.js?worker' // 作为 Web Worker 导入
```

- 资源小于 `assetsInlineLimit` 选项值（默认 4KB）时会被内联为 base64，否则会被复制到输出目录

- 可以通过 `public` 目录存放无需处理的静态资源，这些资源会被直接复制到输出目录的根目录


- 重点讲下导入一个静态资源会返回解析后的 URL

```vue
<script setup lang="ts">
import imgUrl from './assets/3.png';
</script>

<template>
  <div>{{ imgUrl }}</div>
  <!-- 等价于 <div>/src/assets/3.png</div> -->
  <img :src="imgUrl" alt="">
</template>
```


### 三、环境变量和模式

#### 3.1 内置常量

- Vite 在特殊的 `import.meta.env` 对象下暴露一些常量，这些常量在开发阶段被定义为**全局变量**，并在构建阶段被**静态替换**（直接转换为对应的字符串值）

- 默认情况下，提供了以下内建变量：

    - `import.meta.env.MODE`: {string} 应用运行的模式

    - `import.meta.env.BASE_URL`: {string} 部署应用时的基本 URL
    - `import.meta.env.PROD`: {boolean} 应用是否运行在生产环境
    - `import.meta.env.DEV`: {boolean} 应用是否运行在开发环境
    - `import.meta.env.SSR`: {boolean} 应用是否运行在服务器

```js
// 这是新建一个 vite 项目后，在开发模式下访问 import.meta.env 得到的对象内容：
{ "BASE_URL": "/", "DEV": true, "MODE": "development", "PROD": false, "SSR": false }
```

#### 3.2 环境变量

- 可以通过 `.env` 文件来定义额外的环境变量。以 `VITE_` 开头的变量会被 Vite 暴露给客户端：

```env
VITE_SOME_KEY=123
VITE_SOME_SHOW=false

DB_PASSWORD=foobar
```

- 然后在代码中可以通过 `import.meta.env.VITE_SOME_KEY` 访问

```js
// 输出完整的 import.meta.env
{ "BASE_URL": "/", "DEV": true, "MODE": "development", "PROD": false, "SSR": false, "VITE_SOME_KEY": "123", "VITE_SOME_SHOW": "false" }
```

::: tip
注意，VITE_SOME_KEY 一开始设置的是数字，但是解析时会返回一个字符串，布尔类型的环境变量也是这样
:::

- `.env` 文件可以有不同的环境版本，例如：

    - `.env`：所有模式下都会加载

    - `.env.local`：所有模式下都会加载，但会被 git 忽略
    - `.env.[mode]`：只在指定模式下加载
    - `.env.[mode].local`：只在指定模式下加载，但会被 git 忽略

::: tip
一个文件中的环境变量声明从最高优先级到最低优先级如下：

1. `.env.[mode].local`
2. `.env.[mode]`
3. `.env.local`
4. `.env`
:::


#### 3.3 TypeScript 智能提示

- 在 `src` 目录下创建一个 `env.d.ts` 文件，为环境变量提供 TypeScript 智能提示：

```ts
interface ViteTypeOptions {
  // 添加这行代码，你就可以将 ImportMetaEnv 的类型设为严格模式，
  // 这样就不允许有未知的键值了。
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

#### 3.4 HTML 环境变量替换

- Vite 支持在 HTML 文件中替换环境变量，通过在 HTML 中使用 `%ENV_NAME%` 的语法。例如：

```xml
<h1>Vite is running in %MODE%</h1>
<p>Using data from %VITE_API_URL%</p>
```

- 如果环境变量在 import.meta.env 中不存在，比如不存在的 %NON_EXISTENT%，则会将被忽略而不被替换


#### 3.5 模式

- Vite 使用**模式**来区分不同环境（开发、生产、测试等），默认情况下，开发服务器 (`dev` 命令) 运行在 `development` (开发) 模式，而 `build` 命令则运行在 `production` (生产) 模式

- 也可以通过 `--mode` 选项来指定模式：

```bash
vite build --mode staging
```

- 对应的环境变量文件可以是 `.env.staging`


- 由于 vite build 默认运行生产模式构建，你也可以通过使用不同的模式和对应的 .env 文件配置来改变它，用以运行开发模式的构建

```.env.testing
NODE_ENV=development
```

#### 3.6 NODE_ENV 和模式

- 在 Vite 中，模式（mode）和 `NODE_ENV` 是两个相关但不同的概念：

  - **模式**：用于确定使用哪个环境变量文件（如 `.env.production`, `.env.development`）

  - **`NODE_ENV`**：Node.js 环境变量，通常用于判断当前是开发还是生产环境
  
- 默认情况下：

  - 开发模式 (`vite dev`) 会自动设置 `NODE_ENV='development'`

  - 生产模式 (`vite build`) 会自动设置 `NODE_ENV='production'`
  
- 你可以通过自定义模式来覆盖默认的 `NODE_ENV` 行为：

```bash
vite build --mode staging
```
- 此时会使用 `.env.staging` 文件，且默认不会自动设置 `NODE_ENV`，你需要在 `.env.staging` 中显式定义：
```env
  NODE_ENV=production
  # 或其他你需要的值
```

::: tip
NODE_DEV 可以在命令中设置，也可以在 .env 文件中设置

```bash
NODE_ENV=development vite build
```
:::














