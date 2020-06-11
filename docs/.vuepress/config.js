module.exports = {
    title: 'Heaven',
    description: '轻量、可靠的 Vue 组件库',
    themeConfig: {
      search: false, //禁用默认的搜索框
      globalLayout: '/components/layout/GlobalLayout.vue',
      searchMaxSuggestions: 10, //搜索条数
      displayAllHeaders: true, //自动生成侧栏
      sidebar: 'auto',
        nav: [
            { text: '指南', link: '/guide/introduce' },
            { text: '组件', link: '/component/installation' },
            { text: '其他', items: [ 
              { text: "惊觉社区", link:"http://jue.leheavengame.com" , target:'_blank'},
              { text: "乐天堂游戏", link:"http://g.leheavengame.com" , target:'_blank'},
              { text: "惠shop好货", link:"http://cash.leheavengame.com" , target:'_blank'},
              { text: "乾学网", link: 'http://www.leheavengame.com', target:'_blank' },
              ]
            },
            { text: 'Github', link: 'https://github.com/hujinbin/Heaven-UI', target:'_blank' },
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