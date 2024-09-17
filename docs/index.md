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
}
```

## Installation

```sh
npm install shiki-transformer-color-highlight
```

## Usage

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
