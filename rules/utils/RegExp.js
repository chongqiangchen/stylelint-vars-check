const FONT_SIZE_VAR_REGEXP = new RegExp(/^([$@])(\S)*font/, 'i');
const FONT_SIZE_CONTENT_REGEXP = new RegExp(/^([$@])(\S)*font-size/, 'i');
const VAR_REGEXP_PREFIX = '^([$@])(S)*';

const getVarRegExp = key => {
  return new RegExp(VAR_REGEXP_PREFIX + key);
};

module.exports = {
  FONT_SIZE_VAR_REGEXP,
  FONT_SIZE_CONTENT_REGEXP,
  VAR_REGEXP_PREFIX,
  getVarRegExp
};
