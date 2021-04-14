/**
 * 由于相关
 * @param value
 * @returns {*}
 */
const resolveColor = require('../../../utils/resolve-color');
const { isKeyword } = require('is-color');

function resolveValue(words, mergeSymbol = ' ') {
  const formatWords = words.map(word => {
    if(isKeyword(word)) {
      return resolveColor(word);
    }
    return word;
  })
  return {
    sass: formatWords.join(mergeSymbol),
    less: words.join(mergeSymbol)
  };
}

// console.log(resolveValue(['green', 'sasa', 'asas']));

module.exports = resolveValue;
