<template>
  <DemoPanel title="文章 MCP 工具预览" description="示例数据预览。选择工具并修改参数，查看对应的 JSON-RPC 请求与返回结构。真实搜索需部署 MCP 服务。">
    <div class="mcp-demo">
      <form class="mcp-demo-form" @submit.prevent="runPreview">
        <label>
          <span>工具</span>
          <select v-model="tool" aria-label="工具" @change="changeTool">
            <option value="search_articles_by_keyword">搜索文章</option>
            <option value="list_authors">查询作者</option>
          </select>
        </label>
        <label class="mcp-demo-keyword">
          <span>{{ isAuthor ? '作者昵称关键词' : '文章搜索词' }}</span>
          <input
            v-model="keyword"
            :placeholder="isAuthor ? '留空查看全部示例作者' : '例如 Vue、Three.js、Node.js'"
            :required="!isAuthor"
            maxlength="100"
          >
        </label>
        <label v-if="!isAuthor">
          <span>搜索范围</span>
          <select v-model="searchIn" aria-label="搜索范围">
            <option value="both">标题与描述</option>
            <option value="title">仅标题</option>
            <option value="description">仅描述</option>
          </select>
        </label>
        <button class="mcp-demo-submit" type="submit">预览调用</button>
      </form>

      <div class="mcp-demo-suggestions">
        <span>试试</span>
        <button v-for="word in suggestions" :key="word.label" type="button" @click="useSuggestion(word.value)">{{ word.label }}</button>
      </div>

      <div class="mcp-demo-results" aria-live="polite">
        <p class="mcp-demo-result-label">{{ preview.items.length }} {{ preview.tool === 'list_authors' ? '位示例作者' : '篇示例文章' }}</p>
        <div v-if="preview.items.length" class="mcp-demo-cards">
          <article v-for="item in preview.items" :key="item._id || item.id" class="mcp-demo-card">
            <h4>{{ item.title || item.nickname }}</h4>
            <p>{{ item.description || item.introduce }}</p>
            <div class="mcp-demo-meta">
              <span>{{ item.author || '固定作者样例' }}</span>
              <span>{{ item.readNum !== undefined ? item.readNum + ' 次示例阅读' : item.articleNum + ' 篇示例文章' }}</span>
            </div>
          </article>
        </div>
        <p v-else class="mcp-demo-empty">当前固定样例没有匹配项，可以修改关键词再试。</p>
      </div>

      <div class="mcp-demo-json">
        <details open>
          <summary>请求 JSON</summary>
          <pre tabindex="0" aria-label="MCP 请求 JSON"><code>{{ requestJson }}</code></pre>
        </details>
        <details>
          <summary>样例返回 JSON</summary>
          <pre tabindex="0" aria-label="MCP 样例返回 JSON"><code>{{ responseJson }}</code></pre>
        </details>
      </div>
      <p class="mcp-demo-note">文章、作者、阅读量与 example.invalid 地址均为固定示例。展开返回 JSON，可查看 content[0].text 中的业务数据。</p>
    </div>
  </DemoPanel>
</template>

<script>
import DemoPanel from '../DemoPanel.vue';
import { previewArticleTool } from './ArticleMcpData';

export default {
  components: { DemoPanel },
  data() {
    return {
      tool: 'search_articles_by_keyword',
      keyword: 'Vue',
      searchIn: 'both',
      requestId: 1,
      preview: previewArticleTool('search_articles_by_keyword', 'Vue', 'both', 1)
    };
  },
  computed: {
    isAuthor() { return this.tool === 'list_authors'; },
    suggestions() {
      return this.isAuthor
        ? [{ label: '全部示例作者', value: '' }, { label: '林', value: '林' }]
        : [{ label: 'Vue', value: 'Vue' }, { label: 'Three.js', value: 'Three.js' }, { label: 'Node.js', value: 'Node.js' }];
    },
    requestJson() { return JSON.stringify(this.preview.request, null, 2); },
    responseJson() { return JSON.stringify(this.preview.response, null, 2); }
  },
  methods: {
    runPreview() {
      if (!this.isAuthor && !this.keyword.trim()) return;
      this.preview = previewArticleTool(this.tool, this.keyword, this.searchIn, ++this.requestId);
    },
    changeTool() {
      this.keyword = this.isAuthor ? '' : 'Vue';
      this.runPreview();
    },
    useSuggestion(value) {
      this.keyword = value;
      this.runPreview();
    }
  }
};
</script>

