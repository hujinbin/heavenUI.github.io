<template>
  <div class="tree-demos">
    <p v-if="loadError" class="demo-result" role="alert">{{ loadError }}</p>
    <p v-else-if="!treeComponent" class="demo-muted" role="status">正在加载树组件…</p>

    <template v-else>
      <DemoPanel title="展开、勾选与筛选" description="点击箭头展开目录，勾选复选框，或输入关键字查找节点。">
        <div class="demo-toolbar">
          <label class="demo-field">
            <span>筛选节点</span>
            <input v-model="filterText" type="search" aria-label="筛选节点" placeholder="试试 Vue 或构建" @input="filterTree" />
          </label>
          <button type="button" @click="selectBuildTools">勾选构建工具</button>
          <button type="button" @click="resetBasic">重置</button>
        </div>
        <div class="tree-surface tree-basic">
          <component
            :is="treeComponent"
            ref="basicTree"
            :data="basicData"
            :props="nodeProps"
            node-key="id"
            :default-expanded-keys="['frontend']"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            :item-size="32"
            show-checkbox
            highlight-current
            @node-click="handleBasicClick"
            @check="refreshChecked"
          />
        </div>
        <div class="demo-result" aria-live="polite">
          <p><strong>点击节点</strong> {{ clickedLabel || '尚未点击' }}</p>
          <p><strong>已勾选叶节点</strong> {{ checkedLabels.length ? checkedLabels.join('、') : '暂无' }}</p>
        </div>
      </DemoPanel>

      <DemoPanel title="大数据虚拟滚动" description="切换数据量，再滚动树或定位首尾条目。固定高度让组件启用虚拟滚动。">
        <div class="demo-toolbar">
          <label class="demo-field">
            <span>叶节点数量</span>
            <select v-model.number="largeCount" aria-label="叶节点数量" :disabled="generating" @change="regenerateLargeTree">
              <option :value="1000">1,000 条</option>
              <option :value="10000">10,000 条</option>
            </select>
          </label>
          <button type="button" :disabled="generating" @click="jumpToItem(false)">定位首条</button>
          <button type="button" :disabled="generating" @click="jumpToItem(true)">定位末条</button>
        </div>
        <div class="tree-surface" :aria-busy="generating ? 'true' : 'false'">
          <component
            :is="treeComponent"
            :key="largeVersion"
            ref="largeTree"
            :data="largeData"
            :props="nodeProps"
            node-key="id"
            height="320px"
            :item-size="32"
            :expand-on-click-node="false"
            default-expand-all
            highlight-current
            @node-click="handleLargeClick"
          />
        </div>
        <div class="demo-result" aria-live="polite">
          <p>{{ generating ? '正在生成数据…' : largeSummary }}</p>
          <p><strong>当前条目</strong> {{ largeClickedLabel || '点击树中的条目查看' }}</p>
        </div>
      </DemoPanel>

      <DemoPanel title="目录懒加载与分页" description="展开文章目录，向下滚动继续加载。每页 20 条，共 120 条，数据在本页模拟生成。">
        <div class="demo-toolbar">
          <button type="button" @click="resetLazyTree">重新加载</button>
          <span class="demo-muted" role="status">{{ lazyLoading ? '正在加载下一页…' : '已加载 ' + lazyLoaded + ' / 120 条' }}</span>
        </div>
        <div class="tree-surface">
          <component
            :is="treeComponent"
            :key="lazyVersion"
            ref="lazyTree"
            :data="lazyData"
            :props="lazyProps"
            node-key="id"
            height="256px"
            :item-size="32"
            :page-size="lazyPageSize"
            :load="loadLazyNodes"
            :expand-on-click-node="false"
            lazy
          />
        </div>
        <div class="demo-result" aria-live="polite">
          <p><strong>最近请求</strong> {{ lazyRequests.length ? lazyRequests.join(' → ') : '展开文章目录以加载第一页' }}</p>
        </div>
      </DemoPanel>
    </template>
  </div>
</template>

<script>
import DemoPanel from '../DemoPanel.vue';
import 'big-data-tree/lib/index.css';

function createLargeData(count) {
  const groupSize = count / 10;
  return Array.from({ length: 10 }, (_, groupIndex) => ({
    id: 'group-' + groupIndex,
    label: '资源目录 ' + String(groupIndex + 1).padStart(2, '0'),
    children: Array.from({ length: groupSize }, (_, itemIndex) => {
      const number = groupIndex * groupSize + itemIndex + 1;
      return {
        id: 'item-' + number,
        label: '资源条目 ' + String(number).padStart(5, '0')
      };
    })
  }));
}

