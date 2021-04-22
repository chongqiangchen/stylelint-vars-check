const _  = require('lodash');

const cleanString = (value) => {
  return value.replace(/\s*/g, '');
}

const getMsgCnt = (curValue, varName) => {
  return `${curValue} suggest to replace with ${varName} variable`
}

const generateMoreConfigMsg = (curValue, configs) => {
  if (configs && configs.length !== 0) {
    return configs.reduce((p, q) => {
      return `${p}${p === '' ? '' : '\n'}${getMsgCnt(curValue, q.key)}`;
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
