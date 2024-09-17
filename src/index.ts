import type { ShikiTransformer, ThemedToken } from '@shikijs/types'
import { splitToken } from '@shikijs/core'
import Color from 'colorjs.io'

export interface TransformerColorHighlightOptions {
  /**
   * Custom function to determine foreground color based on background color
   *
   * By default it uses `colorjs.io` to determine the luminance of the color
   */
  getForegroundColor?: (color: string) => string
  /**
   * Custom HTML style for highlighted color
   *
   * Default: `display:inline-block;padding:0 0.15em;margin:0 -0.15em;border-radius:0.2em;`
   */
  htmlStyle?: string
}

export function defaultGetForegroundColor(color: string): string {
  const c = new Color(color)
  return c.hsl[2] < 40 ? '#ffffff' : '#000000'
}

export function transformerColorHighlight(
  options: TransformerColorHighlightOptions = {},
): ShikiTransformer {
  const {
    getForegroundColor = defaultGetForegroundColor,
    htmlStyle = 'display:inline-block;padding:0 0.15em;margin:0 -0.15em;border-radius:0.2em;',
  } = options

  const map = new WeakMap<any, ResolvedColorUsage[]>()

  return {
    name: 'shiki-transformer-color-highlight',
    preprocess(code) {
      const usages: ResolvedColorUsage[] = detectColorUsage(code, this.options.lang)
        .map(i => ({
          ...i,
          foreground: getForegroundColor(i.color),
        }))
      map.set(this.meta, usages)
      return undefined
    },
    tokens(tokens) {
      const usages = map.get(this.meta)
      if (!usages?.length)
        return

      return tokens.map((line) => {
        if (!line.length)
          return line
        const start = line[0]
        const end = line[line.length - 1]
        const lineUsages = usages
          .filter(i => start.offset < i.start && i.end < end.offset + end.content.length)
          .sort((a, b) => a.start - b.start)
        const breakpoints = lineUsages.flatMap(i => [i.start, i.end])
        if (!lineUsages.length) {
          return line
        }

        const splitted = line.flatMap((token) => {
          const localBreakpoints = breakpoints
            .filter(i => token.offset <= i && i < token.offset + token.content.length)
            .map(i => i - token.offset)
          return splitToken(token, localBreakpoints)
        })

        const tokens: ThemedToken[] = []
        const buffer: ThemedToken[] = []
        let current: ResolvedColorUsage | undefined

        function handleBuffer(): void {
          if (current) {
            if (!buffer.length) {
              throw new Error('Unexpected empty buffer')
            }
            const token: ThemedToken = {
              offset: buffer[0].offset,
              content: buffer.map(i => i.content).join(''),
              bgColor: current.color,
              color: current.foreground,
              htmlStyle: `background-color:${current.color};color:${current.foreground};${htmlStyle}`,
            }
            tokens.push(token)
            buffer.length = 0
            current = undefined
          }
        }

        for (const t of splitted) {
          const usage = lineUsages.find(i => i.start <= t.offset && t.offset + t.content.length <= i.end)
          if (!usage) {
            handleBuffer()
            tokens.push(t)
            continue
          }

          current = usage
          buffer.push(t)
        }

        handleBuffer()
        return tokens
      })
    },
  }
}

interface ColorUsage {
  start: number
  end: number
  color: string
}

interface ResolvedColorUsage extends ColorUsage {
  foreground: string
}

export function detectColorUsage(code: string, _lang: string): ColorUsage[] {
  const usages: ColorUsage[] = []

  for (const match of code.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
    const color = match[0]
    // Skip invalid color
    if (![3, 4, 6, 8].includes(color.length - 1)) {
      continue
    }
    const start = match.index
    const end = start + color.length
    usages.push({ start, end, color })
  }

  // TODO: Add more color formats

  return usages
    .sort((a, b) => a.start - b.start)
}
