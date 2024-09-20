import { NAMED_COLORS } from './named-colors'

export const HEXRegex = /#[0-9a-f]{3,8}\b/gi
export const RGBHSLRegex = /\b(?:rgb|hsl)a?\([\d\s\-,./%]+\)/gi

export function getNamedColorsRegex(): RegExp {
  return new RegExp(
    `(?<=:\\s*)(${NAMED_COLORS.join('|')})`,
    'gi',
  )
}
