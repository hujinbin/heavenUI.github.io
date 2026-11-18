export function monitoringFrame(source) {
  // 插件来自固定依赖，不将用户输入拼入 HTML 或脚本
  const script = source.replace(/<\/script/gi, '<\\/script');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; connect-src 'none'">
<style>
*{box-sizing:border-box}body{margin:0;color:#2c3e50;font:14px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif}.toolbar{display:flex;flex-wrap:wrap;gap:9px;align-items:center}button,select{font:inherit;font-size:13px;border:1px solid #cbd7cf;border-radius:4px;padding:7px 11px;background:white;color:#2c3e50;cursor:pointer}button:hover{border-color:#3eaf7c;color:#25835a}button:focus-visible,select:focus-visible{outline:2px solid #3eaf7c;outline-offset:2px}.status{display:flex;gap:16px;flex-wrap:wrap;margin-top:15px;padding:10px 12px;background:#f6faf7;border:1px solid #dde7df;border-radius:4px;font-size:13px}.hint{font-size:12px;color:#718178;margin:12px 0}pre{margin:0;background:#282c34;color:#d7e2db;padding:14px;border-radius:4px;white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.65 Consolas,monospace;height:260px;overflow:auto}
</style></head><body>
<div class="toolbar"><button id="error">采集 JavaScript 错误</button><button id="business">采集保存失败事件</button><label>网络质量 <select id="network" aria-label="演示网络质量"><option>4g</option><option>3g</option></select></label><button id="clear">清空记录</button></div>
<div class="status" aria-live="polite"><span>本地接收 <strong id="count">0</strong> 条</span><span id="state">等待操作</span></div>
<p class="hint">真实 monitoring-tool 0.1.0 · Beacon 在本地接收，不发送到监控服务。</p>
<pre id="payload" role="region" tabindex="0" aria-label="采集数据" aria-live="polite">点击上方按钮查看事件 JSON。</pre>
<script>
(function () {
  var reports = [];
  var connection = new EventTarget();
  connection.effectiveType = '4g';
  Object.defineProperty(navigator, 'connection', { configurable: true, value: connection });
  // 固定性能观察环境，只演示异常与业务事件的实际采集链路
  window.PerformanceObserver = function () { this.observe = function () {}; this.disconnect = function () {}; };
  Object.defineProperty(performance, 'timing', { value: { fetchStart: 100, connectStart: 100, connectEnd: 105, requestStart: 105, responseStart: 110, responseEnd: 120, domLoading: 120, domInteractive: 130, domContentLoadedEventStart: 130, domContentLoadedEventEnd: 135, loadEventStart: 140 } });
  if (!performance.memory) Object.defineProperty(performance, 'memory', { value: { usedJSHeapSize: 0, totalJSHeapSize: 1, jsHeapSizeLimit: 1 } });
  Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: function (url, blob) {
    blob.text().then(function (text) {
      var data = JSON.parse(text);
      reports.unshift(data);
      reports = reports.slice(0, 20);
      document.getElementById('count').textContent = reports.length;
      document.getElementById('state').textContent = '已在本地接收';
      document.getElementById('payload').textContent = JSON.stringify(reports, null, 2);
    });
    return true;
  } });
  window.demoConnection = connection;
  window.clearDemoReports = function () { reports = []; document.getElementById('count').textContent = '0'; document.getElementById('payload').textContent = '记录已清空。'; document.getElementById('state').textContent = '等待操作'; };
  console.log = function () {};
})();
</script><script>${script}</script><script>
(function () {
  try {
    new window.monitoringTool({ secret: 'LOCAL_DEMO_KEY', host: 'https://monitor-demo.invalid' });
    function pending() { document.getElementById('state').textContent = demoConnection.effectiveType === '4g' ? '正在本地采集' : '3g：插件按网络规则跳过上报'; }
    document.getElementById('error').onclick = function () {
      pending();
      window.dispatchEvent(new ErrorEvent('error', { message: '监控接入测试', filename: 'demo.js', lineno: 1, colno: 1, error: new Error('监控接入测试') }));
    };
    document.getElementById('business').onclick = function () {
      pending();
      window.dispatchEvent(new CustomEvent('monitoring-report', { detail: { reportType: 'businessError', kind: 'editor', message: '保存失败', action: 'save' } }));
    };
    document.getElementById('network').onchange = function () { demoConnection.effectiveType = this.value; demoConnection.dispatchEvent(new Event('change')); document.getElementById('state').textContent = this.value === '4g' ? '4g：可以采集' : '3g：暂停上报'; };
    document.getElementById('clear').onclick = window.clearDemoReports;
  } catch (error) {
    document.getElementById('state').textContent = '演示初始化失败';
    document.getElementById('payload').textContent = '当前浏览器无法运行采集演示，请使用新版浏览器。';
  }
})();
</script></body></html>`;
}
