const _  = require('lodash');

const cleanString = (value) => {
  return value.replace(/\s*/g, '');
}

const getMsgCnt = (curValue, varConfig) => {
  return `${curValue} 建议替换成 ${varConfig.key} 变量`
}

const generateMoreConfigMsg = (curValue, configs) => {
  if (configs && configs.length !== 0) {
    return configs.reduce((p, q) => {
      return `${p}${p === '' ? '' : '\n'}${getMsgCnt(curValue, q)}`;
    }, '');
  }
  return null;
}

function getRegexpMatches(regexp, text) {
  const matches = []
  const lastIndex = regexp.lastIndex

  let match;
  do {
    match = regexp.exec(text)
    if (match) {
      matches.push(match)
    }
    // prevent infinite loop (only regular expressions with `global` flag retain the `lastIndex`)
  } while (match && regexp.global)

  // don't leak `lastIndex` changes
  regexp.lastIndex = lastIndex

  return matches;
}


module.exports = {
  cleanString,
  getMsgCnt,
  generateMoreConfigMsg,
  getRegexpMatches
}
