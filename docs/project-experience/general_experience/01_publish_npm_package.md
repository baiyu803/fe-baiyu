
### 一、先确认当前的 npm 仓库地址


- 在终端使用命令 `npm config get registry`，获取 npm 源地址

- 公网 npm 是 `https://registry.npmjs.org/`

- 一般公司会使用私有 npm 源，比如 `https://npm.xxx.com/`

- 如果当前是公网，需要在公司自己的 npm 源发包，需要先设置 npm 源为公司自己的 npm 源

```bash
npm config set registry https://npm.xxx.com/
```

### 二、登录 npm 仓库

- 首先可以通过 `npm whoami` 查看是否已经登录

    - 如果是公司 npm 源，可以通过 `npm whoami --registry=https://npm.xxx.com/` 查看，但是一般设置公司源后，直接使用 `npm whoami` 查看也可以查看

    - 如果已经登录，会输出用户名，类似 “zhangsan”

    - 如果没有登录，会报错，类似 `npm ERR! code ENEEDAUTH`、`npm ERR! need auth`

- 如果没有登录，可以通过 `npm login` 登录 npm 仓库

    - 如果是公司 npm 源，可以通过 `npm login --registry=https://npm.xxx.com/` 登录公司 npm 源

    - 但其实在设置公司源后，直接使用 `npm login` 登录也可以登录公司 npm 源

- 如果没有账号，需要先注册 npm 账号，然后登录

::: tip
注册账号时，用户名可以简洁且有代表性，因为后面用 `npm login` 在终端登录时需要输入用户名
:::


### 三、发布 npm 包

#### 3.1 发布前准备

- 发布前需要进入项目目录，确认目录下有以下文件

```txt
package.json
src/
dist/
```

- 也就是说，在发布前需要先打包项目，打包后会在 `dist/ 目录下生成对应的文件

    - 这个是否打包看项目怎么写的，其实也可以不打包，直接发布 `src/ 目录下的文件

- 除此外，还要检查 `package.json` 文件，重点看下面几个字段

```json
{
  "name": "@company/my-utils",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "publishConfig": {
    "registry": "https://npm.xxx.com/"
  }
}
```

- `name` 和 `version` 是必填项，`name` 是包的名称，`version` 是包的版本号，每次发布时需要变更版本号

    - npm 官方说明，`name` 和 `version` 一起构成包的唯一标识

- `main` 是包的入口文件，`types` 是包的类型文件，`files` 是要发布的的文件

    - 这三个字段是可选的，默认值是 `["index.js", "index.d.ts"]`

- `publishConfig` 标识强制发布到指定的源，比如公司自己的 npm 源，这个字段也是可选的

::: tip
有些时候也可以使用 `npm pack --dry-run` 命令来检测最终发布的包内容
:::


#### 3.2 发布

- 直接执行 `npm publish` 即可发布

    - 也可以手动指定公司源发布，比如 `npm publish --registry=https://npm.xxx.com/`




