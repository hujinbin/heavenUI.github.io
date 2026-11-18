<template>
  <DemoPanel title="监控采集演示" badge="真实采集插件 · 本地接收" description="点击按钮查看真实插件生成的异常与业务事件数据。示例在独立预览区运行，网络环境固定为可切换的 4g / 3g，所有上报都在本地拦截。">
    <p v-if="error" role="alert">{{ error }} <button @click="load">重新加载</button></p>
    <p v-else-if="!source" class="demo-muted" role="status">正在加载演示…</p>
    <iframe v-else :srcdoc="source" title="监控工具本地采集预览" sandbox="allow-scripts" height="440" />
  </DemoPanel>
</template>

<script>
import DemoPanel from '../DemoPanel.vue';
import { monitoringFrame } from './MonitoringFrame';

export default {
  components: { DemoPanel },
  data() { return { source: '', error: '' }; },
  mounted() { this.load(); },
  beforeDestroy() { this.disposed = true; },
  methods: {
    async load() {
      this.error = '';
      try {
        // 以文本载入真实发布包，避免它修改文档站的网络和错误监听
        const module = await import('!!raw-loader!monitoring-tool-demo/lib/monitoring-tool.min.js');
        if (!this.disposed) this.source = monitoringFrame(module.default);
      } catch (error) {
        if (!this.disposed) this.error = '演示加载失败，请重试。';
      }
    }
  }
};
</script>
