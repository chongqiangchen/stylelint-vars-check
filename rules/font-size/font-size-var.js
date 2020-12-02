const _ = require('lodash');
const { FONT_SIZE_VAR_REGEXP } = require('../utils/RegExp');

function getFontSizeMap(fontSizeInfo) {
  return _.map(fontSizeInfo, (value, key) => ({
    key,
    value
  })).filter(item => FONT_SIZE_VAR_REGEXP.test(item.key) === true);
}

function getFontSizeVarMessage(curFontSizeValue, fontSizeMap) {
  const hasPX = /px$/i.test(curFontSizeValue);
  const infoPX = _.find(
    fontSizeMap,
    ({ value }) => value === curFontSizeValue.toLowerCase()
  );
  const hasREM = /rem$/i.test(curFontSizeValue)
  const infoREM = _.find(fontSizeMap, ({value}) => value ===  curFontSizeValue.toLowerCase())

  if (hasPX && infoPX) {
    return `${curFontSizeValue} 建议替换成 ${infoPX.key} 变量`;
  }

  if(hasREM && infoREM){
    return  `${curFontSizeValue} 建议替换成 ${infoREM.key} 变量`
  }

  return null;
}

module.exports = {
  getFontSizeMap,
  getFontSizeVarMessage
};
