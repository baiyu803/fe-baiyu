import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { Fragment, h } from 'vue'
import ImagePreview from './components/ImagePreview.vue'
import './style.css'

const theme: Theme = {
  extends: DefaultTheme,
  Layout() {
    return h(Fragment, [
      h(DefaultTheme.Layout),
      h(ImagePreview)
    ])
  }
}

export default theme
