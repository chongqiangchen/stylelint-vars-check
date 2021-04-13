const _ = require('lodash');
const { resolveMatchRules } = require('./default-match-rule');
const VAR_REGEXP_PREFIX = '^([$@])(S)*';

// 存储的值
const styleKeyAndVarsMap = {};
let matchRules = {};

// 相关方法
const canMatch = (value, matches) => {
  return matches.some(m => new RegExp(VAR_REGEXP_PREFIX + m).test(value));
};

const isSupportStyleKey = (styleKey) => {
  return _.hasIn(styleKeyAndVarsMap, styleKey);
};

const storeConfig = (styleVars) => {
  Object.entries(matchRules).forEach(([styleKey, styleMatchRule]) => {
    styleKeyAndVarsMap[styleKey] = _.map(styleVars, (value, key) => ({
      key,
      value
    })).filter(({ key }) => canMatch(key, styleMatchRule));
  });
};

const storeMatchRules = (config) => {
  const curMatchRules = resolveMatchRules(config || {});
  const isChange = _.isEqual(curMatchRules, matchRules);
  matchRules = curMatchRules;
  return isChange;
};

// 使用方式
// storeMatchRules({
//   'font-size': ['sss']
// })
// storeConfig({
//   '$font-size-base': '14px',
//   '$sss': '14x'
// })

module.exports = {
  storeConfig,
  styleKeyAndVarsMap,
  storeMatchRules,
  isSupportStyleKey
};
