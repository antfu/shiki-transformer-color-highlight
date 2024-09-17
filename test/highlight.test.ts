import { createHighlighter } from 'shiki'
import { expect, it } from 'vitest'
import { transformerColorHighlight } from '../src'

it('case1', async () => {
  const shiki = await createHighlighter({
    langs: ['css'],
    themes: ['vitesse-dark'],
  })

  const code = `
    :root {
      --c-red-500: #fc8181;
      --c-blue-500: #63b3ed;
      --c-green-500: #68d391;
      --c-purple-500: #9f7aea;
      --c-yellow-100: #fff9db;
      --c-yellow-200: #ffefb8;
      --c-yellow-300: #ffdf7e;
      --c-yellow-400: #ffcf44;
      --c-yellow-500: #ffbf0a;
      --c-yellow-600: #e6a309;
      --c-yellow-700: #bf7d07;
      --c-yellow-800: #995806;
      --c-yellow-900: #734305;
    }
  `

  const result = shiki.codeToHtml(code, {
    lang: 'css',
    theme: 'vitesse-dark',
    transformers: [
      transformerColorHighlight(),
    ],
  })

  expect(result).toMatchFileSnapshot('./output/case1.html')
})
