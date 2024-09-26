import type { ShikiTransformer, ThemedToken } from '@shikijs/types'
import { splitToken } from '@shikijs/core'
import Color from 'colorjs.io'

export interface TransformerColorHighlightOptions {
  /**
   * Custom function to determine foreground color based on background color
   *
   * Return `null` to skip highlighting
   *
   * By default it uses `colorjs.io` to determine the luminance of the color
   */
  getForegroundColor?: (color: string) => string | null
  /**
   * Custom HTML style for highlighted color
   *
   * Default: `display:inline-block;padding:0 0.15em;margin:0 -0.15em;border-radius:0.2em;`
   */
  htmlStyle?: Record<string, string>
}

export function defaultGetForegroundColor(color: string): string | null {
  let c: Color

  try {
    c = new Color(color)
  }
  catch {
    // Failed to parse
    return null
  }

  if (c.alpha <= 0.3) {
    return 'inherit'
  }

  const [, s, l] = c.hsl

  if (l > 60) {
    return '#000000'
  }
  else if (l < 30) {
    return '#ffffff'
  }

  if (s < 40) {
    return l > 40 ? '#000000' : '#ffffff'
  }

  return '#ffffff'
}

export function transformerColorHighlight(
  options: TransformerColorHighlightOptions = {},
): ShikiTransformer {
  const {
    getForegroundColor = defaultGetForegroundColor,
    htmlStyle = {
      'display': 'inline-block',
      'padding': '0 0.15em',
      'margin': '0 -0.15em',
      'border-radius': '0.2em',
    },
  } = options

  const map = new WeakMap<any, ResolvedColorUsage[]>()

  return {
    name: 'shiki-transformer-color-highlight',
    preprocess(code) {
      const usages: ResolvedColorUsage[] = detectColorUsage(code, this.options.lang)
        .map(i => ({
          ...i,
          foreground: getForegroundColor(i.color)!,
        }))
        .filter(i => i.foreground)
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
              htmlStyle: {
                'background-color': current.color,
                'color': current.foreground,
                ...htmlStyle,
              },
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

const HEXRegex = /#[0-9a-f]{3,8}\b/gi
const RGBHSLRegex = /\b(?:rgb|hsl)a?\([\d\s\-,./%]+\)/gi

export function detectColorUsage(code: string, _lang: string): ColorUsage[] {
  const usages: ColorUsage[] = []

  for (const match of code.matchAll(HEXRegex)) {
    const color = match[0]
    // Skip invalid color
    if (![3, 4, 6, 8].includes(color.length - 1)) {
      continue
    }
    const start = match.index
    const end = start + color.length
    usages.push({ start, end, color })
  }

  // rgb(a) / hsl(a)
  for (const match of code.matchAll(RGBHSLRegex)) {
    const color = match[0]

    const start = match.index
    const end = start + color.length

    usages.push({ start, end, color })
  }

  // TODO: Add more color formats

  return usages
    .sort((a, b) => a.start - b.start)
}
