// 所有请求适配和控件都运行在独立 iframe 内，避免影响文档站。
function startDemo() {
  let agent;
  let theme = 'light';
  const encoder = new TextEncoder();
  const themeButton = document.querySelector('[data-theme]');
  const status = document.querySelector('[data-status]');
  const answers = {
    i18n: '### Vue 国际化接入示例\n\n1. 使用 `npx i18n generate src` 提取中文。\n2. 完成人工翻译并配置语言资源。\n3. 在项目中接入对应的构建插件。\n\n这是文档内的本地示例回复。你可以继续提问，体验流式文字、Markdown 展示和停止生成。实际项目需要连接自己的 AI 后端。',
    theme: '### 主题与生命周期\n\n初始化时传入 `theme: "light"` 或 `theme: "dark"` 即可选择主题。\n\n在 React 的 `useEffect` 或 Vue 的挂载生命周期中创建实例，卸载时调用 `agent.destroy()`。\n\n上方的切换主题按钮会重新创建演示实例，重置对话可以清空当前内容。',
    general: '### 你好，我是文档演示助手\n\n这里正在运行真实的 **ai-agent-plugin** 对话组件。\n\n- 可以发送问题并观察流式回复。\n- 生成中点击“停止”，可以保留已收到的文字。\n- 关闭后点击右下角按钮，可以重新打开对话。\n\n这段内容由本地示例提供。试试输入“如何接入国际化”或“如何设置主题”。'
  };

  // 仅适配当前演示的两条接口，浏览器不会请求模型服务。
  window.fetch = async function demoFetch(input, options = {}) {
    const url = new URL(typeof input === 'string' ? input : input.url);
    if (url.origin !== 'https://docs-demo.invalid') {
      throw new Error('演示仅提供本地示例接口');
    }
    const signal = options.signal;
    if (signal && signal.aborted) throw new DOMException('请求已取消', 'AbortError');
    const body = JSON.parse(options.body || '{}');
    const userMessages = (body.messages || []).filter(message => message.role === 'user');
    const question = body.content || (userMessages.length ? userMessages[userMessages.length - 1].content : '');
    const answer = /国际化|i18n|语言/.test(question)
      ? answers.i18n
      : /主题|theme|生命周期/.test(question) ? answers.theme : answers.general;

    if (url.pathname === '/api/ai/chat/completion') {
      return new Response(JSON.stringify({ code: 200, data: { choices: [{ message: { content: answer } }] } }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (url.pathname !== '/api/ai/chat/stream') throw new Error('演示接口不存在');

    let stop = () => {};
    const stream = new ReadableStream({
      start(controller) {
        const chunks = answer.match(/[\s\S]{1,7}/g) || [];
        let index = 0;
        let timer;
        let closed = false;
        const send = (event, value) => controller.enqueue(encoder.encode('event: ' + event + '\ndata: ' + JSON.stringify(value) + '\n\n'));
        const cleanup = () => {
          clearTimeout(timer);
          if (signal) signal.removeEventListener('abort', abort);
        };
        const abort = () => {
          if (closed) return;
          closed = true;
          cleanup();
          controller.error(new DOMException('请求已取消', 'AbortError'));
          status.textContent = '生成已停止，可以继续提问';
        };
        stop = () => { closed = true; cleanup(); };
        if (signal) signal.addEventListener('abort', abort, { once: true });
        status.textContent = '正在逐片显示本地示例回复';
        send('stage', { message: '读取本地示例回复' });
        const tick = () => {
          if (closed) return;
          if (index < chunks.length) {
            send('message', { content: chunks[index++] });
            timer = setTimeout(tick, 140);
          } else {
            send('done', {});
            closed = true;
            cleanup();
            controller.close();
            status.textContent = '示例回复完成，可以追问或重置';
          }
        };
        timer = setTimeout(tick, 180);
      },
      cancel() { stop(); }
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
  };

  function createAgent() {
    if (agent) agent.destroy();
    document.body.dataset.theme = theme;
    agent = new window.AIAgent({
      host: 'https://docs-demo.invalid',
      secret: 'local-demo',
      title: '文档助手',
      placeholder: '试试“如何接入国际化”',
      stream: true,
      usingContext: true,
      search: false,
      theme,
      colors: { primary: '#278663', primaryHover: '#1e6c50' }
    });
    document.querySelector('.ai-agent-subtitle').textContent = '交互演示 · 本地示例回复';
    document.querySelector('.ai-agent-welcome p').textContent = '发送问题，体验流式回复与 Markdown 展示。';
    themeButton.textContent = theme === 'light' ? '切换深色' : '切换浅色';
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    status.textContent = '已准备好，可直接在对话框内输入';
    agent.togglePanel();
  }

  document.querySelector('[data-reset]').addEventListener('click', createAgent);
  themeButton.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    createAgent();
  });
  document.querySelector('[data-question]').addEventListener('click', () => {
    if (document.querySelector('.ai-agent-btn').getAttribute('aria-expanded') !== 'true') agent.togglePanel();
    agent.sendMessage('如何接入国际化？');
  });
  createAgent();
  window.addEventListener('pagehide', () => agent.destroy(), { once: true });
}

startDemo();
