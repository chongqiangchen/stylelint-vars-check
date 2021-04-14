/**
 * 由于相关
 * @param value
 * @returns {*}
 */
const resolveColor = require('../../../utils/resolve-color');
const splitWords = require('./split-words');
const { isKeyword } = require('is-color');

/**
 * 与cleanValue区别于 其会不仅删去不需要的空格等字符并对一些不符合比对要求的值进行更改
 * @param curValue
 * @param mergeSymbol
 * @returns {*}
 */
function resolveValue(curValue, mergeSymbol = ' ') {
  const words = splitWords(curValue);
  const formatWords = words.map(word => {
    if(isKeyword(word)) {
      return resolveColor(word);
    }
    return word;
  })
  return formatWords.join(mergeSymbol);
}

/**
 * 删去不需要的空格等字符
 * @param curValue
 * @param mergeSymbol
 * @returns {string}
 */
function cleanValue(curValue, mergeSymbol = ' ') {
  const words = splitWords(curValue);
  return words.join(mergeSymbol).toLowerCase();
}

// console.log(resolveValue(['green', 'sasa', 'asas']));

module.exports = {
  cleanValue,
  resolveValue
};
