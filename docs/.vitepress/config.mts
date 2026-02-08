import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "白宇前端",
  base: "/fe-baiyu/",
  description: "一个卷又卷不赢，躺又躺不平的前端人自述",
  head: [
    ['link', { rel: 'icon', href: '/fe-baiyu/baiyu.ico' }],
    ['link', { rel: 'stylesheet', href: '/fe-baiyu/custom.css' }]
  ],
  themeConfig: {
    logo: '/baiyu.png',
    outline: { level: [2, 4] },
    search: {
      provider: 'local'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '知识点', link: '/knowledge/introduce' }
    ],

    sidebar: {
      '/knowledge/': [
        {
          text: 'HTML',
          collapsed: true,
          items: [
            {
              text: '基础篇',
              collapsed: true,
              items: [
                { text: 'SVG', link: '/knowledge/a_html/basic/01_SVG' }
              ]
            },
            {
              text: '提问篇',
              collapsed: true,
              items: [
                { text: 'src和href区别', link: '/knowledge/a_html/question/01_src_href' },
                { text: '对HTML语义化的理解', link: '/knowledge/a_html/question/02_html_semantic' },
                { text: 'doctype的作用', link: '/knowledge/a_html/question/03_doctype' }
              ]
            }
          ]
        },
        {
          text: 'CSS',
          collapsed: true,
          items: [
            {
              text: '基础篇',
              collapsed: true,
              items: [
                { text: '琐碎知识', link: '/knowledge/b_css/basic/01_trivial' }
              ]
            }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/baiyu803/fe-baiyu' }
    ]
  }
})
