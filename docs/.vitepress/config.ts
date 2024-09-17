import { defineConfig } from 'vitepress'
import { transformerColorHighlight } from '../../src/'

export default defineConfig({
  title: 'Shiki Color Highlight',
  description: 'Shiki transformer to highlight color in code',
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/antfu/shiki-transformer-color-highlight' },
    ],
  },
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    codeTransformers: [
      transformerColorHighlight(),
    ],
  },
})
