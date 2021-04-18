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
              { text: "我的博客", link:"https://hjb.leheavengame.com" , target:'_blank'},
              { text: "惊觉社区", link:"https://jue.leheavengame.com" , target:'_blank'},
              { text: "惠shop好货", link:"https://cash.leheavengame.com" , target:'_blank'},
              { text: "乾学网", link: 'https://bbs.leheavengame.com', target:'_blank' },
              { text: "乐天堂游戏", link:"https://g.leheavengame.com" , target:'_blank'},
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
              '/component/alert',
              '/component/button',
              '/component/checkbox',
              '/component/icon',
              '/component/input',
              '/component/pagination',
              '/component/radio',
              '/component/rate',
              '/component/select',
            ]
          },
        ]
    },
    plugins: [
      // require('./enhanceApp.js')
    ]
}