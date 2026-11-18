<template>
  <DemoPanel :title="isHeaven ? '创建工程命令' : 'Web3D Agent 命令'" description="命令预览，未在浏览器执行。调整选项后，将生成的命令复制到本机终端。">
    <div class="cli-preview">
      <div class="cli-preview-fields">
        <label>
          <span>{{ isHeaven ? '项目名称' : '项目目录' }}</span>
          <input v-model.trim="projectName" type="text" maxlength="48" spellcheck="false" :aria-invalid="String(Boolean(projectError))" placeholder="my-project">
        </label>
        <label v-if="isHeaven">
          <span>工程模板</span>
          <select v-model="templateName">
            <option v-for="item in templates" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </label>
        <label v-else>
          <span>运行模式</span>
          <select v-model="mode">
            <option value="plan">plan · 只读规划</option>
            <option value="ask">ask · 操作前询问</option>
            <option value="auto-edit">auto-edit · 自动编辑</option>
            <option value="demo">demo · 本机离线脚本</option>
          </select>
        </label>
      </div>
      <p v-if="projectError" class="cli-preview-error" role="alert">{{ projectError }}</p>
      <p v-if="isHeaven" class="cli-preview-description">{{ selectedTemplate.description }}</p>
      <div v-else class="cli-preview-task">
        <label>
          <span>任务</span>
          <textarea v-model.trim="task" rows="3" maxlength="500" />
        </label>
        <p>{{ modeDescription }}</p>
      </div>
      <div class="cli-preview-output">
        <div class="cli-preview-command">
          <div class="cli-preview-output-header">
            <span>{{ isHeaven ? '本机终端命令' : 'PowerShell 命令' }}</span>
            <button type="button" :disabled="!valid" @click="copyCommand">{{ copyStatus || '复制命令' }}</button>
          </div>
          <pre tabindex="0" aria-label="生成的命令"><code>{{ valid ? command : '填写有效的项目名称和任务后生成命令。' }}</code></pre>
        </div>
        <div class="cli-preview-tree">
          <strong>{{ isHeaven ? '模板主要文件' : 'init 创建的文件' }}</strong>
          <pre tabindex="0" aria-label="工程目录预览"><code>{{ treePreview }}</code></pre>
        </div>
      </div>
      <div v-if="!isHeaven" class="cli-preview-expectation">
        <strong>{{ mode === 'demo' ? '本机离线演示流程' : '执行后查看' }}</strong>
        <p>{{ mode === 'demo' ? 'list_files → check_project → 固定脚本汇总。工具读取的文件和诊断结果由目标工程决定。' : '在终端核对工具调用、实际文件差异与检查结果，会话保存在目标项目的 .web3d-agent/sessions/。' }}</p>
      </div>
      <p v-else class="cli-preview-footnote">模板内容以仓库为准。下载后使用 npm run 查看该模板提供的脚本。</p>
    </div>
  </DemoPanel>
</template>

<script>
import DemoPanel from '../DemoPanel.vue';

const TEMPLATES = [
  { value: 'vue', label: 'Vue 前端工程', description: 'Vue CLI 与 Webpack 工程骨架。', entries: ['build/', 'config/', 'src/', 'static/', 'package.json'] },
  { value: 'koa-react', label: 'Koa + React SSR', description: 'Koa 服务端与 React SSR 工程，数据库连接需在本机配置。', entries: ['server/', 'package.json'] },
  { value: 'koa-vue', label: 'Koa + Vue', description: 'Koa MVC 与 Vue 单页面工程。', entries: ['config/', 'server/', 'src/', 'package.json'] },
  { value: 'vue-admin', label: 'Vue 3 后台（开发中）', description: 'Vite、Vue 3 与 TypeScript 后台模板，仓库标注为开发中。', entries: ['public/', 'src/', 'tsconfig.json', 'vite.config.ts', 'package.json'] },
  { value: 'vue-seo', label: 'Vue SEO（开发中）', description: '用于生成静态 HTML 的 Vue 模板，仓库标注为开发中。', entries: ['build/', 'config/', 'src/', 'static/', 'package.json'] },
  { value: 'microservice', label: '微前端（开发中）', description: '基于 Vite 的微前端模板，仓库标注为开发中。', entries: ['public/', 'src/', 'index.html', 'package.json'] },
];

