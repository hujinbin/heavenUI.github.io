<template>
  <DemoPanel title="AI 对话交互演示" description="直接发送问题，体验真实插件的流式回复、停止生成与主题切换。回复由本地示例提供。">
    <iframe
      v-if="frameDocument"
      class="agent-demo-frame"
      title="AI Agent 本地交互演示"
      sandbox="allow-scripts"
      :srcdoc="frameDocument"
    />
    <p v-else class="agent-demo-loading" role="status">正在准备交互演示…</p>
  </DemoPanel>
</template>

<script>
import DemoPanel from '../DemoPanel.vue';
import agentSource from '!!raw-loader!ai-agent-plugin/dist/ai-agent.min.js';
import { createAIAgentFrame } from './AIAgentFrame';

export default {
  components: { DemoPanel },
  data() {
    return { frameDocument: '' };
  },
  mounted() {
    this.frameDocument = createAIAgentFrame(agentSource);
  }
};
</script>

<style scoped>
.agent-demo-frame {
  display: block;
  width: 100%;
  height: 660px;
  border: 1px solid #dce5df;
  border-radius: 10px;
}
.agent-demo-loading {
  padding: 24px;
  color: #667a6d;
}
</style>
