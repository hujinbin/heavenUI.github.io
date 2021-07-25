module.exports = {
  title: "Heaven",
  description: "轻量、可靠的 Vue 组件库",
  themeConfig: {
    search: false, //禁用默认的搜索框
    globalLayout: "/components/layout/GlobalLayout.vue",
    searchMaxSuggestions: 10, //搜索条数
    displayAllHeaders: true, //自动生成侧栏
    sidebar: "auto",
    nav: [{
        text: "指南",
        link: "/guide/introduce"
      },
      {
        text: "组件",
        link: "/component/installation",
      },
      {
        text: "其他插件",
        link: "/document/calendar"
      },
      {
        text: "友链",
        items: [{
            text: "淘宝店",
            link: "https://shop266766986.taobao.com/?spm=a230r.7195193.1997079397.44.nqV10Q",
            target: "_blank",
          },
          {
            text: "我的博客",
            link: "https://hjb.leheavengame.com",
            target: "_blank",
          },
          {
            text: "惊觉社区",
            link: "https://jue.leheavengame.com",
            target: "_blank",
          },
          {
            text: "惠shop好货",
            link: "https://cash.leheavengame.com",
            target: "_blank",
          },
          {
            text: "乾学网",
            link: "https://bbs.leheavengame.com",
            target: "_blank",
          },
        ],
      },
      {
        text: "Github",
        link: "https://github.com/hujinbin/Heaven-UI",
        target: "_blank",
      },
    ],
    sidebar:{
      '/guide':[
        {
          title: "介绍",
          collapsable: false,
          children: ["/guide/introduce.md"],
        },
      ],
      '/component':
      [{
        title: "开发指南",
        collapsable: false,
        children: ["/component/installation", "/component/quickstart"],
      },
      {
        title: "组件",
        collapsable: false,
        children: [
          "/component/alert",
          "/component/button",
          "/component/checkbox",
          "/component/icon",
          "/component/input",
          "/component/pagination",
          "/component/radio",
          "/component/rate",
          "/component/select",
        ],
      },
      
    ],
    '/document':[
      {
        title: "其他插件",
        collapsable: false,
        children: [
          "/document/calendar",
          "/document/infinitescroll",
          "/document/pullrefresh",
        ]
      },
    ]
    }, 
  },
  head: [
    // <!--百度统计代码-->
    [
      "script",
      {},
      `
      var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?1a6036ed362b2ca3cc01da62da664b79";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
    `,
    ],
    // <!--百度站长自动推送-->
    [
      "script",
      {},
      `
      (function(){
        var bp = document.createElement('script');
        var curProtocol = window.location.protocol.split(':')[0];
        if (curProtocol === 'https') {
            bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
        }
        else {
            bp.src = 'http://push.zhanzhang.baidu.com/push.js';
        }
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(bp, s);
    })();
    `,
    ],
    [
      "script",
      {
        'data-ad-client': 'ca-pub-7979174285252748',
        async: true,
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      }
    ],
  ],
  plugins: [
    // require('./enhanceApp.js')
  ],
};