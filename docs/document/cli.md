# heaven-cli-fe

heaven-cli-fe 是用于下载前端工程模板的命令行工具，支持 Vue、Koa 与 React 等项目骨架。npm 包名为 `heaven-cli-fe`，安装后通过 `heaven` 命令创建项目。

[源码仓库](https://github.com/hujinbin/heaven-cli)

## 页内演示

<ClientOnly>
  <demos-CliPreview variant="heaven" />
</ClientOnly>

## 安装与使用

先安装 Node.js、npm，并确认能够访问 GitHub 模板仓库。

```bash
npm install -g heaven-cli-fe
heaven --version
heaven --help
```

创建项目时，将模板名称与目标目录名称作为两个参数传入。

```bash
heaven init vue my-project
```

按提示填写项目名称与描述。项目名称留空时使用命令中的 `my-project`，填写新名称时则使用新名称作为下载目录。

模板下载后进入工程，安装依赖，再按该模板的 `package.json` 和 README 启动。

```bash
cd my-project
npm install
npm run
```

`npm run` 用于查看当前模板提供的脚本。各模板的开发、构建命令由模板自身维护。

## 命令说明

| 命令 | 用途 |
| --- | --- |
| `heaven --version` | 查看脚手架版本 |
| `heaven --help` | 查看命令列表 |
| `heaven init --help` | 查看项目初始化命令的帮助 |
| `heaven init <template> <app-name>` | 下载指定模板到项目目录 |

帮助中还列出了 `--clone` 与 `--offline`。当前仓库的命令处理逻辑仅将模板名称、项目名称传入初始化函数，使用时应以默认的在线下载流程为准。

## 模板列表

| 模板名称 | 用途 | 模板仓库 | 状态 |
| --- | --- | --- | --- |
| `vue` | 基于 Vue CLI、Webpack 5.28 的前端工程 | [vue-cli](https://github.com/hujinbin/vue-cli) | 已列入脚手架模板 |
| `vue-seo` | 构建静态 HTML 并跳转到真实页面，用于 SEO 场景 | [vue-seo-cli](https://github.com/hujinbin/vue-seo-cli) | README 标注开发中 |
| `koa-react` | Koa + React SSR 工程，提供 MySQL、MongoDB 相关集成 | [koa-react-cli](https://github.com/hujinbin/koa-react-cli) | 已列入脚手架模板 |
| `koa-vue` | MVC 结构的 Koa + Vue 单页面应用工程 | [koa-vue-cli](https://github.com/hujinbin/koa-vue-cli) | 已列入脚手架模板 |
| `microservice` | 基于 Vite 的微前端工程 | [microservice](https://github.com/hujinbin/microservice) | README 标注开发中 |
| `vue-admin` | Vite + Vue 3 + TypeScript 后台管理模板，包含 ESLint | [vue-admin](https://github.com/hujinbin/vue-admin) | README 标注开发中 |

模板标识需要与表中的名称一致。模板依赖、启动方式及运行条件以各模板仓库为准。

## 使用案例

### 创建 Vue 前端工程

```bash
heaven init vue customer-web
cd customer-web
npm install
npm run dev
```

适合从已有 Vue 工程配置开始搭建页面。模板通过 `npm run dev` 启动 Webpack 开发服务器，通过 `npm run build` 生成构建产物。初始化后先检查模板的依赖版本、入口文件与脚本，再添加业务组件。

### 创建 Koa + React SSR 工程

```bash
heaven init koa-react content-site
cd content-site
npm install
npm run dev
```

适合需要服务端渲染的内容站点。模板的 `dev` 脚本通过 nodemon 启动 `server/server.dev.js`，`server` 脚本执行构建后启动服务。数据库连接、服务端口需要按 `koa-react-cli` 模板说明配置。

### 体验 Vue 3 后台模板

```bash
heaven init vue-admin admin-demo
```

`vue-admin` 仍标注为开发中，适合先检查模板结构与依赖，再作为后台工程的起点。

## 初始化问题处理

### 目标目录已经存在

使用尚未存在的项目目录名称。当前实现检测到同名目录后仍会继续调用下载函数，需要避免向已有业务工程目录执行初始化。

### 模板下载失败

检查模板名称、GitHub 网络连接及模板仓库分支。也可以直接克隆对应的模板仓库，以 Vue 模板为例。

```bash
git clone --branch main https://github.com/hujinbin/vue-cli.git customer-web
cd customer-web
npm install
npm run
```

直接克隆后，在生成工程的 `package.json` 中自行设置项目名称与描述。

### 下载后出现文件路径类型错误

当前仓库 `lib/init.js` 更新项目元信息时，将 `package.json` 的内容对象传给了 `fs.writeFileSync` 的文件路径参数。若所安装版本包含相同实现，模板下载完成后可能出现路径参数类型错误。

此时检查项目目录是否已包含模板文件与有效的 `package.json`，确认后手动修改其中的 `name`、`description` 并继续安装依赖。也可按上一节直接克隆模板。

## 相关文档

- [heaven-cli 使用说明](https://github.com/hujinbin/heaven-cli#readme)
- [模板映射配置](https://github.com/hujinbin/heaven-cli/blob/main/lib/template/index.js)
- [命令定义](https://github.com/hujinbin/heaven-cli/blob/main/bin/heaven.js)
- [初始化实现](https://github.com/hujinbin/heaven-cli/blob/main/lib/init.js)

<InArticleAdsense
    style="display:block; text-align:center;"
    data-full-width-responsive="true"
    data-ad-format='auto'
    data-ad-client="ca-pub-7979174285252748"
    data-ad-slot="2903739942">
</InArticleAdsense>
