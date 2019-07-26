module.exports = {
    title: 'Hello VuePress',
    description: 'Just playing around',
    themeConfig: {
      search: false,
      searchMaxSuggestions: 10,
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/' },
            {
              text: 'Languages',
              items: [
                { text: 'Chinese', link: '/language/chinese' },
                { text: 'Japanese', link: '/language/japanese' }
              ]
            }
        ],
        sidebar: [
          {
            title: 'Group 1',
            collapsable: false,
            children: [
              '/'
            ]
          },
          {
            title: 'Group 2',
            children: [ /* ... */ ]
          }
        ]
    }
}