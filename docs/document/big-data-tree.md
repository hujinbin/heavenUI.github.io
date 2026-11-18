# big-data-tree 大数据树

基于 Vue 2 的树形组件，提供展开、勾选、筛选、虚拟滚动和目录分页加载，适用于资源目录、组织结构和大量记录的层级展示。

## 页内演示

下面的演示直接使用真实 `big-data-tree` 组件，所有数据在浏览器中生成。展开目录、勾选节点、切换数据量后即可查看效果。

<ClientOnly>
  <demos-BigDataTree />
</ClientOnly>

## 安装与版本

本页演示及 API 对应 `0.0.7`，固定版本安装。

```bash
npm install big-data-tree@0.0.7
```

`0.0.7` 修复了 `0.0.6` 发布包缺少 `lib` 构建产物的问题，包含组件入口、CSS 和图标字体，并在打包前自动构建和校验。该版本依赖 Vue `2.6.11` 和 `vue-virtual-scroller ~1.0.10`，适用于 Vue 2 项目。

```js
import BigDataTree from 'big-data-tree';
import 'big-data-tree/lib/index.css';

export default {
  components: { BigDataTree }
};
```

包入口是浏览器 UMD。VuePress 等服务端渲染项目需要在客户端挂载后动态加载，并将演示放在 `ClientOnly` 中。本页的演示组件采用这种接入方式。

## 基础、筛选与勾选

使用唯一 `node-key` 标识每个节点。输入关键字后调用实例的 `filter(value)`，勾选结果通过 `getCheckedNodes(true)` 取得。

```vue
<template>
  <div>
    <input v-model="keyword" placeholder="筛选节点" @input="$refs.tree.filter(keyword)" />
    <button @click="selectBuildTools">勾选构建工具</button>
    <button @click="reset">重置</button>
    <big-data-tree
      ref="tree"
      :data="data"
      :props="props"
      node-key="id"
      :default-expanded-keys="['frontend']"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      :item-size="32"
      show-checkbox
      highlight-current
      @node-click="handleClick"
      @check="refreshChecked"
    />
    <p>点击节点 {{ clicked || '尚未点击' }}</p>
    <p>已勾选 {{ checked.join('、') || '暂无' }}</p>
  </div>
</template>

<script>
import BigDataTree from 'big-data-tree';
import 'big-data-tree/lib/index.css';

export default {
  components: { BigDataTree },
  data() {
    return {
      keyword: '',
      clicked: '',
      checked: [],
      props: { label: 'label', children: 'children' },
      data: [
        {
          id: 'frontend',
          label: '前端工程',
          children: [
            { id: 'vue', label: 'Vue 组件' },
            {
              id: 'build',
              label: '构建工具',
              children: [
                { id: 'webpack', label: 'Webpack 国际化' },
                { id: 'vite', label: 'Vite 插件' }
              ]
            }
          ]
        },
        { id: 'agent', label: 'AI Agent 对话' }
      ]
    };
  },
  methods: {
    filterNode(value, data) {
      return !value || data.label.toLowerCase().includes(value.toLowerCase());
    },
    handleClick(data) {
      this.clicked = data.label;
    },
    refreshChecked() {
      this.checked = this.$refs.tree.getCheckedNodes(true).map(node => node.label);
    },
    selectBuildTools() {
      this.$refs.tree.setCheckedKeys(['webpack', 'vite']);
      this.$refs.tree.getNode('build').expand(null, true);
      this.refreshChecked();
    },
    reset() {
      this.keyword = '';
      this.clicked = '';
      this.$refs.tree.filter('');
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.tree.setCurrentKey(null);
      this.refreshChecked();
    }
  }
};
</script>
```

## 大数据与虚拟滚动

设置明确的 `height` 后启用虚拟滚动。`item-size` 对应每行像素高度，需与节点的实际展示高度一致。下面生成 10 个目录，可切换 1,000 或 10,000 条叶节点。

