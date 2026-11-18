# monitoring-tool

轻量级前端监控采集工具，可接入网页或 Vue 项目，收集 JavaScript 异常、请求异常、慢请求和页面性能数据，并发送到监控接收服务。以下配置依据 `0.1.0` 版本。[源码仓库](https://github.com/hujinbin/monitoring-tool)

## 页内演示

点击按钮可直接查看插件采集出的事件。演示使用真实发布包，独立预览区内的网络质量和性能环境固定为测试值，Beacon 上报由本地接收器拦截，便于查看数据结构。接入真实网站时使用下文中的服务配置。

<ClientOnly>
  <demos-Monitoring />
</ClientOnly>

## 安装

```bash
npm install monitoring-tool@0.1.0
```

## 初始化

在浏览器入口中创建一次实例。需要先在监控接收服务取得采集密钥，再填写 `secret`。

```javascript
import monitoringTool from 'monitoring-tool';

const monitor = new monitoringTool({
  secret: 'YOUR_MONITORING_KEY',
  host: 'https://monitor.leheavengame.com',
});
```

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `secret` | `string` | `''` | 采集密钥，非空时才初始化监控模块，上报时作为 `apiKey` |
| `host` | `string` | `https://monitor.leheavengame.com` | 接收服务的根地址，上报路径自动拼接 `/api/report` |

`host` 填写服务根地址并去掉末尾斜杠。例如接收地址为 `https://monitor.example.com/api/report`，应填写 `https://monitor.example.com`。自建接收服务需要处理 Beacon 发送的 JSON 文本并校验采集密钥。

纯 HTML 页面也可通过 CDN 使用，构造函数挂载到 `window.monitoringTool`。

```html
<script src="https://unpkg.com/monitoring-tool@0.1.0/lib/monitoring-tool.min.js"></script>
<script>
  new window.monitoringTool({
    secret: 'YOUR_MONITORING_KEY',
    host: 'https://monitor.leheavengame.com'
  });
</script>
```

## 采集内容

| 模块 | 采集与触发条件 | 上报分类 |
| --- | --- | --- |
| JavaScript 错误 | 监听页面 `error` 事件，记录错误信息、文件、位置和堆栈 | `webError` |
| Promise 异常 | 监听 `unhandledrejection` | `webError` |
| XHR 请求 | 响应状态不等于 200 时记录异常，状态为 200 且耗时超过 2000 ms 时记录慢请求 | `networkError`、`networkStability` |
| Fetch 请求 | 请求拒绝时记录异常，耗时超过 2000 ms 时记录慢请求 | `networkError`、`networkStability` |
| 页面性能 | 页面加载、长任务、资源加载、渲染耗时和内存检查 | `webStability` |

事件通过 `monitoring-report` 汇总，实例补充 `apiKey`、当前域名 `domain` 和页面完整地址 `path`，再使用 `navigator.sendBeacon` 发送到接收服务。[采集入口与上报代码](https://github.com/hujinbin/monitoring-tool/tree/main/src)

## 案例一　在 Vue 项目中验证错误采集

在浏览器入口导入采集工具，组件内通过按钮触发一次测试错误。建议使用 Chromium 浏览器进行此案例，确认网络状态中的 `effectiveType` 为 `4g`。

```javascript
// src/main.js，在创建 Vue 实例前初始化一次
import monitoringTool from 'monitoring-tool';

new monitoringTool({
  secret: 'YOUR_MONITORING_KEY',
  host: 'https://monitor.leheavengame.com',
});
```

```vue
<template>
  <button @click="verifyMonitor">验证错误采集</button>
</template>

<script>
export default {
  methods: {
    verifyMonitor() {
      // 异步抛出，让浏览器全局错误监听器收到事件
      setTimeout(() => {
        throw new Error('监控接入测试');
      }, 0);
    },
  },
};
</script>
```

打开开发者工具的 Network 面板后点击按钮，检查 `/api/report` 请求。数据中应包含 `reportType: "webError"`、`errorType: "jsError"`、错误消息、当前域名和页面地址。接收服务保存成功后，可在对应项目中查看这条测试数据。

## 案例二　补充业务事件

已初始化实例的页面可以派发 `monitoring-report` 自定义事件。以下代码演示记录编辑器保存失败，业务字段需与接收服务约定。

```javascript
window.dispatchEvent(new CustomEvent('monitoring-report', {
  detail: {
    reportType: 'businessError',
    kind: 'editor',
    message: '保存失败',
    action: 'save',
  },
}));
```

事件会进入现有上报队列，自动附带采集密钥、域名和页面地址。可先在 Network 面板核对请求内容，再检查接收服务对业务分类的处理。

## 使用注意

- 当前初始化依赖 Network Information API，内部直接读取 `navigator.connection` 一类对象。接入前确认目标浏览器支持该 API，以及 PerformanceObserver、`performance.memory` 和 Beacon。
- 当前仅在 `effectiveType === '4g'` 时发送数据。该值是浏览器估算的网络质量，Wi-Fi 也可能返回 `4g`。其他值下事件不会发送。
- 当前源码对 Fetch 字符串参数的类型判断存在兼容问题，使用 Fetch 的页面应核对实际请求行为，案例验证可先使用 XHR 或 `fetch(new Request(url))`。
- Promise 异常监听已接入，但上报字段当前读取普通错误事件属性，错误原因和堆栈可能缺失。资源加载错误分支当前只输出日志。
- 实例会修改全局 XHR、Fetch 与错误监听，入口只初始化一次。SSR 项目需要在浏览器生命周期中加载。
- 采集密钥随前端代码分发，接收服务需要将其作为采集标识使用。上报数据包含页面完整地址，接入时确认 URL 中的业务参数适合收集。

配置项与触发条件可结合源码核对。[初始化](https://github.com/hujinbin/monitoring-tool/blob/main/src/index.ts) · [网络采集](https://github.com/hujinbin/monitoring-tool/blob/main/src/network/network.ts) · [错误采集](https://github.com/hujinbin/monitoring-tool/blob/main/src/webError/webError.ts)
