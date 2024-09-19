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
      --c-blue-3: rgb(102 102 255);
      --c-blue-4: rgb(204 51 255 / 50%);
      --c-blue-5: rgba(0, 0, 255, 1);
      --c-blue-6: rgba(0, 0, 255, .5);
      --c-blue-7: rgba(0, 0, 255, 0);
      --c-blue-8: hsl(210, 80%, 100%);
      --c-blue-9: hsl(240, 80%, 100%);

      --invalid-1: rgb(1);
      --invalid-2: hsl(1243, 140%, 150%);
      --invalid-3: #14554;
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