```vue
<template>
  <div>
    <select v-model.number="count" @change="regenerate">
      <option :value="1000">1,000 条</option>
      <option :value="10000">10,000 条</option>
    </select>
    <button @click="$refs.tree.scrollToItem('item-' + count)">定位末条</button>
    <big-data-tree
      :key="count"
      ref="tree"
      :data="data"
      node-key="id"
      height="320px"
      :item-size="32"
      default-expand-all
    />
  </div>
</template>

<script>
import BigDataTree from 'big-data-tree';
import 'big-data-tree/lib/index.css';

function createData(count) {
  const groupSize = count / 10;
  return Array.from({ length: 10 }, (_, groupIndex) => ({
    id: 'group-' + groupIndex,
    label: '资源目录 ' + (groupIndex + 1),
    children: Array.from({ length: groupSize }, (_, itemIndex) => {
      const number = groupIndex * groupSize + itemIndex + 1;
      return { id: 'item-' + number, label: '资源条目 ' + number };
    })
  }));
}

export default {
  components: { BigDataTree },
  data() {
    return { count: 1000, data: createData(1000) };
  },
  methods: {
    regenerate() {
      this.data = createData(this.count);
    }
  }
};
</script>
```

`scrollToItem(key)` 接收节点唯一键，目标节点需要已处于展开后的可见列表中。虚拟滚动控制 DOM 渲染数量，传入的数据和节点状态仍保存在内存中。

## 懒加载与目录分页

`load` 的真实签名为 `load(node, resolve)`。初次创建树时先加载 `node.level === 0` 的根节点。展开目录后，组件再次调用此方法，并通过 `resolve(children)` 接收本次返回的子节点数组。

目录分页同时设置 `lazy`、`height` 和 `page-size`。目录数据提供 `total`，页码从 `node.page` 读取，初始为 `1`。每次只返回当前页，组件负责将后续页面追加到目录中。

```vue
<template>
  <div>
    <p>已加载 {{ loaded }} / 120 条，展开目录后向下滚动加载后续页面。</p>
    <big-data-tree
      :data="lazyData"
      node-key="id"
      :props="props"
      height="256px"
      :item-size="32"
      :page-size="pageSize"
      :load="loadNode"
      lazy
    />
  </div>
</template>

<script>
import BigDataTree from 'big-data-tree';
import 'big-data-tree/lib/index.css';

export default {
  components: { BigDataTree },
  data() {
    return {
      loaded: 0,
      lazyData: [],
      pageSize: 20,
      props: { label: 'label', children: 'children', isLeaf: 'isLeaf' }
    };
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ id: 'articles', label: '文章目录', total: 120, isLeaf: false }]);
      }
      if (node.data.isLeaf) return resolve([]);

      const start = ((node.page || 1) - 1) * this.pageSize;
      const end = Math.min(start + this.pageSize, node.data.total);
      const children = Array.from({ length: end - start }, (_, index) => ({
        id: 'article-' + (start + index + 1),
        label: '示例文章 ' + (start + index + 1),
        isLeaf: true
      }));
      // 接入后端时，在分页请求成功后更新累计数量并调用 resolve
      node.offset = end;
      this.loaded = end;
      resolve(children);
    }
  }
};
</script>
```

`page-size` 控制分页触发的滚动阈值，后端每页返回条数也应使用相同值。目录总数直接读取 `data.total`，累计加载数量可通过 `node.offset` 更新。`resolve` 必须始终接收数组，包含无子节点时的空数组。

## API




