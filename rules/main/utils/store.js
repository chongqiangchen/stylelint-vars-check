const _ = require('lodash');
const { resolveMatchRules } = require('./default-match-rule');
const VAR_REGEXP_PREFIX = '^([$@])(\\S)*';

// 存储的值
const styleKeyAndVarsMap = {};
let matchRules = {};

// 相关方法
const canMatch = (value, match) => {
  return new RegExp(VAR_REGEXP_PREFIX + match).test(value);
};

const isSupportStyleKey = (styleKey) => {
  return _.hasIn(styleKeyAndVarsMap, styleKey);
};

const storeConfig = (styleVars) => {
  Object.entries(matchRules).forEach(([styleKey, styleMatchRule]) => {
    styleKeyAndVarsMap[styleKey] = _.chain(styleMatchRule).map(
      m => {
        return _.chain(styleVars)
          .map((value, key) => ({ key, value }))
          .filter(({ key }) => canMatch(key, m))
          .value();
      }
    ).flatten().uniqWith(_.isEqual).value();
  });
};

const storeMatchRules = (config) => {
  const curMatchRules = resolveMatchRules(config || {});
  const isChange = _.isEqual(curMatchRules, matchRules);
  matchRules = curMatchRules;
  return isChange;
};

// // 使用方式
// storeMatchRules({
//   'font-size': {
//     value: ['sss'],
//     mergeRule: 'append'
//   }
// });
// storeConfig({
//   '$font-size-base': '14px',
//   '$sss': '14x',
//   '$wavy-line': "20px"
// });

module.exports = {
  storeConfig,
  styleKeyAndVarsMap,
  storeMatchRules,
  isSupportStyleKey
};
