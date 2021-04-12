// 匹配值顺序 [(...用户向前增加的值), styleKey本身, ...可能存在的值, (...用户向后增加的值)]
const DEFAULT_MATCH_RULES = {
  'font-size': ['font', 'font-size', 'fnt'],
  height: ['height', 'size', 'height-size', 'hgt', 'ht']
};

module.exports = DEFAULT_MATCH_RULES;
