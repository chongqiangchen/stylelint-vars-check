const resolveColor = require('../../../utils/resolve-color');
const splitWords = require('./split-words');
const { isKeyword } = require('is-color');

/**
 * The difference from cleanValue is that it will
 * not only delete unnecessary spaces and other characters,
 * but also change some values that do not meet the comparison requirements.
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
 * Delete unnecessary spaces and other characters
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
