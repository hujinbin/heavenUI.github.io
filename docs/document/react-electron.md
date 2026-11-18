# React-electron

React-electron 是基于 React 18、Create React App 与 Electron 的桌面应用工程模板，提供页面开发、Electron 窗口启动和 electron-builder 打包配置，适合搭建桌面工具的基础界面。

[源码仓库](https://github.com/hujinbin/React-electron)

## 页内演示

<ClientOnly>
  <demos-ReactElectron />
</ClientOnly>

## 项目能力

- React 页面开发与热更新。
- Electron 主进程创建 1200 × 800 的应用窗口，开发环境加载 `http://localhost:3000` 并打开开发者工具。
- 打包后从本地 `build/index.html` 加载页面。
- electron-builder 配置 Windows NSIS、macOS DMG 与 Linux AppImage 打包目标。
- Windows 安装程序可选择安装目录，并创建桌面与开始菜单快捷方式。

## 获取与安装

准备 Node.js、npm 和 Git，确保当前系统能够安装 Electron 依赖。

```bash
git clone https://github.com/hujinbin/React-electron.git
cd React-electron
npm install
```

仓库当前使用 React `^18.3.1`、Electron `^31.7.6` 与 electron-builder `^24.13.3`，具体依赖以项目 `package.json` 和锁文件为准。

## 开发启动

### 分别启动页面与桌面窗口

在第一个终端启动 React 开发服务器。

```bash
npm start
```

等到 `http://localhost:3000` 可以访问，再在项目目录打开第二个终端。

```bash
npm run ele
```

窗口会加载开发页面。修改 `src/App.js` 后，可以在桌面窗口中查看页面更新。主进程改动需要重新启动 Electron。

### 使用组合命令

```bash
npm run dev
```

该脚本通过 `concurrently` 并行启动 React 与 Electron，并使用 `wait-on` 等待 3000 端口。脚本中包含 `sleep 5`，需要命令行环境支持 `sleep`。Windows 环境若提示找不到该命令，可使用上面的两个终端启动方式。

## 项目结构

```text
React-electron/
├── public/
│   ├── electron.js          # Electron 主进程入口
│   ├── index.html           # 页面 HTML 模板
│   └── favicon.ico          # 应用及安装程序图标
├── src/
│   ├── App.js               # React 页面入口
│   ├── App.css              # 页面样式
│   └── index.js             # React 挂载入口
├── electron-builder.yml    # 桌面应用打包配置
└── package.json            # 依赖与运行脚本
```

## 脚本说明

| 命令 | 用途 |
| --- | --- |
| `npm start` | 启动 React 开发服务器 |
| `npm run ele` | 启动 Electron，开发时需先启动页面服务 |
| `npm run dev` | 组合启动页面服务与 Electron |
| `npm test` | 运行 React 测试，默认进入交互模式 |
| `npm run build` | 先构建 React 页面，再执行 electron-builder 打包 |

## 使用案例

### 制作本地计数工具

将 `src/App.js` 替换为以下组件，然后按开发启动流程运行，即可在桌面窗口中操作计数。

```jsx
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>桌面计数工具</h1>
      <p>已完成 {count} 项任务</p>
      <button onClick={() => setCount(value => value + 1)}>
        完成一项
      </button>
      <button onClick={() => setCount(0)} style={{ marginLeft: 12 }}>
        重置
      </button>
    </main>
  );
}

export default App;
```

示例状态保存在组件内，关闭窗口后重新开始。需要保存业务数据时，可在应用中继续添加持久化逻辑。

### 修改应用名称并生成安装包

编辑 `electron-builder.yml` 中的应用信息。

```yaml
appId: com.example.taskcounter
productName: 任务计数器

directories:
  buildResources: assets
  output: dist
```

这是需要调整的配置片段，应在原文件中修改对应字段，并保留所需的打包目标。Windows 快捷方式名称由 `nsis.shortcutName` 单独配置，需要一起修改。替换图标时还需核对 `win`、`mac`、`linux` 及 `nsis` 中的图标路径与格式。

```bash
npm run build
```

React 页面生成到 `build/`，桌面构建产物输出到 `dist/`。实际产物取决于构建系统与所选择的平台目标，构建时还需要相应的平台工具和依赖。

## 配置与注意事项

| 配置位置 | 作用 |
| --- | --- |
| `package.json` 的 `main` | 指向主进程入口 `public/electron.js` |
| `package.json` 的 `homepage` | 设置为 `.`，使 React 构建使用相对资源路径 |
| `public/electron.js` | 管理窗口大小、开发页面地址及本地页面加载路径 |
| `electron-builder.yml` 的 `files` | 将 `public/**`、`build/**` 与 `package.json` 纳入应用 |
| `electron-builder.yml` 的 `directories.output` | 指定桌面构建输出目录 `dist` |
| `electron-builder.yml` 的 `publish` | 配置发布服务地址，仓库使用示例地址 |

开发窗口固定加载 3000 端口。如果 React 因端口占用而改用其他端口，需要同步调整 `public/electron.js` 与 `dev` 脚本中的地址。

仓库中的发布地址为 `https://example.com/auto-updates`，接入实际发布流程时需替换为自己的服务地址，并按需求实现更新逻辑。

当前窗口配置启用了 `nodeIntegration`。涉及本地文件、系统能力或外部页面时，需要继续设计主进程、预加载脚本与页面之间的权限和通信接口。

## 相关文档

- [依赖与运行脚本](https://github.com/hujinbin/React-electron/blob/main/package.json)
- [Electron 窗口实现](https://github.com/hujinbin/React-electron/blob/main/public/electron.js)
- [桌面打包配置](https://github.com/hujinbin/React-electron/blob/main/electron-builder.yml)
