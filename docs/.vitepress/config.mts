import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // GitHub Pages 部署需要设置 base
  // - 项目站点: https://<user>.github.io/<repo>/  => base: '/<repo>/'
  // - 用户站点: https://<user>.github.io/        => base: '/'
  // 这里在 GitHub Actions 环境下自动用仓库名生成 base，本地开发仍为 '/'
  base: (() => {
    // 避免引入 Node 类型依赖（@types/node），用 globalThis 读取环境变量
    const env = (globalThis as any)?.process?.env as Record<string, string | undefined> | undefined
    const repo = env?.GITHUB_REPOSITORY
    const repoName = repo?.split('/')[1]
    const isGA = Boolean(env?.GITHUB_ACTIONS)
    return isGA ? `/${repoName ?? 'fe-baiyu'}/` : '/'
  })(),
  srcDir: 'src',
  title: "FE-BaiYu",
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
      { text: 'Examples', link: '/examples/markdown/a__HTML/a.基础篇/01.SVG' },
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
                { text: '01.SVG', link: '/examples/markdown/a__HTML/a.基础篇/01.SVG' }
              ]
            },
            {
              text: '提问篇',
              collapsed: true,
              items: [
                { text: '01.src和href区别src和href区别', link: '/examples/markdown/a__HTML/b.提问篇/01.src和href区别%20copy' },
                { text: '02.对HTML理解', link: '/examples/markdown/a__HTML/b.提问篇/02.对HTML理解' }
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
                { text: '01.SVG', link: '/examples/markdown/b__CSS/a.基础篇/01.SVG' }
              ]
            },
            {
              text: '提问篇',
              collapsed: true,
              items: [
                { text: '01.src和href区别 copy', link: '/examples/markdown/b__CSS/b.提问篇/01.src和href区别%20copy' },
                { text: '02.对HTML理解', link: '/examples/markdown/b__CSS/b.提问篇/02.对HTML理解' }
              ]
            }
          ]
        }
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
