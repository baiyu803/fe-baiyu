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
              text: '思考篇',
              collapsed: true,
              items: [
                { text: 'src和href区别', link: '/knowledge/a_html/question/01_src_href' },
                { text: '对HTML语义化的理解', link: '/knowledge/a_html/question/02_html_semantic' },
                { text: 'doctype的作用', link: '/knowledge/a_html/question/03_doctype' },
                { text: '常用的meta标签有哪些', link: '/knowledge/a_html/question/04_meta_tags' },
                { text: 'HTML5有哪些更新', link: '/knowledge/a_html/question/05_html5_updates' },
                { text: 'img的srcset属性的作用', link: '/knowledge/a_html/question/06_img_srcset' },
                { text: 'HTML5的离线存储怎么用', link: '/knowledge/a_html/question/07_html5_offline_storage' },
                { text: 'iframe有哪些优点和缺点', link: '/knowledge/a_html/question/08_iframe_pros_cons' },
                { text: '渐进增强和优雅降级之间的区别', link: '/knowledge/a_html/question/09_graceful_degradation_progressive_enhancement' }
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
                { text: '琐碎知识', link: '/knowledge/b_css/basic/01_trivial' },
                { text: '文本', link: '/knowledge/b_css/basic/02_text' },
                { text: '渐变', link: '/knowledge/b_css/basic/03_gradient' },
                { text: '转换', link: '/knowledge/b_css/basic/04_transform' },
                { text: '过渡', link: '/knowledge/b_css/basic/05_transition' },
                { text: '动画', link: '/knowledge/b_css/basic/06_animation' },
                { text: 'object-fit/object-position', link: '/knowledge/b_css/basic/07_object_fit_position' },
                { text: 'flex布局', link: '/knowledge/b_css/basic/08_flex' },
                { text: 'grid布局概述', link: '/knowledge/b_css/basic/09_grid' },
                { text: '一些技巧', link: '/knowledge/b_css/basic/10_tips' }
              ]
            },
            {
              text: '思考篇',
              collapsed: true,
              items: [
                { text: 'css居中方式有哪些', link: '/knowledge/b_css/question/01_center_ways' },
                { text: '物理像素逻辑像素和像素密度', link: '/knowledge/b_css/question/02_pixel_density' },
                { text: 'css预处理器后处理器是什么', link: '/knowledge/b_css/question/03_preprocessor_postprocessor' },
                { text: '对BFC的理解', link: '/knowledge/b_css/question/04_bfc' },
                { text: '元素的层叠顺序', link: '/knowledge/b_css/question/05_stack_order' },
                { text: '如何解决1px问题', link: '/knowledge/b_css/question/06_1px_solution' }
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
        },
        {
          text: 'TypeScript 文档笔记',
          collapsed: true,
          items: [
            { text: '基础', link: '/official-docs/d_typescript/01_basic' },
            { text: '类型/对象/模块', link: '/official-docs/d_typescript/02_type_object_module' },
            { text: '高级进阶', link: '/official-docs/d_typescript/03_advanced' },
            { text: '声明文件', link: '/official-docs/d_typescript/04_declaration_file' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/baiyu803/fe-baiyu' }
    ]
  }
})
