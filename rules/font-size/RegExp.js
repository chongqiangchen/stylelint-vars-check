const FONT_SIZE_VAR_REGEXP = new RegExp(/^([$@])(\S)*font/, 'i');
const FONT_SIZE_CONTENT_REGEXP = new RegExp(/^([$@])(\S)*font-size/, 'i');

module.exports = {
  FONT_SIZE_VAR_REGEXP,
  FONT_SIZE_CONTENT_REGEXP,
};