### Attributes
| 参数                  | 说明                                               | 类型                        | 可选值  | 默认值   |
| --------------------- | ---------------------------------------- | --------------------------- | ---- | ----- |
| data                  | 展示数据                                           | array                       | —    | —     |
| empty-text            | 内容为空的时候展示的文本                           | String                      | —    | —     |
| node-key              | 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的               | String                      | —    | —     |
| props                 | 配置选项，具体看下表                               | object                      | —    | —     |
| height | 设置滚动区域高度后启用虚拟滚动，推荐使用带单位的字符串，例如 `320px` | string, number | — | 0 |
| item-size | 每行节点高度，单位为像素 | number | — | 26 |
| page-size | 懒加载目录分页的滚动阈值基数，与后端每页条数保持一致 | number | — | 1000 |
| render-after-expand   | 是否在第一次展开某个树节点后才渲染其子节点         | boolean                      | —    | true |
| load                  | 加载子树数据的方法，仅当 lazy 属性为true 时生效    | function(node, resolve)     | —    | —     |
| render-content        | 树节点的内容区的渲染 Function                      | Function(h, { node, data, store })        | —    | —     |
| highlight-current     | 是否高亮当前选中节点，默认值是 false。             | boolean                     | —    | false |
| default-expand-all    | 是否默认展开所有节点                               | boolean                     | —    | false |
| expand-on-click-node  | 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。 | boolean                     | —    | true  |
| check-on-click-node   | 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。 | boolean                     | —    | false |
| auto-expand-parent    | 展开子节点的时候是否自动展开父节点                 | boolean                     | —    | true  |
| default-expanded-keys | 默认展开的节点的 key 的数组                        | array                       | —    | —     |
| show-checkbox         | 节点是否可被选择                                   | boolean                     | —    | false |
| check-strictly        | 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false   | boolean                     | —    | false |
| default-checked-keys  | 默认勾选的节点的 key 的数组                        | array                       | —    | —     |
| current-node-key      | 当前选中的节点                                   | string, number               | —    | —     |
| filter-node-method    | 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏 | Function(value, data, node) | —    | —     |
| accordion             | 是否每次只打开一个同级树节点展开                   | boolean                     | —    | false |
| indent                | 相邻级节点间的水平缩进，单位为像素                 | number                     | —    | 18 |
| icon-class            | 自定义树节点的图标                              |  string                     | -    | -     |
| lazy                  | 是否懒加载子节点，需与 load 方法结合使用           | boolean                     | —    | false |
| draggable             | 是否开启拖拽节点功能                                   | boolean            | —    | false |
| allow-drag            | 判断节点能否被拖拽                  | Function(node)  | —  | —  |
| allow-drop            | 拖拽时判定目标节点能否被放置。`type` 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后 | Function(draggingNode, dropNode, type)  | —    | —     |

### props
| 参数       | 说明                | 类型     | 可选值  | 默认值  |
| -------- | ----------------- | ------ | ---- | ---- |
| label    | 指定节点标签为节点对象的某个属性值 | string, function(data, node) | —    | —    |
| children | 指定子树为节点对象的某个属性值 | string | —    | —    |
| disabled | 指定节点选择框是否禁用为节点对象的某个属性值 | string, function(data, node) | —    | —    |
| isLeaf | 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效 | string, function(data, node) | —    | —    |

### 方法
`Tree` 内部使用了 Node 类型的对象来包装用户传入的数据，用来保存目前节点的状态。
`Tree` 拥有如下方法：

