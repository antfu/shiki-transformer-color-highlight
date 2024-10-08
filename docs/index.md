# Shiki Transformer Color Highlight

A transformer for [Shiki](https://shiki.style) that highlights colors like HEX codes. For example:

```css
.foo {
  color: #145953;
  background: #f0f0f0;
}

:root {
  --c-red-100: #ffcccc;
  --c-red-200: #ff9999;
  --c-red-300: #ff6666;
  --c-red-400: #ff3333;
  --c-red-500: #ff0000;
  --c-red-600: #cc0000;
  --c-red-700: #990000;

  --c-blue-1: rgb(204, 204, 255);
  --c-blue-2: rgb(153, 153, 255);
  --c-blue-3: rgb(102, 102, 255);
  --c-blue-4: rgb(204, 51, 255);
  --c-blue-5: rgba(0, 0, 255, 1);
  --c-blue-6: rgba(0, 0, 255, .5);
  --c-blue-7: rgba(0, 0, 255, 0);
  --c-blue-8: hsl(210, 80%, 100%);
  --c-blue-9: hsl(240, 80%, 100%);
}
```

## Install

```sh
npm i shiki-transformer-color-highlight
```

## Usage

Usages for some popular frameworks:

### Shiki

Here is an example of how to use the [transformer](https://shiki.style/guide/transformers) with Shiki:

```ts
import { createHighlighter } from 'shiki'
import { transformerColorHighlight } from 'shiki-transformer-color-highlight'

const shiki = await createHighlighter({
  themes: [/* ... */],
  langs: [/* ... */],
})

const html = shiki.codeToHtml(code, {
  lang: 'css',
  theme: 'nord',
  transformers: [
    transformerColorHighlight() // [!code hl]
  ],
})
```

### VitePress

In VitePress, you can use the transformer in the configuration file:

```ts [.vitepress/config.ts]
import { transformerColorHighlight } from 'shiki-transformer-color-highlight'
import { defineConfig } from 'vitepress'

export default defineConfig({
  markdown: {
    codeTransformers: [
      transformerColorHighlight(), // [!code hl]
    ],
  },
})
```

### Nuxt Content

In Nuxt Content, you can use the transformer by create a `mdc.config.ts` file as follows:

```ts [mdc.config.ts]
import { defineConfig } from '@nuxtjs/mdc/config'
import { transformerColorHighlight } from 'shiki-transformer-color-highlight'

export default defineConfig({
  shiki: {
    transformers: [
      transformerColorHighlight(), // [!code hl]
    ]
  }
})
```

## TODOs

- [x] Detect hex codes
- [x] Detect `rgb()` and `rgba()` functions in CSS
- [x] Detect `hsl()` and `hsla()` functions in CSS
- [ ] Detect color names in CSS