<style scoped>
.mcp-demo { color: #30483c; }
.mcp-demo-form { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px; }
.mcp-demo-form label { display: flex; flex-direction: column; gap: 7px; font-size: 12px; font-weight: 600; }
.mcp-demo-keyword { flex: 1 1 180px; }
.mcp-demo-form input, .mcp-demo-form select { box-sizing: border-box; width: 100%; min-height: 40px; padding: 9px 10px; border: 1px solid #cbd8cf; border-radius: 6px; background: #fff; color: #30483c; font: inherit; font-size: 13px; }
.mcp-demo-form input:focus, .mcp-demo-form select:focus { outline: 2px solid #b7ddc9; outline-offset: 1px; border-color: #3eaf7c; }
.mcp-demo-submit { min-height: 40px; padding: 9px 15px; border: 1px solid #278663; border-radius: 6px; background: #278663; color: #fff; font: inherit; font-size: 13px; cursor: pointer; }
.mcp-demo-submit:hover { background: #1e6c50; }
.mcp-demo button:focus-visible { outline: 3px solid #a9d8c0; outline-offset: 3px; }
.mcp-demo-suggestions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 12px; color: #718375; font-size: 12px; }
.mcp-demo-suggestions button { padding: 4px 9px; border: 1px solid #dce6df; border-radius: 5px; background: #f4f8f5; color: #327956; font: inherit; cursor: pointer; }
.mcp-demo-result-label { margin: 22px 0 11px; color: #536e5c; font-size: 12px; }
.mcp-demo-cards { display: grid; gap: 10px; }
.mcp-demo-card { padding: 16px 18px; border: 1px solid #e0e8e2; border-left: 3px solid #72b493; border-radius: 6px; background: #fbfdfb; }
.mcp-demo-card h4 { margin: 0 0 7px; color: #284435; font-size: 15px; line-height: 1.6; }
.mcp-demo-card p { margin: 0 0 12px; color: #657c6b; font-size: 13px; line-height: 1.7; }
.mcp-demo-meta { display: flex; flex-wrap: wrap; gap: 8px 20px; color: #84958a; font-size: 11px; }
.mcp-demo-empty { padding: 24px; border: 1px dashed #cddbd1; border-radius: 6px; color: #6b8072; text-align: center; font-size: 13px; }
.mcp-demo-json { display: grid; gap: 10px; margin-top: 18px; }
.mcp-demo-json details { overflow: hidden; border: 1px solid #dce6df; border-radius: 6px; }
.mcp-demo-json summary { padding: 11px 14px; background: #f2f6f3; color: #425f4d; font-size: 12px; font-weight: 600; cursor: pointer; }
.mcp-demo-json pre { box-sizing: border-box; max-height: 300px; margin: 0; padding: 16px; overflow: auto; border-radius: 0; background: #23362c; font-size: 11px; line-height: 1.7; }
.mcp-demo-json code { padding: 0; background: transparent; color: #d9ebdf; font-size: inherit; white-space: pre; }
.mcp-demo-note { margin: 13px 0 0; color: #829088; font-size: 11px; line-height: 1.7; }
@media (max-width: 500px) { .mcp-demo-form label { flex: 1 1 100%; } .mcp-demo-submit { width: 100%; } .mcp-demo-card { padding: 13px; } }
</style>
