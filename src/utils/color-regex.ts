import { NAMED_COLORS } from './named-colors'

export const HEXRegex = /#[0-9a-f]{3,8}\b/gi
export const RGBHSLRegex = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\([\d\s\-,./%]+\)/gi
export const namedColorsRegex = new RegExp(`(?<=[\\s:])(${NAMED_COLORS})(?=[\\s;])`, 'gi')
