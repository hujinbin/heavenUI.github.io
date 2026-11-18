# mcp-server-jue-article

基于 Model Context Protocol 的惊觉社区知识库服务，为 AI 客户端提供文章检索、作者查询、标签统计和互动分析。客户端发现工具后，可以按用户的问题查询文章，再根据结果中的文章地址打开原文。

项目使用 Node.js ES Modules，支持 stdio 和 Streamable HTTP 两种连接方式。[源码仓库](https://github.com/hujinbin/mcp-server-jue-article)

## 页内演示

<ClientOnly>
<demos-ArticleMcp />
</ClientOnly>

## 安装

需要 Node.js 20 及以上版本。在本地拉取仓库并安装依赖。

```bash
git clone https://github.com/hujinbin/mcp-server-jue-article.git
cd mcp-server-jue-article
npm install
```

## 接入桌面 MCP 客户端

支持 stdio 的客户端可以直接启动 `index.js`。将下面配置合并到客户端的 MCP 配置中，把路径改为实际安装位置。

```json
{
  "mcpServers": {
    "jue-knowledge-base": {
      "command": "node",
      "args": ["E:/tools/mcp-server-jue-article/index.js"],
      "env": {
        "MCP_TRANSPORT": "stdio"
      }
    }
  }
}
```

保存配置并重启客户端后，检查是否出现下方工具。此方式由客户端管理服务进程。单独调试时可在项目根目录运行 `npm start`，未设置 `MCP_TRANSPORT` 时默认使用 stdio，`npm run dev` 使用 nodemon 自动重启。

## 接入网站的 HTTP 模式

在项目根目录创建 `.env`，按实际环境填写。

```text
MCP_TRANSPORT=http
MCP_HOST=127.0.0.1
MCP_PORT=3101
MCP_AUTH_TOKEN=replace-with-a-long-random-token
MCP_ALLOWED_ORIGINS=https://your-site.example.com
JUE_API_BASE_URL=https://jue.leheavengame.com/api
JUE_SITE_URL=https://jue.leheavengame.com
```

```bash
npm start
```

服务监听 `http://127.0.0.1:3101/mcp`。网站通过 HTTPS 反向代理地址连接，调用时携带 `Authorization: Bearer <MCP_AUTH_TOKEN>`，并将网站自身来源加入 `MCP_ALLOWED_ORIGINS`。多个来源用英文逗号分隔，填写协议、域名和可选端口。

| 配置 | 用途 | 默认值 |
| --- | --- | --- |
| `MCP_TRANSPORT` | 设置为 `http` 启动 HTTP 服务 | stdio |
| `MCP_HOST` | 本地 HTTP 监听地址 | `127.0.0.1` |
| `MCP_PORT` | 本地 HTTP 端口 | `3101` |
| `MCP_AUTH_TOKEN` | HTTP Bearer 查询令牌，HTTP 模式必填 | 空 |
| `MCP_ALLOWED_ORIGINS` | 允许浏览器访问的网站来源 | 空 |
| `JUE_API_BASE_URL` | 文章查询 API 根地址 | `https://jue.leheavengame.com/api` |
| `JUE_SITE_URL` | 文章与作者主页的跳转站点 | `https://jue.leheavengame.com` |
| `MCP_SERVER_NAME` | 客户端显示的服务名称 | `jue-knowledge-base` |
| `MCP_SERVER_VERSION` | 服务版本 | `1.0.0` |

浏览器里的查询令牌对访问者可见，应为文章查询配置专用凭据。HTTP 服务使用无状态请求，每次请求独立创建 MCP 实例。

仓库同时提供 `api/mcp.js` 和 `vercel.json`，可将 `/mcp` 部署为 Vercel 函数。函数部署时配置令牌、允许来源、API 与站点地址，平台负责请求监听。

## 工具说明

| 工具 | 主要参数 | 作用 |
| --- | --- | --- |
| `list_authors` | `keyword?`、`page=1`、`limit=20` | 返回推荐作者或昵称搜索样本及主页，每次最多 20 位 |
| `search_articles_by_author` | `author`、`page=1`、`limit=20`、`sortBy=latest` | 根据昵称或用户 ID 查文章，可按 `latest`、`popular`、`views` 排序 |
| `get_top_articles_by_views` | `limit=10`、`tagId?`、`timeRange=all` | 对返回样本按阅读量排序，时间支持 `all`、`today`、`week`、`month`、`year` |
| `search_articles_by_keyword` | `keyword`、`searchIn=both`、`page=1`、`limit=20` | 搜索文章，范围支持 `title`、`description`、`both` |
| `get_user_stats` | `userId` | 查询指定用户的文章、阅读、点赞和关注统计 |
| `get_trending_tags` | `limit=10`、`sortBy=count` | 查看标签，排序支持 `count`、`recent` |
| `analyze_engagement` | `articleId` | 查看阅读量、点赞、评论及互动率 |
| `get_article_recommendations` | `articleId?`、`tagId?`、`limit=5` | 根据文章所属标签或指定标签查找相关文章 |
| `get_content_summary` | `timeRange=week` | 汇总 `today`、`week` 或 `month` 的内容样本 |

分页参数使用正整数，通用上限为 `page <= 1000`、`limit <= 50`。`list_authors` 仅支持 `page=1` 和 `limit <= 20`。推荐文章需提供 `articleId` 或 `tagId`。

## 案例一　让 AI 搜索 Vue 文章

在已连接服务的 AI 客户端中输入以下需求。

```text
请搜索与 Vue 相关的文章，先给我 5 篇。
列出标题、作者和原文链接，并根据可用的标题或描述说明各自关注的主题。
```

客户端可以调用 `search_articles_by_keyword`，参数如下。

```json
{
  "keyword": "Vue",
  "searchIn": "both",
  "page": 1,
  "limit": 5
}
```

工具返回的 `content[0].text` 为 JSON 文本。解析后检查 `success`，从 `data.articles` 读取文章，文章结果中的 `url` 可直接用于跳转。匹配数量由社区实际内容决定。

## 案例二　验证 HTTP 连接与工具调用

以下 PowerShell 示例在本机 HTTP 模式启动后执行，将占位令牌替换为 `.env` 中的值。示例先初始化协议，再发现工具，最后查询推荐作者。

```powershell
$endpoint = 'http://127.0.0.1:3101/mcp'
$headers = @{
  Authorization = 'Bearer replace-with-a-long-random-token'
  Accept = 'application/json, text/event-stream'
  'MCP-Protocol-Version' = '2025-03-26'
}

$initialize = @{
  jsonrpc = '2.0'
  id = 1
  method = 'initialize'
  params = @{
    protocolVersion = '2025-03-26'
    capabilities = @{}
    clientInfo = @{ name = 'docs-example'; version = '1.0.0' }
  }
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri $endpoint -Method Post -Headers $headers -ContentType 'application/json' -Body $initialize

$ready = @{ jsonrpc = '2.0'; method = 'notifications/initialized' } | ConvertTo-Json
Invoke-RestMethod -Uri $endpoint -Method Post -Headers $headers -ContentType 'application/json' -Body $ready

$list = @{ jsonrpc = '2.0'; id = 2; method = 'tools/list'; params = @{} } | ConvertTo-Json
Invoke-RestMethod -Uri $endpoint -Method Post -Headers $headers -ContentType 'application/json' -Body $list

$call = @{
  jsonrpc = '2.0'
  id = 3
  method = 'tools/call'
  params = @{ name = 'list_authors'; arguments = @{ page = 1; limit = 5 } }
} | ConvertTo-Json -Depth 10
$response = Invoke-RestMethod -Uri $endpoint -Method Post -Headers $headers -ContentType 'application/json' -Body $call
$response.result.content[0].text | ConvertFrom-Json
```

初始化响应包含 `result.protocolVersion` 和 `result.serverInfo`，工具发现响应包含 `result.tools`，作者查询结果包含 `data.authors` 和公开主页。

## 数据范围与排查

- 排序、推荐与统计基于公开 API 返回的分页样本，阅读量排行和内容摘要需要保留此范围说明。`get_content_summary` 当前将评论总数设为 0，`analyze_engagement` 当前将分享数设为 0，展示时应注明这些字段尚未统计。
- `list_authors` 返回作者样本，数量由接口响应决定。作者展示文本中的手机号会脱敏。
- HTTP 模式访问 `/health` 可检查服务配置，`status=ok` 表示已配置令牌，文章 API 的连通性需要通过实际工具调用检查。
- 返回 401 时检查令牌，浏览器返回 403 时检查来源配置。已携带正确令牌的 GET `/mcp` 返回 405，协议请求使用 POST。

工具参数、传输配置和数据范围以仓库实现为依据。[服务入口](https://github.com/hujinbin/mcp-server-jue-article/blob/main/index.js) · [业务服务](https://github.com/hujinbin/mcp-server-jue-article/tree/main/services)
