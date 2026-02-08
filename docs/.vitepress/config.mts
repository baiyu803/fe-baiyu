import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "fe baiyu",
  base: "/fe-baiyu/",
  description: "fe baiyu",
  themeConfig: {
    outline: { level: [2, 4] },
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: '知识点', link: '/knowledge/introduce' }
    ],

    sidebar: {
      '/knowledge/': [
        {
          text: 'HTML',
          items: [
            {
              text: '基础篇',
              items: [
                { text: 'SVG', link: '/knowledge/a_html/basic/01_SVG' }
              ]
            },
            {
              text: '提问篇',
              items: [
                { text: 'src和href区别', link: '/knowledge/a_html/question/01_src_href' },
                { text: '对HTML语义化的理解', link: '/knowledge/a_html/question/02_html_semantic' }
              ]
            }
          ]
        },
        {
          text: 'CSS',
          items: [
            {
              text: '基础篇',
              items: [
                { text: '琐碎知识', link: '/knowledge/b_css/basic/01_trivial' }
              ]
            }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
