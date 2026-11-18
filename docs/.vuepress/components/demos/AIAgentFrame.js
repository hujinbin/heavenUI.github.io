import runtimeSource from '!!raw-loader!./AIAgentRuntime.js';

export function createAIAgentFrame(source) {
  // 避免 UMD 或内联脚本中的结束标签提前终止 HTML 的 script 元素。
  const safeScript = value => value.replace(/<\/script/gi, '<\\/script');
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'">
<style>
*{box-sizing:border-box}body{margin:0;padding:18px;background:#f2f6f3;color:#2c4539;font:14px/1.6 'PingFang SC','Microsoft YaHei',sans-serif}body[data-theme=dark]{background:#17221e;color:#d4e4da}
.demo-controls{display:flex;align-items:center;flex-wrap:wrap;gap:8px}.demo-controls button{padding:7px 11px;border:1px solid #bfcec4;border-radius:6px;background:#fff;color:#284638;font:inherit;font-size:12px;cursor:pointer}.demo-controls button:hover{border-color:#278663}.demo-controls button:focus-visible{outline:3px solid #9fd4bb;outline-offset:2px}.demo-label{margin-right:auto;font-size:12px;font-weight:600}.demo-status{margin:8px 0;color:#587464;font-size:12px}body[data-theme=dark] .demo-status{color:#a7c2b1}
.demo-intro{max-width:180px;margin-top:82px}.demo-intro h1{font-size:25px;line-height:1.4;font-weight:600;letter-spacing:-.5px}.demo-intro p{font-size:12px;color:#63816e}.demo-intro button{padding:9px 13px;border:1px solid #278663;border-radius:6px;background:#278663;color:white;font:inherit;font-size:12px;cursor:pointer}.demo-intro button:focus-visible{outline:3px solid #a3d5bd;outline-offset:3px}
.ai-agent-panel{max-height:calc(100dvh - 184px)!important;height:480px!important}.ai-agent-btn{bottom:16px!important}.ai-agent-pos-bottom-right{bottom:78px!important}
@media(max-width:650px){.demo-intro{margin:0}.demo-intro h1,.demo-intro p{display:none}.demo-intro button{margin-top:3px;padding:6px 10px}.demo-label{flex-basis:100%}.ai-agent-panel{max-height:calc(100dvh - 250px)!important}.demo-controls{gap:6px}}
</style></head><body>
<div class="demo-controls"><span class="demo-label">交互演示 · 本地示例回复</span><button type="button" data-theme aria-pressed="false">切换深色</button><button type="button" data-reset>重置对话</button></div>
<p class="demo-status" data-status role="status" aria-live="polite">正在准备演示</p>
<div class="demo-intro"><h1>在页面内<br>试一段对话</h1><p>真实插件界面，示例回复保存在当前页面。</p><button type="button" data-question>发送国际化示例问题</button></div>
<script>${safeScript(source)}<` + `/script><script>${safeScript(runtimeSource)}<` + `/script></body></html>`;
}
