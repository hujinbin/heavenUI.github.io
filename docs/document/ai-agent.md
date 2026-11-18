# AI Agent 对话插件

`ai-agent-plugin` 为网站提供悬浮式 AI 文本助手，可用于 Vue、React、jQuery 和普通 JavaScript 页面。插件负责对话界面、消息请求、Markdown 展示和 MCP 资料查询，回答内容由接入的 AI 后端生成。

本文对应 `0.0.3` 版本。项目源码和更新记录见 [GitHub 仓库](https://github.com/hujinbin/ai-agent)。

## 页内演示

<ClientOnly>
<demos-AIAgent />
</ClientOnly>

## 功能

- 支持浅色、深色主题和四角悬浮定位，可调整标题、占位文字及主题颜色。
- 支持流式展示、停止生成，以及最近十轮完整对话的上下文。
- 展示后端返回的联网搜索来源，支持标题、列表、代码和表格等 Markdown 内容。
- 可连接 HTTP MCP 服务，发现并调用工具，将查询结果作为回答参考资料。
- 提供销毁方法，便于在单页应用组件卸载时清理界面和请求。

## 安装

```bash
npm install ai-agent-plugin
```

模块化项目直接导入构造函数。

```javascript
import AIAgent from 'ai-agent-plugin';

const agent = new AIAgent({
  host: 'https://your-ai-service.example.com',
  secret: 'YOUR_SITE_SESSION_TOKEN',
  title: '网站助手',
  stream: true
});
```

将示例域名和令牌替换为实际配置。`host` 填写 AI 后端基础地址，插件会拼接 `/api/ai/chat/stream` 等路径。显式配置远程 `host` 时需要 `secret`，请求通过 `Authorization: Bearer <secret>` 发送。

普通 HTML 页面可引入发布包中的 `dist/ai-agent.min.js`，在页面 DOM 就绪后通过 `new window.AIAgent(options)` 创建实例。构建产物已包含插件样式。

## 配置

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `host` | `string` | `https://monitor.leheavengame.com` | AI 后端基础地址，接入自己的服务时显式设置 |
| `secret` | `string` | — | 后端识别的客户端令牌，远程服务接入时传入 |
| `stream` | `boolean` | `false` | 是否逐片显示回答 |
| `model` | `string` | `agnes-3.0-flash` | 后端支持的模型 ID |
| `usingContext` | `boolean` | `true` | 携带最近十轮已完成的对话 |
| `search` | `boolean` | `true` | 允许后端按问题判断是否联网检索 |
| `theme` | `string` | `light` | `light` 或 `dark` |
| `position` | `string` | `bottom-right` | `bottom-right`、`bottom-left`、`top-right`、`top-left` |
| `title` | `string` | `AI 助手` | 悬浮按钮及面板标题 |
| `placeholder` | `string` | `请输入问题...` | 输入框占位文字 |
| `colors` | `object` | 随主题设置 | 可覆盖 `primary`、`background`、`text` 等颜色 |
| `mcpServers` | `array` | 未配置 | MCP 服务列表，每项包含唯一的 `id`、完整 `url`，可选 `name` 和 `token` |
| `mcp` | `boolean` | 随服务配置启用 | `false` 禁用 MCP，`true` 在缺少配置时也显示服务状态提示 |

`stream` 控制界面展示方式。开启上下文、联网、自定义模型或 MCP 时，插件通过流式接口获取数据，即使 `stream: false` 也需要后端支持 SSE。只有同时关闭流式展示、联网和上下文，使用默认模型且没有 MCP 时，才走普通 JSON 兼容入口。

## 案例一　React 页面接入客服助手

安装依赖后，在页面组件挂载时创建实例，并在卸载时清理。

```jsx
import { useEffect } from 'react';
import AIAgent from 'ai-agent-plugin';

export default function HelpPage({ sessionToken }) {
  useEffect(() => {
    if (!sessionToken) return;

    const agent = new AIAgent({
      host: 'https://your-ai-service.example.com',
      secret: sessionToken,
      title: '产品客服',
      placeholder: '请输入产品使用问题',
      position: 'bottom-right',
      theme: 'light',
      stream: true,
      usingContext: true,
      search: false,
      colors: { primary: '#3eaf7c' }
    });

    // 页面卸载时取消请求并清理插件界面
    return () => agent.destroy();
  }, [sessionToken]);

  return <main><h1>帮助中心</h1></main>;
}
```

`sessionToken` 由宿主网站的登录或会话接口提供。运行页面后，右下角出现“产品客服”按钮，点击后可发送问题。追问时会携带已完成的对话，生成过程中可点击“停止”。

Vue 2 项目可在 `mounted` 中创建实例，在 `beforeDestroy` 中调用 `destroy()`。Vue 3 可使用 `onMounted` 和 `onBeforeUnmount`。服务端渲染项目应在浏览器生命周期中加载并初始化插件。

## 案例二　接入文章 MCP 服务

将已部署的文章查询服务加入配置，用户可在助手中选择资料服务并提问。

```javascript
import AIAgent from 'ai-agent-plugin';

const agent = new AIAgent({
  host: 'https://your-ai-service.example.com',
  secret: 'YOUR_SITE_SESSION_TOKEN',
  title: '文章助手',
  stream: true,
  search: false,
  mcpServers: [
    {
      id: 'articles',
      name: '文章库',
      url: 'https://your-mcp-service.example.com/mcp',
      token: 'YOUR_READ_ONLY_CLIENT_TOKEN'
    }
  ]
});

agent.togglePanel();
```

首次打开面板会检查服务连接和可用工具。输入“查找 Vue 国际化相关文章，并总结接入步骤”后，插件根据问题选择查询工具，再把实际返回的文章内容交给 AI 生成回答。取得来源链接时，面板会显示可打开的资料来源。查询失败或没有返回内容时，界面会显示相应状态。

MCP 服务需要提供浏览器可访问的 HTTP 地址并允许网站跨域请求。HTTPS 网站使用 HTTPS 服务。浏览器配置中的令牌对用户可见，应采用适用于公开客户端的只读查询凭据。文章服务的部署方法见 [mcp-server-jue-article](./mcp-server-jue-article.md)。

## 后端协议

常规接入需要实现 `POST /api/ai/chat/stream`，请求示例如下。

```json
{
  "messages": [
    { "role": "user", "content": "如何配置国际化？" }
  ],
  "model": "agnes-3.0-flash",
  "search": false
}
```

响应使用 `Content-Type: text/event-stream`。常用事件包括 `message`、`stage`、`search`、`error` 和 `done`。

```text
event: message
data: {"content":"可以先生成语言包，再配置 loader。"}

event: done
data: {}

```

普通 JSON 兼容入口为 `POST /api/ai/chat/completion`，请求体为 `{"content":"问题"}`。响应顶层的 `code` 必须为 `200`，插件再从 `data.choices[0].message.content` 读取回复：

```json
{
  "code": 200,
  "data": {
    "choices": [
      { "message": { "content": "回复内容" } }
    ]
  }
}
```

后端需按照插件协议适配，并提供鉴权、模型调用和跨域配置。

## 实例方法

| 方法 | 说明 |
| --- | --- |
| `togglePanel()` | 切换面板显示状态 |
| `closePanel()` | 关闭面板 |
| `sendMessage(text)` | 发送文本消息 |
| `cancel()` | 停止当前回复，保留已收到的内容 |
| `destroy()` | 取消 AI 和 MCP 请求，清理 DOM 与事件 |

后续请求会使用已完成的对话历史。失败或停止的本轮仍显示在页面中。

## 本地预览

```bash
git clone https://github.com/hujinbin/ai-agent.git
cd ai-agent
npm install
npm run serve
```

开发预览地址为 `http://localhost:9000/`。`npm run build` 生成 UMD、压缩 UMD 和 ESM 文件。预览中的实际问答仍需要可用的 AI 后端与对应令牌。
