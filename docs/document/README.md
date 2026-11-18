# 插件与案例

这里收录前端构建插件、AI 工具、应用模板和交互组件。每个项目按自身的使用方式提供安装、配置和案例，先根据要解决的问题选择入口。

## 直接体验

下列页面上方提供可操作的演示，下面保留接入代码。浏览器能直接运行的组件使用真实依赖；涉及后端、命令行或桌面环境的案例会标明本地样例与预览范围。

| 页面 | 文档内可以体验的效果 |
| --- | --- |
| [big-data-tree](./big-data-tree.md#页内演示) | 节点展开、筛选、勾选、万条数据虚拟滚动和懒加载分页 |
| [国际化工具](./webpack-in-loader.md#页内演示) | 切换中英日文，修改姓名与任务数量，查看语言包 |
| [AI Agent](./ai-agent.md#页内演示) | 真实聊天界面、流式回复、停止和主题切换；使用本地示例回复 |
| [monitoring-tool](./monitoring-tool.md#页内演示) | 触发异常或业务事件，查看真实插件在本地采集的 JSON |
| [文章 MCP](./mcp-server-jue-article.md#页内演示) | 筛选固定文章与作者样例，查看工具请求和返回结构 |
| [GeoJSON 转换](./png-convert-geojson.md#页内演示) | 点击地图区域、修改配色、切换轮廓并查看预生成坐标 |
| [React-electron](./react-electron.md#页内演示) | 在浏览器操作真实 React 计数器；桌面窗口和打包需本机运行 |
| [heaven-cli](./cli.md#页内演示) | 选择模板与项目目录，预览创建命令和工程结构 |
| [Web3D Agent CLI](./web3d-agent-cli.md#页内演示) | 选择任务模式，预览命令和固定离线演示流程 |

## 工程与构建

| 项目 | 用途 | 案例与说明 |
| --- | --- | --- |
| [heaven-cli](./cli.md) | 使用 `heaven-cli-fe` 创建前端或全栈工程 | Vue、Vue Admin、Koa + React 工程初始化 |
| [webpack-in-loader](./webpack-in-loader.md) | 提取中文、维护翻译包，在构建时自动转换国际化文案 | Vue 2 / Vue 3、Webpack / Vite 接入和中英文欢迎页 |
| [useless-files-clean-plugin](./useless-files-clean-plugin.md) | 查询和清理 Webpack 工程中未使用的文件 | 扫描范围、排除项与清理配置 |
| [vite-plugin-vue2-jsx](./vite-plugin-vue2-jsx.md) | 为 Vue 2 Vite 工程提供 JSX 支持 | 插件接入配置 |
| [vite-plugin-image-require](./vite-plugin-image-require.md) | 处理 Vite 项目中的图片 `require` | 图片资源插件配置 |

## AI 与 MCP

| 项目 | 用途 | 案例与说明 |
| --- | --- | --- |
| [ai-agent](./ai-agent.md) | 在网页内嵌入 AI 聊天窗口 | React 生命周期接入、文章检索工具与后端协议 |
| [web3d-agent-cli](./web3d-agent-cli.md) | 在终端中完成 Web / 3D 项目的规划、检查和修改 | 离线检查、3D 场景修复和接口契约检查 |
| [mcp-server-jue-article](./mcp-server-jue-article.md) | 通过 MCP 检索惊觉社区文章并生成阅读链接 | stdio / HTTP 接入、搜索与文章链接工作流 |

`ai-agent` 是浏览器端聊天组件，需要配套 AI 后端；`web3d-agent-cli` 是独立命令行工具；文章 MCP 服务则由支持 MCP 的客户端调用。各页面分别说明连接条件。

## 应用与数据工具

| 项目 | 用途 | 案例与说明 |
| --- | --- | --- |
| [monitoring-tool](./monitoring-tool.md) | 收集浏览器端性能与异常数据 | 浏览器初始化、错误与业务事件采集 |
| [png-convert-GeoJSON](./png-convert-geojson.md) | 用 Python 从位图轮廓生成 GeoJSON | 依赖安装、`main.py` 转换与图片坐标说明 |
| [React-electron](./react-electron.md) | 基于 React 和 Electron 开发桌面应用 | 双终端开发、计数器示例和桌面打包 |

## 交互组件

- [calendar-selector 日历选择器](./calendar.md)
- [infinite-scroll-vue 无限滚动](./infinitescroll.md)
- [pull-refresh-vue 下拉刷新](./pullrefresh.md)
- [big-data-tree 大数据树](./big-data-tree.md)
