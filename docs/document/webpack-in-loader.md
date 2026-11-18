# webpack-in-loader 国际化工具

保留业务代码中的中文，在构建时转换为 `vue-i18n` 调用，并通过 CLI 提取、翻译和维护语言包。适用于已有中文页面的 Vue 项目，也能处理 `.js`、`.jsx`、`.ts`、`.tsx` 中的文案。

仓库名称为 `webpack-i18n-loader`，**npm 安装名称为 `webpack-in-loader`**。本文按仓库 `2.0.0` 的实现说明，Vite 入口从该版本开始提供。

- [源码与 README](https://github.com/hujinbin/webpack-i18n-loader)
- [版本记录](https://github.com/hujinbin/webpack-i18n-loader/blob/master/CHANGELOG.md)

## 页内演示

切换语言即可直接查看文案变化，也可以修改动态参数。演示使用 Vue I18n 8 运行时；源码提取、构建替换和 AI 翻译按下文在业务项目中执行。

<ClientOnly>
  <demos-I18n />
</ClientOnly>

## 工作流程

1. 在页面和脚本中直接编写中文。
2. 执行 `i18n generate`，生成以中文内容的 16 位 MD5 为键的语言包。
3. 人工翻译，或配置翻译服务生成目标语言包。
4. 注册 `vue-i18n`，通过 Webpack loader 或 Vite 插件在构建时替换中文。

提取不会改写源代码，构建转换只处理已收录在中文语言包中的文案。因此增加、修改中文后需要重新提取。

## 安装

```bash
npm install --save-dev webpack-in-loader
```

根据项目选择运行时依赖，以下版本与仓库 Webpack 示例一致：

```bash
# Vue 2 项目
npm install vue-i18n@8

# Vue 3 项目
npm install vue-i18n@9
```

## CLI 命令

在业务项目根目录执行：

| 命令 | 作用 |
| --- | --- |
| `npx i18n init` | 创建 `i18n-config.js`，已有文件会被覆盖，只需首次执行 |
| `npx i18n generate` | 扫描 `src`，生成或合并 `src/locale/zh.js` |
| `npx i18n generate src/pages -p src/locale -f zh` | 指定扫描目录、语言包目录和文件名，不要给 `-f` 添加 `.js` |
| `npx i18n translate en` | 翻译原文，除 `en` 外还会处理配置中的 `distLangs` |
| `npx i18n transform` | 将人工修改后的 `*.js.map` 对照表导入对应译文语言包 |
| `npx i18n clear src` | 重新扫描源码并清理不再使用的语言包条目 |
| `npx i18n generate --help` | 查看提取命令参数 |

`generate` 的 `-p`、`-f` 参数独立于配置文件；更换目录或文件名时，还需同步调整翻译配置和构建工具配置。语言包应放在独立目录，避免参与业务文案扫描。

`translate` 也声明了 `-f` 参数，但当前实现读取的原文仍由 `config.file` 决定，`-f` 影响输出命名。选择原文文件请修改配置中的 `file`。

## 翻译配置

首次执行 `npx i18n init` 后，编辑根目录的 `i18n-config.js`。这是 CommonJS 配置文件，不是 JSON。

### 百度翻译

```js
module.exports = {
  dir: './src/locale/', // 目录末尾保留斜杠
  file: 'zh.js',
  distLangs: ['en'],
  open: true,
  mode: 'Baidu',
  appId: 'YOUR_BAIDU_APP_ID',
  secret: 'YOUR_BAIDU_SECRET',
  singleNum: 1500
};
```

目标语言使用[百度翻译的语言代码](https://fanyi-api.baidu.com/product/113)。`singleNum` 控制单次请求文本长度，代码限制在 `600` 至 `3900`，未配置时为 `1500`，初始化模板填入的是 `3000`。

### AI 翻译

```js
module.exports = {
  dir: './src/locale/',
  file: 'zh.js',
  distLangs: ['en'],
  open: true,
  mode: 'AI',
  aiKey: 'YOUR_AI_API_KEY',
  aiModel: 'YOUR_AVAILABLE_MODEL',
  aiBaseUrl: ''
};
```

| 字段 | 说明 |
| --- | --- |
| `mode` | 默认 `Baidu`；使用 `AI` 或 `chatGPT` 进入 AI 翻译分支 |
| `aiKey` | AI 服务密钥，优先于旧字段 `openAiKey` |
| `openAiKey` | 兼容旧版 AI 密钥配置 |
| `aiModel` | 账户可用的聊天模型；不填时代码默认 `gpt-3.5-turbo`，需确认服务商仍提供该模型 |
| `aiBaseUrl` | 自定义服务地址字段；当前版本存在下述适配限制 |
| `open` | `false` 时仅关闭非生产环境的构建转换；生产环境仍执行转换，也不控制 CLI 翻译 |

当前 `2.0.0` 的翻译代码将 `aiBaseUrl` 作为 `baseURL` 传给 `openai@3` 的 `Configuration`，而该 SDK 使用 `basePath`。接入第三方兼容服务前，需要确认所用版本已修正这处适配；上面的示例使用默认服务地址。模型名称应填写账户实际可用值。

配置和语言包由 CLI 在 Node 环境读取。Vite 的配置解析只支持 `module.exports = { ... }` 对象形式，建议将翻译配置保留为简单对象，密钥不要随业务代码发布。

## Webpack 接入

将以下规则合并到项目现有的 `module.rules`，保留原有 Vue loader 插件和 Babel 配置。Webpack 的 `use` 从右向左执行，`webpack-in-loader` 放在数组末尾，先于 `vue-loader`、`babel-loader` 处理源码。

```js
const path = require('path');

const sourceDir = path.resolve(__dirname, 'src');
const localeFile = path.resolve(sourceDir, 'locale/zh.js');

module.exports = {
  resolve: {
    alias: { '@': sourceDir }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        include: sourceDir,
        use: [
          'vue-loader',
          { loader: 'webpack-in-loader', options: { localeFile } }
        ]
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: sourceDir,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          { loader: 'webpack-in-loader', options: { localeFile } }
        ]
      }
    ]
  }
};
```

如果已有相同文件类型的规则，直接补入 loader，避免重复处理。TypeScript 项目继续使用自己的 TS 转译配置。

## Vite 接入

CLI 生成的语言包使用 CommonJS，需要按仓库示例加入 CommonJS 转换插件：

```bash
npm install --save-dev vite-plugin-commonjs
```

当前版本的 `transform`、`clear` 仍使用 `require()` 读取 `.js` 配置和语言包，与项目根目录的 `"type": "module"` 不兼容。需要完整使用这两个维护命令时，采用默认 CommonJS 包类型，Vite 配置单独使用下面的 `.mjs` 文件。已有 ESM 项目不要仅为运行命令改动整个工程的模块类型，应先确认所用版本已修正 CLI 加载方式；单独把配置改名 `.cjs` 无效，因为 CLI 固定查找 `i18n-config.js`。

`vite.config.mjs`：

```js
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import commonjs from 'vite-plugin-commonjs';
import { vitePluginI18n } from 'webpack-in-loader/vite';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  plugins: [vitePluginI18n(), vue(), commonjs()]
});
```

Vue 2 项目替换为自身所用的 Vue 2 Vite 插件。国际化插件使用 `enforce: 'pre'` 处理原始文件，自动排除 `node_modules` 和语言包目录，并在语言包变化时刷新相关 Vue 模块。

Vite 从 `i18n-config.js` 的 `dir` 和 `file` 读取中文包。虽然类型声明列出了 `localeFile` 选项，当前 `vite.mjs` 没有使用该选项，不要照搬 Webpack 的传参方式。

## 注册 vue-i18n

脚本转换会注入 `import i18n from '@/i18n'`，因此必须提供该模块的默认导出，并让 `@` 指向 `src`。先完成语言包生成和翻译，再启动构建。

### Vue 2

`src/i18n.js`：

```js
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zh from './locale/zh.js';
import en from './locale/en.js';

Vue.use(VueI18n);

export default new VueI18n({
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: { zh, en }
});
```

在 `src/main.js` 中将实例传给根组件：

```js
import Vue from 'vue';
import i18n from './i18n';
import App from './App.vue';

new Vue({ i18n, render: h => h(App) }).$mount('#app');
```

### Vue 3

`src/i18n.js`：

```js
import { createI18n } from 'vue-i18n';
import zh from './locale/zh.js';
import en from './locale/en.js';

export default createI18n({
  legacy: true,
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: { zh, en }
});
```

`src/main.js`：

```js
import { createApp } from 'vue';
import i18n from './i18n';
import App from './App.vue';

createApp(App).use(i18n).mount('#app');
```

这里使用与仓库 Webpack 示例一致的 Vue I18n 9 Legacy 模式。若改用 Composition 模式，需要同步调整语言切换方式，并验证自动注入的 `i18n.global.t` 与现有代码兼容。

## 案例：给中文欢迎页增加英文

在已配置好上述构建插件的 Vue 3 项目中，创建 `src/App.vue`：

```vue
<template>
  <main>
    <h1>你好，世界</h1>
    <button @click="switchLanguage">English / 中文</button>
  </main>
</template>

<script>
import i18n from '@/i18n';

export default {
  methods: {
    switchLanguage() {
      i18n.global.locale = i18n.global.locale === 'zh' ? 'en' : 'zh';
    }
  }
};
</script>
```

执行提取：

```bash
npx i18n generate
```

`src/locale/zh.js` 中会生成如下条目。按钮中的中文也会被提取，以实际输出为准。

```js
module.exports = {
  a018615b35588a01: '你好，世界'
};
```

复制中文包为 `en.js`，保持全部键不变，将值翻译为英文；也可配置服务后执行 `npx i18n translate en`。其中欢迎语对应：

```js
module.exports = {
  a018615b35588a01: 'Hello, world'
};
```

启动业务项目后，标题默认显示“你好，世界”，点击按钮切换为“Hello, world”。模板中的中文会在构建时转换为对应 `$t` 调用，源文件仍保留中文。

## 人工校对与忽略文案

自动翻译会生成 `en.js` 和 `en.js.map`。后者是“中文 → 译文”的 JSON 对照表，修改后执行：

```bash
npx i18n transform
```

不需要国际化的片段可以使用成对标记：

```js
// <i18n-ignore
const internalName = '固定内部名称';
// i18n-ignore>
```

```html
<!-- <i18n-ignore -->
<div>固定展示名称</div>
<!-- i18n-ignore> -->
```

动态文案优先使用模板字符串，例如 `` `你好，${name}` ``，工具会生成 `{0}` 形式的占位符。自动处理基于文本规则，复杂嵌套、特殊模板和新增语法应检查构建结果；扫描到 TS/JSX 文件并不代表同时提供类型检查或 JSX 转译。

清理无效条目前先保存语言包，并检查命令执行后的差异。当前 `clear` 用绝对文件路径匹配相对 `dir`，默认配置下可能把语言包自身也作为业务源码扫描，导致旧条目没有清掉。如果全部业务源码集中在不含语言包的目录，可以改用 `npx i18n clear src/pages`；扫描范围必须覆盖全部文案使用点，避免删掉其他目录仍在使用的条目。否则需先修正所用版本的目录排除逻辑。

修改配置后重启开发服务，避免旧配置缓存继续生效。

## 仓库案例

| 示例 | 内容 |
| --- | --- |
| [examples/vue2](https://github.com/hujinbin/webpack-i18n-loader/tree/master/examples/vue2) | Vue 2 + Webpack |
| [examples/vue3](https://github.com/hujinbin/webpack-i18n-loader/tree/master/examples/vue3) | Vue 3 + Webpack |
| [examples/vite-vue2](https://github.com/hujinbin/webpack-i18n-loader/tree/master/examples/vite-vue2) | Vue 2 + Vite |
| [examples/vite-vue3](https://github.com/hujinbin/webpack-i18n-loader/tree/master/examples/vite-vue3) | Vue 3 + Vite，包含 CommonJS 语言包转换配置 |
