module.exports = {
    title: 'Heaven',
    description: '轻量、可靠的 Vue 组件库',
    themeConfig: {
      search: false, //禁用默认的搜索框
      searchMaxSuggestions: 10, //搜索条数
      displayAllHeaders: true, //自动生成侧栏
      sidebar: 'auto',
        nav: [
            { text: '指南', link: '/guide/introduce' },
            { text: '组件', link: '/component/installation' },
        ],
        sidebar: [
          {
            title: '开发指南',
            collapsable: false,
            children: [
              '/component/installation',
              '/component/quickstart',
            ]
          },
          {
            title: '组件',
            collapsable: false,
            children: [
              '/component/button',
              '/component/icon',
              '/component/input',
              '/component/alert',
              '/component/radio',
            ]
          },
        ]
    },
    plugins: [
      // require('./enhanceApp.js')
    ]
}