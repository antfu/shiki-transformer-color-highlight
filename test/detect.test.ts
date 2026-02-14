import { expect, it } from 'vitest'
import { detectColorUsage } from '../src'

it('detect', () => {
  expect(
    detectColorUsage(
      `
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
        --c-blue-3: rgb(102 102 255);
        --c-blue-4: rgb(204 51 255 / 50%);
        --c-blue-5: rgba(0, 0, 255, 1);
        --c-blue-6: rgba(0, 0, 255, .5);
        --c-blue-7: rgba(0, 0, 255, 0);
        --c-blue-8: hsl(210, 80%, 100%);
        --c-blue-9: hsl(240, 80%, 100%);
        --c-blue-10: hwb(240 0% 0%);
        --c-blue-11: lab(29.2345% 39.3825 20.0664);
        --c-blue-12: lch(29.2345% 44.2 27);
        --c-blue-13: oklab(40.1% 0.1143 0.045);
        --c-blue-14: oklch(40.1% 0.123 21.57);

        --invalid-1: rgb(1);
        --invalid-2: hsl(1243, 140%, 150%);
        --invalid-3: #14554;
      }
      `,
      'css',
    ),
  ).toMatchInlineSnapshot(`
    [
      {
        "color": "#145953",
        "end": 36,
        "start": 29,
      },
      {
        "color": "#f0f0f0",
        "end": 65,
        "start": 58,
      },
      {
        "color": "#ffcccc",
        "end": 118,
        "start": 111,
      },
      {
        "color": "#ff9999",
        "end": 148,
        "start": 141,
      },
      {
        "color": "#ff6666",
        "end": 178,
        "start": 171,
      },
      {
        "color": "#ff3333",
        "end": 208,
        "start": 201,
      },
      {
        "color": "#ff0000",
        "end": 238,
        "start": 231,
      },
      {
        "color": "#cc0000",
        "end": 268,
        "start": 261,
      },
      {
        "color": "#990000",
        "end": 298,
        "start": 291,
      },
      {
        "color": "rgb(204, 204, 255)",
        "end": 339,
        "start": 321,
      },
      {
        "color": "rgb(153, 153, 255)",
        "end": 379,
        "start": 361,
      },
      {
        "color": "rgb(102 102 255)",
        "end": 417,
        "start": 401,
      },
      {
        "color": "rgb(204 51 255 / 50%)",
        "end": 460,
        "start": 439,
      },
      {
        "color": "rgba(0, 0, 255, 1)",
        "end": 500,
        "start": 482,
      },
      {
        "color": "rgba(0, 0, 255, .5)",
        "end": 541,
        "start": 522,
      },
      {
        "color": "rgba(0, 0, 255, 0)",
        "end": 581,
        "start": 563,
      },
      {
        "color": "hsl(210, 80%, 100%)",
        "end": 622,
        "start": 603,
      },
      {
        "color": "hsl(240, 80%, 100%)",
        "end": 663,
        "start": 644,
      },
      {
        "color": "hwb(240 0% 0%)",
        "end": 700,
        "start": 686,
      },
      {
        "color": "lab(29.2345% 39.3825 20.0664)",
        "end": 752,
        "start": 723,
      },
      {
        "color": "lch(29.2345% 44.2 27)",
        "end": 796,
        "start": 775,
      },
      {
        "color": "oklab(40.1% 0.1143 0.045)",
        "end": 844,
        "start": 819,
      },
      {
        "color": "oklch(40.1% 0.123 21.57)",
        "end": 891,
        "start": 867,
      },
      {
        "color": "rgb(1)",
        "end": 921,
        "start": 915,
      },
      {
        "color": "hsl(1243, 140%, 150%)",
        "end": 965,
        "start": 944,
      },
    ]
  `)
})
