// tailwind.config.js
const getPresets = require('@tuimao/tailwind-config-preset').default
module.exports = {
  presets: [getPresets({ theme: { colors: { primary: { DEFAULT: 'var(--primary-color)' } } } })]
}
