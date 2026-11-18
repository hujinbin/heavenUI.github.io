<template>
  <section class="demo-panel" :aria-label="title">
    <header class="demo-panel__header">
      <strong>{{ title }}</strong>
      <span v-if="badge" class="demo-panel__badge">{{ badge }}</span>
      <p v-if="description">{{ description }}</p>
    </header>
    <div class="demo-panel__body"><slot /></div>
  </section>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    badge: { type: String, default: '可交互' }
  }
};
</script>

<style>
.demo-panel {
  margin: 1.6rem 0;
  border: 1px solid #dce5df;
  border-radius: 6px;
  background: #fff;
  overflow: hidden;
  color: #2c3e50;
}
.demo-panel__header { padding: 16px 20px; border-bottom: 1px solid #e7ece9; background: #f6faf7; }
.demo-panel__header strong { font-size: 16px; }
.demo-panel__header p { margin: 8px 0 0; font-size: 13px; line-height: 1.7; color: #63746b; }
.demo-panel__badge { display: inline-block; margin-left: 10px; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: 500; color: #267f54; background: #e5f3eb; vertical-align: middle; }
.demo-panel__body { padding: 20px; min-width: 0; }
.demo-panel .demo-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 16px; }
.demo-panel button { padding: 7px 13px; border: 1px solid #cbd7cf; border-radius: 4px; background: #fff; color: #2c3e50; font: inherit; font-size: 13px; line-height: 1.5; cursor: pointer; }
.demo-panel button:hover:not(:disabled) { border-color: #3eaf7c; color: #25835a; background: #f5fbf7; }
.demo-panel button:disabled { cursor: default; opacity: .55; }
.demo-panel button.demo-primary { background: #3eaf7c; border-color: #3eaf7c; color: #fff; }
.demo-panel button.demo-primary:hover:not(:disabled) { background: #328e65; color: #fff; }
.demo-panel input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]), .demo-panel select { box-sizing: border-box; max-width: 100%; padding: 8px 10px; border: 1px solid #cbd7cf; border-radius: 4px; background: #fff; color: #2c3e50; font: inherit; font-size: 13px; }
.demo-panel input:focus-visible, .demo-panel select:focus-visible, .demo-panel button:focus-visible, .demo-panel [tabindex]:focus-visible { outline: 2px solid #3eaf7c; outline-offset: 3px; }
.demo-panel label { font-size: 13px; }
.demo-panel .demo-field { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.demo-panel .demo-result { margin-top: 16px; padding: 12px 14px; border: 1px solid #e1e8e3; border-radius: 4px; background: #f7f9f8; font-size: 13px; line-height: 1.8; overflow-wrap: anywhere; }
.demo-panel .demo-muted { color: #718178; font-size: 12px; line-height: 1.7; }
.demo-panel pre { margin: 12px 0 0; font-size: 12px; max-height: 320px; overflow: auto; }
.demo-panel iframe { width: 100%; display: block; border: 0; border-radius: 4px; }
@media (max-width: 520px) {
  .demo-panel__header, .demo-panel__body { padding: 14px; }
  .demo-panel .demo-toolbar { gap: 8px; }
  .demo-panel__badge { margin-left: 6px; }
}
</style>
