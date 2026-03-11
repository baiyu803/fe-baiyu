import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "白宇前端",
  base: "/fe-baiyu/",
  description: "一个卷又卷不赢，躺又躺不平的前端人自述",
  markdown: {
    theme: {
      light: 'github-dark',
      dark: 'github-dark'
    }
  },
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
      { text: '知识点', link: '/knowledge/introduce' },
      { text: '文档笔记', link: '/official-docs/introduce' }
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
      ],
      '/official-docs/': [
        {
          text: 'Vue3 文档笔记',
          collapsed: true,
          items: [
            { text: '基础', link: '/official-docs/a_vue3/01_basic' },
            { text: '深入组件', link: '/official-docs/a_vue3/02_deep_component' },
            { text: '逻辑复用', link: '/official-docs/a_vue3/03_logic_reuse' },
            { text: '内置组件', link: '/official-docs/a_vue3/04_builtin_component' },
            { text: 'TypeScript', link: '/official-docs/a_vue3/05_typescript' },
            { text: '进阶主题', link: '/official-docs/a_vue3/06_advanced_topic' }
          ]
        },
        {
          text: 'Vue-Router 文档笔记',
          collapsed: true,
          items: [
            { text: '基础', link: '/official-docs/b_vue_router/01_basic' },
            { text: '进阶', link: '/official-docs/b_vue_router/02_advanced'}
          ]
        },
        {
          text: 'Pinia 文档笔记',
          collapsed: true,
          items: [
            { text: '介绍', link: '/official-docs/c_pinia/01_introduce' },
            { text: '核心概念', link: '/official-docs/c_pinia/02_core_concept' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/baiyu803/fe-baiyu' }
    ]
  }
})
