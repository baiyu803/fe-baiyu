import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // GitHub Pages 项目站点: https://<user>.github.io/<repo>/  => base: '/<repo>/'
  // 优先使用 workflow 传入的 VITEPRESS_BASE，保证 CI 构建时链接带正确前缀
  base: '/fe-baiyu/',
  srcDir: 'src',
  title: "白宇前端",
  description: "FE-BaiYu",
  themeConfig: {
    // 右侧“本页目录”（因为你的文档大量使用 ###/####，所以把范围放宽到 2-4 级）
    outline: { level: [2, 4] },

    // 顶部搜索（本地搜索，效果类似 vitepress.dev）
    // https://vitepress.dev/reference/default-theme-search
    search: {
      provider: 'local'
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      // 默认进入“第一级第一个 md”
      { text: 'Examples', link: '/examples/markdown/a__HTML/a.1/01.SVG' },
    ],

    // 左侧分级列表（一级/二级均可展开收起）
    sidebar: {
      '/examples/markdown/': [
        {
          text: 'HTML',
          collapsed: true,
          items: [
            {
              text: '基础篇',
              collapsed: true,
              items: [
                { text: '01.SVG', link: '/examples/markdown/a__HTML/a.1/01.SVG' }
              ]
            },
            {
              text: '提问篇',
              collapsed: true,
              items: [
                { text: '01.src和href区别src和href区别', link: '/examples/markdown/a__HTML/b.1/01.src' },
                { text: '02.对HTML理解', link: '/examples/markdown/a__HTML/b.1/02.html1' }
              ]
            }
          ]
        },
        // {
        //   text: 'CSS',
        //   collapsed: true,
        //   items: [
        //     {
        //       text: '基础篇',
        //       collapsed: true,
        //       items: [
        //         { text: '01.SVG', link: '/examples/markdown/b__CSS/a.基础篇/01.SVG' }
        //       ]
        //     },
        //     {
        //       text: '提问篇',
        //       collapsed: true,
        //       items: [
        //         { text: '01.src和href区别 copy', link: '/examples/markdown/b__CSS/b.提问篇/01.src和href区别%20copy' },
        //         { text: '02.对HTML理解', link: '/examples/markdown/b__CSS/b.提问篇/02.对HTML理解' }
        //       ]
        //     }
        //   ]
        // }
      ],
      '/examples/api/': [
        { text: 'Runtime API Examples', link: '/examples/api' }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