export default {
  name: 'BigDataTreeDemo',
  components: { DemoPanel },
  data() {
    return {
      treeComponent: null,
      loadError: '',
      filterText: '',
      clickedLabel: '',
      checkedLabels: [],
      nodeProps: { label: 'label', children: 'children' },
      basicData: [
        {
          id: 'frontend',
          label: '前端工程',
          children: [
            { id: 'vue', label: 'Vue 组件', children: [{ id: 'button', label: 'Button 按钮' }, { id: 'tree', label: 'Tree 树形控件' }] },
            { id: 'build', label: '构建工具', children: [{ id: 'webpack', label: 'Webpack 国际化' }, { id: 'vite', label: 'Vite 插件' }] }
          ]
        },
        {
          id: 'agent',
          label: 'AI 与工具',
          children: [{ id: 'chat', label: 'AI Agent 对话' }, { id: 'articles', label: 'MCP 文章查询' }]
        },
        {
          id: 'desktop',
          label: '三维与桌面',
          children: [{ id: 'web3d', label: 'Web3D 场景' }, { id: 'electron', label: 'Electron 应用' }]
        }
      ],
      largeCount: 1000,
      largeData: createLargeData(1000),
      largeVersion: 0,
      largeClickedLabel: '',
      generating: false,
      lazyVersion: 0,
      lazyData: [],
      lazyPageSize: 20,
      lazyLoaded: 0,
      lazyLoading: false,
      lazyRequests: [],
      lazyProps: { label: 'label', children: 'children', isLeaf: 'isLeaf' }
    };
  },
  computed: {
    largeSummary() {
      return '已生成 ' + this.largeCount.toLocaleString() + ' 条叶节点及 10 个目录，滚动区域高 320px。';
    }
  },
  created() {
    this.lazyTimers = [];
    this.generateTimer = null;
    this.demoDestroyed = false;
  },
  async mounted() {
    try {
      // 发布包使用浏览器 UMD，挂载后加载以兼容文档站服务端渲染
      const module = await import('big-data-tree');
      const exported = module.default || module;
      if (!this.demoDestroyed) this.treeComponent = exported.default || exported;
    } catch (error) {
      if (!this.demoDestroyed) this.loadError = '树组件加载失败，请刷新页面重试。';
    }
  },
  beforeDestroy() {
    this.demoDestroyed = true;
    this.clearLazyTimers();
    clearTimeout(this.generateTimer);
  },
  methods: {
    filterNode(value, data) {
      return !value || data.label.toLowerCase().includes(value.toLowerCase());
    },
    filterTree() {
      this.$refs.basicTree.filter(this.filterText.trim());
    },
    handleBasicClick(data) {
      this.clickedLabel = data.label;
    },
    refreshChecked() {
      this.checkedLabels = this.$refs.basicTree.getCheckedNodes(true).map(node => node.label);
    },
    selectBuildTools() {
      this.$refs.basicTree.setCheckedKeys(['webpack', 'vite']);
      this.$refs.basicTree.getNode('build').expand(null, true);
      this.refreshChecked();
    },
    resetBasic() {
      this.filterText = '';
      this.clickedLabel = '';
      this.$refs.basicTree.filter('');
      this.$refs.basicTree.setCheckedKeys([]);
      this.$refs.basicTree.setCurrentKey(null);
      this.refreshChecked();
    },
    regenerateLargeTree() {
      this.generating = true;
      this.largeClickedLabel = '';
      // 先让加载状态渲染，再创建本次选择的数据量
      this.generateTimer = setTimeout(() => {
        this.largeData = createLargeData(this.largeCount);
        this.largeVersion += 1;
        this.$nextTick(() => { this.generating = false; });
      }, 30);
    },
    jumpToItem(last) {
      const key = 'item-' + (last ? this.largeCount : 1);
      this.$refs.largeTree.setCurrentKey(key);
      this.$refs.largeTree.scrollToItem(key);
      this.largeClickedLabel = this.$refs.largeTree.getNode(key).label;
    },
    handleLargeClick(data) {
      this.largeClickedLabel = data.label;
    },
    loadLazyNodes(node, resolve) {
      if (node.level === 0) {
        return resolve([{ id: 'article-root', label: '文章目录（120 篇）', total: 120, isLeaf: false }]);
      }
      if (node.data.isLeaf) return resolve([]);

      const page = node.page || 1;
      const version = this.lazyVersion;
      const start = (page - 1) * this.lazyPageSize;
      const end = Math.min(start + this.lazyPageSize, node.data.total);
      this.lazyLoading = true;
      const timer = setTimeout(() => {
        if (version !== this.lazyVersion || this.demoDestroyed) return;
        const children = Array.from({ length: Math.max(0, end - start) }, (_, index) => ({
          id: 'article-' + (start + index + 1),
          label: '示例文章 ' + String(start + index + 1).padStart(3, '0'),
          isLeaf: true
        }));
        // 页码由组件维护，只返回当前页，组件负责追加到已有子节点
        node.offset = Math.max(node.offset, end);
        resolve(children);
        this.lazyLoaded = Math.max(this.lazyLoaded, end);
        this.lazyLoading = false;
        this.lazyRequests = this.lazyRequests.concat('第 ' + page + ' 页（' + children.length + ' 条）').slice(-4);
      }, 250);
      this.lazyTimers.push(timer);
    },
    clearLazyTimers() {
      this.lazyTimers.forEach(timer => clearTimeout(timer));
      this.lazyTimers = [];
    },
    resetLazyTree() {
      this.clearLazyTimers();
      this.lazyVersion += 1;
      this.lazyLoaded = 0;
      this.lazyLoading = false;
      this.lazyRequests = [];
    }
  }
};
</script>

<style scoped>
.tree-demos {
  margin: 1.5rem 0 2rem;
}
.tree-surface {
  overflow: hidden;
  padding: 10px 8px;
  border: 1px solid #e4ebe8;
  border-radius: 8px;
  background: #fff;
}
.tree-basic {
  min-height: 210px;
  max-height: 400px;
  overflow-y: auto;
}
.tree-demos >>> .el-tree-node__label {
  overflow: hidden;
  text-overflow: ellipsis;
}
.tree-demos >>> .el-tree-node__content {
  border-radius: 4px;
}
.tree-demos >>> .el-tree-node__content:hover {
  background: #f1f7f4;
}
.tree-demos >>> .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background: #e9f5ee;
  color: #277a53;
}
.tree-demos .demo-result p {
  margin: 0.25rem 0;
  overflow-wrap: anywhere;
}
.tree-demos .demo-result strong {
  margin-right: 0.5rem;
}
</style>
