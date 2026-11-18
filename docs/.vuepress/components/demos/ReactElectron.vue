<template>
  <DemoPanel title="React 计数工具" description="React 界面预览，Electron 窗口和安装包需在本机运行。下面的计数由 React 18 实际渲染。">
    <div class="react-electron-demo">
      <div class="react-electron-demo-frame">
        <div class="react-electron-demo-titlebar">任务计数器 <span>React 页面</span></div>
        <p v-if="error" class="react-electron-demo-status" role="alert">{{ error }}</p>
        <p v-else-if="loading" class="react-electron-demo-status" role="status">正在加载 React 预览…</p>
        <div ref="reactContainer" class="react-electron-demo-mount" />
      </div>
      <p class="react-electron-demo-note">计数保存在当前页面状态中，重新加载后归零。</p>
    </div>
  </DemoPanel>
</template>

<script>
import DemoPanel from '../DemoPanel.vue';

export default {
  components: { DemoPanel },
  data() {
    return { loading: true, error: '' };
  },
  created() {
    // React 根实例独立于 Vue 响应式状态，路由离开后统一卸载。
    this.reactRoot = null;
    this.previewDisposed = false;
  },
  async mounted() {
    try {
      const [reactModule, clientModule] = await Promise.all([
        import('react'),
        import('react-dom/client'),
      ]);
      if (this.previewDisposed) return;
      const React = reactModule.default || reactModule;
      const client = clientModule.default || clientModule;
      const h = React.createElement;

      function TaskCounter() {
        const [count, setCount] = React.useState(0);
        return h('main', { className: 'react-task-app' },
          h('h3', null, '桌面计数工具'),
          h('p', { className: 'react-task-count', 'aria-live': 'polite', 'aria-atomic': 'true' },
            '已完成 ', h('strong', null, count), ' 项任务'),
          h('div', { className: 'react-task-actions' },
            h('button', { type: 'button', onClick: () => setCount(value => value + 1) }, '完成一项'),
            h('button', { type: 'button', className: 'react-task-reset', onClick: () => setCount(0) }, '重置')));
      }

      this.reactRoot = client.createRoot(this.$refs.reactContainer);
      this.reactRoot.render(h(TaskCounter));
      this.loading = false;
    } catch (error) {
      if (this.previewDisposed) return;
      this.loading = false;
      this.error = 'React 预览加载失败，请刷新页面重试。';
    }
  },
  beforeDestroy() {
    this.previewDisposed = true;
    if (this.reactRoot) this.reactRoot.unmount();
    this.reactRoot = null;
  },
};
</script>

<style>
.react-electron-demo .react-electron-demo-frame { border: 1px solid #d9e3df; border-radius: 10px; overflow: hidden; background: #f6f9f7; }
.react-electron-demo .react-electron-demo-titlebar { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; color: #354f42; background: #eaf0ec; border-bottom: 1px solid #d9e3df; font-size: 13px; }
.react-electron-demo .react-electron-demo-titlebar span { color: #6b8073; font-size: 12px; }
.react-electron-demo .react-task-app { padding: 28px; text-align: center; }
.react-electron-demo .react-task-app h3 { margin: 0 0 14px; border: 0; color: #294538; font-size: 20px; font-weight: 600; }
.react-electron-demo .react-task-count { display: flex; align-items: baseline; justify-content: center; gap: 9px; margin: 12px 0 24px; color: #60756a; font-size: 15px; }
.react-electron-demo .react-task-count strong { min-width: 50px; color: #235b42; font-size: 56px; font-weight: 500; line-height: 1.2; font-variant-numeric: tabular-nums; }
.react-electron-demo .react-task-actions { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
.react-electron-demo .react-task-actions button { padding: 10px 20px; border: 1px solid #2d7253; border-radius: 6px; background: #2d7253; color: #fff; font: inherit; font-size: 14px; cursor: pointer; }
.react-electron-demo .react-task-actions button:hover { background: #235b42; }
.react-electron-demo .react-task-actions button.react-task-reset { background: #fff; border-color: #d2ded7; color: #456151; }
.react-electron-demo .react-task-actions button:focus-visible { outline: 3px solid #6ab28f; outline-offset: 3px; }
.react-electron-demo .react-electron-demo-note { margin: 12px 0 0; color: #687d70; font-size: 12px; }
.react-electron-demo .react-electron-demo-status { margin: 20px; color: #687d70; font-size: 14px; }
@media (max-width: 480px) { .react-electron-demo .react-task-app { padding: 24px 14px; } }
</style>
