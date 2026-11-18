// 固定样例用于解释 MCP 的请求与响应结构，不表示社区实时内容。
const articles = [
  { _id: 'sample-vue', title: 'Vue 页面国际化接入示例', description: '提取中文、配置语言包并切换页面语言。', author: '示例作者 林', readNum: 680, url: 'https://example.invalid/articles/sample-vue' },
  { _id: 'sample-three', title: 'Three.js 场景资源清理示例', description: '检查场景卸载、事件监听和模型资源释放。', author: '示例作者 周', readNum: 520, url: 'https://example.invalid/articles/sample-three' },
  { _id: 'sample-node', title: 'Node.js MCP 工具接入示例', description: '用工具发现和 JSON-RPC 请求连接文章查询服务。', author: '示例作者 林', readNum: 350, url: 'https://example.invalid/articles/sample-node' }
];

const authors = [
  { id: 'sample-author-lin', nickname: '示例作者 林', introduce: '关注 Vue、Node.js 与工程工具。', articleNum: 2, url: 'https://example.invalid/user/sample-author-lin' },
  { id: 'sample-author-zhou', nickname: '示例作者 周', introduce: '关注 Three.js 场景开发。', articleNum: 1, url: 'https://example.invalid/user/sample-author-zhou' }
];

export function previewArticleTool(tool, keyword, searchIn, id) {
  const query = keyword.trim();
  const needle = query.toLowerCase();
  const isAuthor = tool === 'list_authors';
  let items;
  let resultData;
  let args;
  if (isAuthor) {
    items = authors.filter(item => item.nickname.toLowerCase().includes(needle));
    args = { keyword: query, page: 1, limit: 5 };
    resultData = { authors: items, returnedCount: items.length, page: 1, limit: 5, keyword: query, queryScope: '固定作者样例预览' };
  } else {
    items = articles.filter(item => {
      const text = searchIn === 'title' ? item.title : searchIn === 'description' ? item.description : item.title + ' ' + item.description;
      return text.toLowerCase().includes(needle);
    });
    args = { keyword: query, searchIn, page: 1, limit: 5 };
    resultData = { keyword: query, articles: items, pagination: { page: 1, limit: 5, total: items.length, pages: items.length ? 1 : 0 } };
  }
  const payload = { success: true, data: resultData };
  const result = { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] };
  if (isAuthor) {
    result.isError = false;
    result.structuredContent = payload;
  }
  return {
    tool,
    items,
    request: { jsonrpc: '2.0', id, method: 'tools/call', params: { name: tool, arguments: args } },
    response: { jsonrpc: '2.0', id, result }
  };
}
