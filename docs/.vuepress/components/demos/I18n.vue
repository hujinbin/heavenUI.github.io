<template>
  <DemoPanel title="国际化效果演示" badge="真实 Vue I18n 运行时" description="直接切换语言、修改姓名和任务数量。这里展示构建后的页面效果，中文提取和代码转换仍由业务项目中的 CLI / loader 完成。">
    <div class="demo-toolbar">
      <label class="demo-field">显示语言
        <select v-model="$i18n.locale" aria-label="显示语言">
          <option value="zh">简体中文</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
        </select>
      </label>
      <label class="demo-field">姓名 <input v-model="name" maxlength="24" aria-label="姓名" /></label>
      <label class="demo-field">任务数量 <input v-model.number="count" type="number" min="0" max="99" aria-label="任务数量" /></label>
    </div>
    <div class="i18n-preview" :lang="$i18n.locale" aria-live="polite">
      <span class="i18n-preview__label">PAGE PREVIEW</span>
      <strong>{{ $t('a018615b35588a01') }}</strong>
      <p>{{ $t('ab95eeae64732d39', [name || '—']) }}</p>
      <p>{{ $t('a6c78d6f94e73bfa', [safeCount]) }}</p>
    </div>
    <div class="demo-result">
      当前语言包：<code>{{ $i18n.locale }}.js</code> · 同一文案键在各语言间保持不变
      <pre>{{ activeMessages }}</pre>
    </div>
  </DemoPanel>
</template>

<script>
import DemoPanel from '../DemoPanel.vue';

const messages = {
  zh: {
    a018615b35588a01: '你好，世界',
    ab95eeae64732d39: '你好，{0}',
    a6c78d6f94e73bfa: '已完成 {0} 项任务'
  },
  en: {
    a018615b35588a01: 'Hello, world',
    ab95eeae64732d39: 'Hello, {0}',
    a6c78d6f94e73bfa: 'Completed {0} tasks'
  },
  ja: {
    a018615b35588a01: 'こんにちは、世界',
    ab95eeae64732d39: 'こんにちは、{0}さん',
    a6c78d6f94e73bfa: '{0} 件のタスクが完了しました'
  }
};

export default {
  components: { DemoPanel },
  // 使用组件自己的实例，切换语言不会影响文档站其他页面
  i18n: { locale: 'zh', fallbackLocale: 'zh', messages },
  data() { return { name: '小明', count: 3 }; },
  computed: {
    safeCount() { return Math.trunc(Math.min(99, Math.max(0, Number(this.count) || 0))); },
    activeMessages() { return JSON.stringify(messages[this.$i18n.locale], null, 2); }
  }
};
</script>

<style scoped>
.i18n-preview { padding: 26px; border: 1px solid #dde7df; border-left: 3px solid #3eaf7c; border-radius: 4px; background: #fcfdfc; }
.i18n-preview__label { display: block; margin-bottom: 14px; color: #718178; font-size: 10px; letter-spacing: .14em; }
.i18n-preview strong { display: block; font-size: 28px; font-weight: 600; line-height: 1.4; }
.i18n-preview p { margin: 12px 0 0; }
.demo-field input { width: 110px; }
.demo-field input[type=number] { width: 74px; }
</style>
