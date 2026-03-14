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
        },
        {
          text: 'JavaScript',
          collapsed: true,
          items: [
            {
              text: '基础篇',
              collapsed: true,
              items: [
                { text: '数组', link: '/knowledge/c_javascript/basic/01_array' },
                { text: 'JSON', link: '/knowledge/c_javascript/basic/02_json' },
                { text: '字符串', link: '/knowledge/c_javascript/basic/03_string' },
                { text: '操作符', link: '/knowledge/c_javascript/basic/04_operator' },
                { text: '数据类型', link: '/knowledge/c_javascript/basic/05_data_types' },
                { text: '类型转换', link: '/knowledge/c_javascript/basic/06_type_conversion' },
                { text: '循环遍历', link: '/knowledge/c_javascript/basic/07_loops_iteration' },
                { text: '错误类型', link: '/knowledge/c_javascript/basic/08_error_types' },
                { text: '深浅拷贝', link: '/knowledge/c_javascript/basic/09_deep_shallow_copy' },
                { text: '解构赋值', link: '/knowledge/c_javascript/basic/10_destructuring_assignment' },
                { text: '变量提升', link: '/knowledge/c_javascript/basic/11_hoisting' },
                { text: '对象不变性', link: '/knowledge/c_javascript/basic/12_object_immutability' },
                { text: '正则表达式', link: '/knowledge/c_javascript/basic/13_regexp' },
                { text: 'ES6_ES13', link: '/knowledge/c_javascript/basic/14_es6_es13' }
              ]
            },
            {
              text: '进阶篇',
              collapsed: true,
              items: [
                { text: 'this', link: '/knowledge/c_javascript/advanced/01_this' },
                { text: '闭包', link: '/knowledge/c_javascript/advanced/02_closure' },
                { text: '二进制', link: '/knowledge/c_javascript/advanced/03_binary' },
                { text: '日期时间', link: '/knowledge/c_javascript/advanced/04_datetime' },
                { text: '字符编码', link: '/knowledge/c_javascript/advanced/05_character_encoding' },
                { text: '错误处理', link: '/knowledge/c_javascript/advanced/06_error_handling' },
                { text: '内存泄漏', link: '/knowledge/c_javascript/advanced/07_memory_leak' },
                { text: '异步编程', link: '/knowledge/c_javascript/advanced/08_async_programming' },
                { text: '事件循环', link: '/knowledge/c_javascript/advanced/09_event_loop' },
                { text: '竞态条件', link: '/knowledge/c_javascript/advanced/10_race_condition' },
                { text: '前端模块化', link: '/knowledge/c_javascript/advanced/11_frontend_modularization' },
                { text: 'V8执行原理', link: '/knowledge/c_javascript/advanced/12_v8_execution_principle' },
                { text: '迭代器&生成器', link: '/knowledge/c_javascript/advanced/13_iterator_generator' },
                { text: 'Web_Workers', link: '/knowledge/c_javascript/advanced/14_web_workers' },
                { text: 'Proxy', link: '/knowledge/c_javascript/advanced/15_proxy' },
                { text: 'Object.defineProperty', link: '/knowledge/c_javascript/advanced/16_object_defineproperty' }
              ]
            },
            {
              text: '思考篇',
              collapsed: true,
              items: [
                { text: '如何判断一个对象是空对象', link: '/knowledge/c_javascript/question/01_empty_object_check' },
                { text: 'new操作符的实现原理', link: '/knowledge/c_javascript/question/02_new_operator_principle' },
                { text: 'map和weakMap的区别', link: '/knowledge/c_javascript/question/03_map_vs_weakmap' },
                { text: 'JavaScript脚本延迟加载方式有哪些', link: '/knowledge/c_javascript/question/04_script_defer_load' },
                { text: '对Ajax的理解_实现一个Ajax请求', link: '/knowledge/c_javascript/question/05_ajax_understanding' },
                { text: '什么是尾调用', link: '/knowledge/c_javascript/question/06_tail_call' },
                { text: '常见的DOM操作有哪些', link: '/knowledge/c_javascript/question/07_common_dom_operations' },
                { text: 'ajax_axios_fetch的区别', link: '/knowledge/c_javascript/question/08_ajax_axios_fetch' },
                { text: 'addEventListener方法的参数和使用', link: '/knowledge/c_javascript/question/09_add_event_listener' },
                { text: '谈谈对原型与原型链的理解', link: '/knowledge/c_javascript/question/10_prototype_chain' },
                { text: '实现call_apply_bind函数', link: '/knowledge/c_javascript/question/11_call_apply_bind' },
                { text: '对象创建的方式有哪些', link: '/knowledge/c_javascript/question/12_object_creation_ways' },
                { text: '对象继承的方式有哪些', link: '/knowledge/c_javascript/question/13_object_inheritance_ways' },
                { text: '对requestAnimationframe的理解', link: '/knowledge/c_javascript/question/14_request_animation_frame' },
                { text: '如何判断元素是否到达可视区域', link: '/knowledge/c_javascript/question/15_element_in_viewport' },
                { text: '谈谈任务的执行顺序', link: '/knowledge/c_javascript/question/16_task_execution_order' }
              ]
            }
          ]
        },
        {
          text: 'Vue',
          collapsed: true,
          items: [
            {
              text: '基础篇',
              collapsed: true,
              items: [
                { text: 'vue的基本原理', link: '/knowledge/d_vue/basic/01_vue_principle' },
                { text: '双向数据绑定原理', link: '/knowledge/d_vue/basic/02_two_way_data_binding' },
                { text: 'MVC和MVVM的区别', link: '/knowledge/d_vue/basic/03_mvc_vs_mvvm' },
                { text: 'slot插槽', link: '/knowledge/d_vue/basic/04_slot' },
                { text: '常见的事件修饰符', link: '/knowledge/d_vue/basic/05_event_modifiers' },
                { text: '怎么实现v-model', link: '/knowledge/d_vue/basic/06_v_model_implementation' },
                { text: '对keep-alive的理解', link: '/knowledge/d_vue/basic/07_keep_alive' },
                { text: '对$nextTick的理解', link: '/knowledge/d_vue/basic/08_next_tick' },
                { text: '单页应用与多页应用的区别', link: '/knowledge/d_vue/basic/09_spa_vs_mpa' },
                { text: 'template到render的转换过程', link: '/knowledge/d_vue/basic/10_template_to_render' },
                { text: 'mixin_extends的覆盖逻辑', link: '/knowledge/d_vue/basic/11_mixin_extends' },
                { text: '自定义指令', link: '/knowledge/d_vue/basic/12_custom_directives' },
                { text: 'vue是如何收集依赖的', link: '/knowledge/d_vue/basic/13_dependency_collection' },
                { text: 'assets和static的区别', link: '/knowledge/d_vue/basic/14_assets_vs_static' },
                { text: '对SSR的理解', link: '/knowledge/d_vue/basic/15_ssr' },
                { text: 'vue性能优化有哪些', link: '/knowledge/d_vue/basic/16_performance_optimization' },
                { text: '生命周期', link: '/knowledge/d_vue/basic/17_lifecycle' },
                { text: '组件通信', link: '/knowledge/d_vue/basic/18_component_communication' }
              ]
            },
            {
              text: '路由篇',
              collapsed: true,
              items: [
                { text: '实现懒加载', link: '/knowledge/d_vue/router/01_lazy_loading' },
                { text: '路由的hash和history模式区别', link: '/knowledge/d_vue/router/02_hash_vs_history' },
                { text: '$route和$router的区别', link: '/knowledge/d_vue/router/03_route_vs_router' },
                { text: '如何定义动态路由', link: '/knowledge/d_vue/router/04_dynamic_routing' },
                { text: '导航守卫有哪些', link: '/knowledge/d_vue/router/05_navigation_guards' }
              ]
            },
            {
              text: '状态管理篇',
              collapsed: true,
              items: [
                { text: 'vuex', link: '/knowledge/d_vue/store/01_vuex' }
              ]
            },
            {
              text: 'vue3',
              collapsed: true,
              items: [
                { text: 'vue3有哪些更新', link: '/knowledge/d_vue/vue3/01_vue3_updates' },
                { text: '如何收集依赖的', link: '/knowledge/d_vue/vue3/02_dependency_collection_v3' }
              ]
            },
            {
              text: '虚拟DOM',
              collapsed: true,
              items: [
                { text: '对虚拟DOM的理解', link: '/knowledge/d_vue/vdom/01_virtual_dom' },
                { text: '对diff算法的理解', link: '/knowledge/d_vue/vdom/02_diff_algorithm' }
              ]
            },
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
