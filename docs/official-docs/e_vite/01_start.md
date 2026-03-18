

### 一、总览

*   Vite 是一种新型前端构建工具，提供了极速的开发服务器和优化的构建功能。它由两部分组成：

    *   一个**开发服务器**，它基于原生 ES 模块提供了丰富的内建功能，如快速热模块替换（HMR）。

    *   一套构建指令，它使用 **Rollup** 打包你的代码，并且是预配置的（配置内置好了，不需要自己写一堆），可以输出高度优化的静态资源。

### 二、搭建第一个 vite 项目

```bash
npm create vite@latest
yarn create vite
pnpm create vite
```

*   这个和 vue3 的搭建挺像的，但是 vite 项目不只是搭建 vue3，还可以搭建 React、Svelte 等其他框架的项目。

### 三、手动安装

*   上面说了，vite 是一个开发服务器，所以只要安装了 vite 命令行工具，跟目录在创建一个 html 文件，可以直接 `npx vite` 执行这个 html 文件

```bash
npm install -D vite
```

*   在一个 vite 项目中，`index.html` 文件就是入口文件，可以直接通过 `npx vite` 启动开发服务器。

### 四、命令行接口

*   在 vite 项目中，可以在 `npm scripts` 中使用 vite 可执行文件

```json
{
  "scripts": {
    "dev": "vite", // 启动开发服务器，别名：`vite dev`，`vite serve`
    "build": "vite build", // 为生产环境构建产物
    "preview": "vite preview" // 本地预览生产构建产物
  }
}
```

### 五、为什么选 Vite

*   **极快的服务器启动**：利用浏览器原生 ES 模块支持，无需打包，按需编译，启动速度极快。

*   **高效的热更新（HMR）**：基于 ES 模块，只重新编译变更的模块，保持应用状态，更新迅速。

*   **开箱即用的丰富功能**：内置对 TypeScript、JSX、CSS 等的支持，无需额外配置。

*   **优化的构建输出**：生产环境使用 Rollup 打包，输出高度优化的静态资源，支持代码分割等。

*   **灵活的插件 API**：扩展性强，可通过插件集成各种工具和框架。

![alt text转存失败，建议直接上传图片文件](<转存失败，建议直接上传图片文件 ../images/e_1_1.png>)
