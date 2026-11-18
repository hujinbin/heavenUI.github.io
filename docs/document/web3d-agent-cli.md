# Web3D Agent CLI

`web3d-agent-cli` 是面向 Three.js 应用和 Python 后端的编程智能体终端工具。它通过兼容 OpenAI Chat Completions 的接口连接模型，结合项目规则读取、检查和编辑工作区，并可执行经过授权的构建与测试命令。

本文对应 `0.1.0` 版本，运行时使用 DeepSeek Harness。源码及架构说明见 [GitHub 仓库](https://github.com/hujinbin/web3d-agent-cli)。

## 页内演示

<ClientOnly>
  <demos-CliPreview variant="web3d" />
</ClientOnly>

## 安装与启动

需要 Node.js 22 或更新版本。处理 Python 后端任务时，再准备目标项目所需的 Python 环境。

```bash
npm install -g web3d-agent-cli
web3d-agent --help
```

也可以使用 `npx web3d-agent-cli`。在目标项目目录启动对话。

```bash
cd your-web3d-project
web3d-agent init
web3d-agent
```

首次交互启动会打开配置向导，依次选择模型服务、填写 API 根地址和 API Key，再选择或输入模型 ID。使用支持 `tools` / `tool_calls` 的模型。也可以单独运行 `web3d-agent setup` 修改配置。

用户默认配置保存到用户目录的 `.web3d-agent/config.json`，凭据按接口地址保存在本机凭据存储中。进入其他项目时可复用这些设置。

## 命令

| 命令 | 用途 |
| --- | --- |
| `web3d-agent init` | 创建项目配置与补充规则文件，已有文件会保留 |
| `web3d-agent chat` | 开始交互式对话，也是默认命令 |
| `web3d-agent run "任务"` | 执行一次任务 |
| `web3d-agent setup` | 设置模型服务和凭据 |
| `web3d-agent check` | 本地检查 Three.js 与 Python 源码线索 |
| `web3d-agent doctor` | 查看运行时、模型配置和规则来源 |
| `web3d-agent rules` | 显示已加载的规则 |
| `web3d-agent sessions` | 列出当前工作区的会话 |

常用参数如下。

| 参数 | 说明 |
| --- | --- |
| `-C <目录>` | 指定目标项目，默认当前目录 |
| `--model <ID>` | 指定模型 |
| `--base-url <URL>` | 指定模型 API 根地址 |
| `--mode <模式>` | `ask`、`auto-edit` 或 `plan` |
| `--allow-run` | 允许本进程中的外部命令调用 |
| `--max-steps <数量>` | 最大模型调用轮次，默认 20 |
| `--resume <ID或latest>` | 恢复当前工作区会话 |
| `--no-stream` | 使用非流式 JSON，适用于未提供 SSE 的模型服务 |
| `--demo` | 使用固定离线脚本体验工具流程 |
| `--json` | `run` 输出 JSONL 事件，`check` 和 `doctor` 输出 JSON |

## 项目配置与规则

`init` 创建 `web3d-agent.json` 和 `.web3d-agent/rules/project.md`。初始化配置内容为 `{}`，可按项目补充以下字段。

```json
{
  "baseUrl": "https://your-provider.example.com/v1",
  "model": "your-tool-calling-model",
  "apiKeyEnv": "WEB3D_API_KEY",
  "maxSteps": 20,
  "contextChars": 100000,
  "maxOutputTokens": 4096,
  "requestTimeoutMs": 120000,
  "stream": true
}
```

配置优先级由高到低为命令行、`WEB3D_MODEL` / `WEB3D_BASE_URL` 环境变量、项目配置、用户默认设置和内置默认值。密钥优先从 `apiKeyEnv` 指定的环境变量及 `OPENAI_API_KEY` 读取，随后读取该接口绑定的本机凭据。

CLI 自动加载三组内置规则，并读取目标项目根目录的 `AGENTS.md` 和 `.web3d-agent/rules/*.md`。可以将场景坐标、资源加载、接口字段和验证方式写入项目规则。

```markdown
# 项目规则

- 前端沿用现有 Three.js 版本，后端沿用 FastAPI。
- 世界坐标以米为单位，Y 轴朝上。
- GLB 和贴图通过现有资源服务加载。
- 场景卸载时清理事件、动画和不再共享的 GPU 资源。
- 修改接口字段时同步前端类型与后端响应模型。
- 使用项目已有的构建与测试脚本验证修改。
```

项目规则在进程启动时加载，修改后重新启动 CLI。会话保存在目标项目的 `.web3d-agent/sessions/`，可将该目录加入项目的 `.gitignore`。

## 执行模式与工具

| 模式 | 读取与检查 | 修改文件 | 执行命令 |
| --- | --- | --- | --- |
| `ask`，默认 | 直接执行 | 每次询问 | 每次询问 |
| `auto-edit` | 直接执行 | 自动批准 | 每次询问 |
| `plan` | 直接执行 | 拒绝 | 拒绝 |

`--allow-run` 授权本进程执行命令，`plan` 模式仍保持只读。非交互环境和 `--json` 模式遇到尚未授权的操作时，会向模型返回工具错误。

内置工具包括 `list_files`、`read_file`、`search_text`、`write_file`、`edit_file`、`run_command` 和 `check_project`。文件工具限制在目标工作区内，覆盖文件前会校验完整读取状态及内容哈希。外部命令以当前用户权限运行，授权时应结合命令及其参数判断。

## 案例一　离线检查现有项目

在已有 Three.js 或 Python 项目目录中运行以下命令，即可查看本地诊断和离线工具流程。

```bash
web3d-agent check --json
web3d-agent run "检查项目结构和前后端隐患" --demo --json
```

`check` 报告包含已读取的源码数量、跳过原因、扫描范围，以及诊断对应的文件、行号和证据。离线演示依次调用目录枚举和项目检查工具，再输出固定脚本的说明，全程无需模型服务。

Three.js 清理检查和 Python 异步阻塞检查属于启发式提示，诊断级别为 `review`。处理建议时，需要继续核查生命周期、资源所有权和实际调用路径。场景显示与 GPU 行为需要通过浏览器及 WebGL 实际验证。

## 案例二　修复场景资源销毁

完成模型配置后，先梳理场景生命周期。

```bash
web3d-agent run "读取场景初始化、模型切换和组件卸载代码，定位重复事件与资源释放问题，列出修改计划" --mode plan
```

根据分析结果执行修改，并让模型运行项目已有检查。

```bash
web3d-agent run "根据场景生命周期检查结果，修复模型切换与卸载时的事件、动画和非共享资源清理，运行已有构建并说明验证结果" --resume latest --mode auto-edit
```

此模式允许工作区文件编辑，执行构建命令时会显示批准提示。任务产物应包括实际代码差异、工具运行结果和需要继续检查的渲染行为，最终以工具输出与项目测试结果为准。

查看历史并继续同一项目的任务。

```bash
web3d-agent sessions
web3d-agent run "继续检查 resize 处理是否更新相机投影矩阵" --resume latest --mode auto-edit
```

恢复会话后，覆盖文件前会重新读取当前内容。Ctrl+C 取消任务时，已经完成的修改会保留。

## 案例三　检查前后端接口契约

适合 Three.js 场景元数据来自 Python API 的项目。在目标项目目录中输入具体字段和需要核对的边界。

```bash
web3d-agent run "检查模型列表 API 的 id、url、position 字段与前端类型是否一致，核查空列表和无效坐标处理，输出需要修改的文件和验证步骤" --mode plan
```

需要自动化收集分析过程时，可增加 `--json` 获取逐行事件。接入不支持 SSE 的服务时，增加 `--no-stream`。

## 会话内操作

```text
/help                     显示帮助
/model                    从当前接口选择模型
/model your-model-id      切换并保存默认模型
/setup                    修改接口与凭据
/rules                    查看规则来源
/status                   查看模式和会话 ID
/sessions                 列出会话
/resume latest            恢复最近会话
/new                      开始新会话
/mode plan                切换为只读模式
/exit                     退出
```

Windows 下，命令工具使用独立的程序名和参数数组。执行 npm 脚本时，需要模型明确调用 PowerShell，或用 Node 执行包管理器的 JavaScript 入口。

## 从源码运行

```bash
git clone https://github.com/hujinbin/web3d-agent-cli.git
cd web3d-agent-cli
npm ci
npm run build
npm start -- --help
```

开发时可使用 `npm run dev -- --help`，项目提供 `npm run typecheck` 和 `npm test`。CLI 退出码 `0` 表示循环正常结束，`1` 表示配置或运行错误，`2` 表示达到轮次上限，`130` 表示取消。