export default {
  components: { DemoPanel },
  props: {
    variant: { type: String, default: 'heaven', validator: value => ['heaven', 'web3d'].includes(value) },
  },
  data() {
    return {
      templates: TEMPLATES,
      projectName: this.variant === 'heaven' ? 'customer-web' : 'your-web3d-project',
      templateName: 'vue',
      mode: 'plan',
      task: '检查场景初始化、模型切换和卸载流程，列出资源释放的修改计划',
      copyStatus: '',
    };
  },
  computed: {
    isHeaven() { return this.variant === 'heaven'; },
    selectedTemplate() { return this.templates.find(item => item.value === this.templateName); },
    projectError() {
      return /^[a-z][a-z0-9-]{0,47}$/.test(this.projectName)
        ? '' : '示例目录使用小写字母开头，可包含数字和短横线。';
    },
    valid() { return !this.projectError && (this.isHeaven || Boolean(this.task)); },
    command() {
      if (this.isHeaven) {
        return ['npm install -g heaven-cli-fe', `heaven init ${this.templateName} ${this.projectName}`, `cd ${this.projectName}`, 'npm install', 'npm run'].join('\n');
      }
      // PowerShell 单引号参数通过重复引号保留用户输入，预览始终按文本展示。
      const quote = value => `'${value.replace(/'/g, "''")}'`;
      const directory = quote(this.projectName);
      const options = this.mode === 'demo' ? '--demo --json' : `--mode ${this.mode}`;
      return [`web3d-agent init -C ${directory}`, `web3d-agent run ${quote(this.task)} -C ${directory} ${options}`].join('\n');
    },
    treePreview() {
      const root = this.projectError ? 'my-project' : this.projectName;
      if (!this.isHeaven) return `${root}/\n├── web3d-agent.json\n└── .web3d-agent/\n    └── rules/\n        └── project.md`;
      return `${root}/\n` + this.selectedTemplate.entries.map((entry, index, entries) => `${index === entries.length - 1 ? '└──' : '├──'} ${entry}`).join('\n');
    },
    modeDescription() {
      return {
        plan: '需要先配置模型。此模式读取项目并输出计划，保持工具操作只读。',
        ask: '需要先配置模型。修改文件和执行命令时会在终端请求批准。',
        'auto-edit': '需要先配置模型。工作区文件可自动编辑，执行命令时仍需批准。',
        demo: '本机运行固定离线脚本，无需模型接口。任务文本用于记录需求，脚本按固定顺序调用工具。',
      }[this.mode];
    },
  },
  watch: {
    command() { this.copyStatus = ''; },
  },
  methods: {
    async copyCommand() {
      try {
        await navigator.clipboard.writeText(this.command);
        this.copyStatus = '已复制';
      } catch (error) {
        this.copyStatus = '请选中命令复制';
      }
    },
  },
};
</script>

<style scoped>
.cli-preview-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.cli-preview label { display: block; min-width: 0; }
.cli-preview label > span { display: block; margin-bottom: 7px; color: #435d4e; font-size: 13px; font-weight: 600; }
.cli-preview input, .cli-preview select, .cli-preview textarea { box-sizing: border-box; width: 100%; padding: 9px 11px; border: 1px solid #cfded5; border-radius: 6px; background: #fff; color: #2b4536; font: inherit; font-size: 14px; }
.cli-preview textarea { display: block; resize: vertical; min-height: 78px; line-height: 1.6; }
.cli-preview input:focus, .cli-preview select:focus, .cli-preview textarea:focus { outline: 2px solid #74ae8d; outline-offset: 2px; }
.cli-preview-description, .cli-preview-task p, .cli-preview-footnote { margin: 12px 0 16px; color: #667b6d; font-size: 12px; line-height: 1.7; }
.cli-preview-task { margin-top: 16px; }
.cli-preview-error { margin: 8px 0; color: #a24a36; font-size: 12px; }
.cli-preview-output { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 14px; }
.cli-preview-command { min-width: 0; overflow: hidden; border-radius: 8px; background: #142c26; }
.cli-preview-output-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 11px 14px; border-bottom: 1px solid #2d443b; color: #9bb9aa; font-size: 12px; }
.cli-preview-output-header button { padding: 5px 9px; border: 1px solid #476657; border-radius: 4px; background: transparent; color: #deece3; font: inherit; font-size: 12px; cursor: pointer; }
.cli-preview-output-header button:hover { background: #274638; }
.cli-preview-output-header button:disabled { opacity: .5; cursor: default; }
.cli-preview-output-header button:focus-visible { outline: 2px solid #b1d3bc; outline-offset: 2px; }
.cli-preview-command pre { margin: 0; padding: 16px; border-radius: 0; background: transparent; color: #d7ede0; font-size: 12px; line-height: 1.85; overflow: auto; }
.cli-preview pre code { padding: 0; background: transparent; color: inherit; font-size: inherit; }
.cli-preview-tree { min-width: 0; padding: 14px; border: 1px solid #e0e8e2; border-radius: 8px; background: #f7faf8; }
.cli-preview-tree strong { display: block; color: #57715f; font-size: 12px; font-weight: 500; }
.cli-preview-tree pre { margin: 12px 0 0; padding: 0; background: transparent; color: #48634f; font-size: 12px; line-height: 1.85; overflow: auto; }
.cli-preview-expectation { margin-top: 14px; padding: 12px 14px; border-left: 3px solid #8db59b; background: #f4f8f5; }
.cli-preview-expectation strong { color: #46614e; font-size: 13px; }
.cli-preview-expectation p { margin: 6px 0 0; color: #6a7e70; font-size: 12px; line-height: 1.7; }
.cli-preview-footnote { margin-bottom: 0; }
@media (max-width: 620px) { .cli-preview-fields, .cli-preview-output { grid-template-columns: 1fr; } }
</style>