| 方法名             | 说明                                       | 参数                                       |
| --------------- | ---------------------------------------- | ---------------------------------------- |
| scrollToItem | 虚拟滚动时定位到已展开列表中的节点 | (key) 节点的唯一键 |
| getNodePath | 获取节点从根目录到当前节点的数据路径 | (key/data) 节点键或数据对象 |
| setCheckedAll | 设置所有已加载节点的勾选状态 | (checked = true) |
| filter          | 对树节点进行筛选操作                               | 接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数 |
| updateKeyChildren | 通过 keys 设置节点子元素，使用此方法必须设置 node-key 属性 | (key, data) 接收两个参数，1. 节点 key 2. 节点数据的数组 |
| getCheckedNodes | 若节点可被选择（即 `show-checkbox` 为 `true`），则返回目前被选中的节点所组成的数组 | (leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 `false` 2. 是否包含半选节点，默认值为 `false` |
| setCheckedNodes | 设置目前勾选的节点，使用此方法必须设置 node-key 属性          | (nodes, leafOnly = false) 接收勾选节点数据数组，可选择仅设置叶子节点 |
| getCheckedKeys  | 若节点可被选择（即 `show-checkbox` 为 `true`），则返回目前被选中的节点的 key 所组成的数组 | (leafOnly) 接收一个 boolean 类型的参数，若为 `true` 则仅返回被选中的叶子节点的 keys，默认值为 `false` |
| setCheckedKeys  | 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性  | (keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型的参数，若为 `true` 则仅设置叶子节点的选中状态，默认值为 `false` |
| setChecked      | 通过 key / data 设置某个节点的勾选状态，使用此方法必须设置 node-key 属性 | (key/data, checked, deep) 接收三个参数，1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中  3. boolean 类型，是否设置子节点 ，默认为 false |
| getHalfCheckedNodes | 若节点可被选择（即 `show-checkbox` 为 `true`），则返回目前半选中的节点所组成的数组  | - |
| getHalfCheckedKeys | 若节点可被选择（即 `show-checkbox` 为 `true`），则返回目前半选中的节点的 key 所组成的数组 | - |
| getCurrentKey   | 获取当前被选中节点的 key，使用此方法必须设置 node-key 属性，若没有节点被选中则返回 null | — |
| getCurrentNode  | 获取当前被选中节点的 data，若没有节点被选中则返回 null | — |
| setCurrentKey   | 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性 | (key) 待被选节点的 key，若为 null 则取消当前高亮的节点 |
| setCurrentNode  | 通过 node 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性 | (node) 待被选节点的 node |
| getNode         | 根据 data 或者 key 拿到 Tree 组件中的 node | (data) 要获得 node 的 key 或者 data |
| remove          | 删除 Tree 中的一个节点，使用此方法必须设置 node-key 属性  | (data) 要删除的节点的 data 或者 node |
| append          | 为 Tree 中的一个节点追加一个子节点 | (data, parentNode) 接收两个参数，1. 要追加的子节点的 data 2. 子节点的 parent 的 data、key 或者 node |
| insertBefore    | 为 Tree 的一个节点的前面增加一个节点  | (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的后一个节点的 data、key 或者 node |
| insertAfter     | 为 Tree 的一个节点的后面增加一个节点  | (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的前一个节点的 data、key 或者 node |

### Events

从 `0.0.5` 升级时，将旧的 `treeLoadMore` 监听名称改为 `tree-load-more`。分页仍由组件内部触发，业务代码可按需监听加载通知。

| 事件名称           | 说明             | 回调参数                                     |
| -------------- | -------------- | ---------------------------------------- |
| tree-load-more | 虚拟滚动超过半页阈值时触发 | 无参数，分页由组件内部触发 |
| node-click     | 节点被点击时的回调      | 共三个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。 |
| node-contextmenu | 当某一节点被鼠标右键点击时会触发该事件 | 共四个参数，依次为：event、传递给 `data` 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。 |
| check-change   | 节点选中状态发生变化时的回调 | 共三个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点 |
| check          | 当复选框被点击的时候触发 | 共两个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性 |
| current-change | 当前选中节点变化时触发的事件 | 共两个参数，依次为：当前节点的数据，当前节点的 Node 对象          |
| node-expand    | 节点被展开时触发的事件    | 共三个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
| node-collapse  | 节点被关闭时触发的事件    | 共三个参数，依次为：传递给 `data` 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
| node-drag-start | 节点开始拖拽时触发的事件  | 共两个参数，依次为：被拖拽节点对应的 Node、event |
| node-drag-enter | 拖拽进入其他节点时触发的事件  | 共三个参数，依次为：被拖拽节点对应的 Node、所进入节点对应的 Node、event |
| node-drag-leave | 拖拽离开某个节点时触发的事件  | 共三个参数，依次为：被拖拽节点对应的 Node、所离开节点对应的 Node、event |
| node-drag-over | 在拖拽节点时触发的事件（类似浏览器的 mouseover 事件） | 共三个参数，依次为：被拖拽节点对应的 Node、当前进入节点对应的 Node、event |
| node-drag-end  | 拖拽结束时（可能未成功）触发的事件  | 共四个参数，依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点（可能为空）、被拖拽节点的放置位置（before、after、inner）、event |
| node-drop  | 拖拽成功完成时触发的事件  | 共四个参数，依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event |

### Scoped Slot
| name | 说明 |
|------|--------|
| — | 自定义树节点的内容，参数为 { node, data } |

## 源码与版权

组件使用了 Element UI Tree 的样式和功能，并结合 vue-virtual-scroller 实现虚拟滚动，两者采用 MIT 许可证。`big-data-tree` 的 npm 元数据声明 ISC 许可证，接入和分发时保留相应版权及许可说明。

- [big-data-tree 源码](https://github.com/hujinbin/big-data-tree)
- [big-data-tree 0.0.7 发布包](https://www.npmjs.com/package/big-data-tree/v/0.0.7)
- [Element UI Tree](https://element.eleme.cn/#/zh-CN/component/tree)
- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
