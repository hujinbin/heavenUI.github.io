### heaven-UI 使用文档
vuepress搭建的heaven-UI库文档


网址： https://ui.leheavengame.com/

## 插件与案例

文档入口：`docs/document/README.md`，站内路由为 `/document/`。

- 工程与构建：heaven-cli、webpack-in-loader 及 Vite / Webpack 插件。
- AI 与 MCP：ai-agent、web3d-agent-cli、mcp-server-jue-article。
- 应用与数据工具：monitoring-tool、png-convert-GeoJSON、React-electron。
- 交互组件：日历选择器、无限滚动、下拉刷新和大数据树。

新增案例可在文档页面上方直接交互，下方提供接入代码。命令行、MCP 和桌面工具会说明浏览器预览的范围。


## Install
```shell
npm install
```

## Quick Start
``` shell
npm run dev
```

## Build
``` shell
npm run build
```

当前站点使用 VuePress 1 / Webpack 4。`dev` 和 `build` 脚本已为 VuePress 进程启用 OpenSSL 兼容参数，可直接在 Node.js 24 下运行上述命令。
