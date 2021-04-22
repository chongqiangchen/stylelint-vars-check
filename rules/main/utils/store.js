const _ = require('lodash');
const { cleanValue } = require('./resolve-value');
const { resolveMatchRules } = require('./default-match-rule');
const VAR_REGEXP_PREFIX = '^([$@])(\\S)*';

// Stored value
const styleKeyAndVarsMap = {};
let matchRules = {};

// Related methods
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
          .map((value, key) => ({
            // 我们存储变量时需要清理一下对应的值
            value: cleanValue(value),
            key
          }))
          .filter(({ key }) => canMatch(key, m))
          .value();
      }
    ).flatten().uniqWith(_.isEqual).value();
  });
};

const storeMatchRules = (config) => {
  const curMatchRules = resolveMatchRules(config || {});
  const isChange = !_.isEqual(curMatchRules, matchRules);
  matchRules = curMatchRules;
  return isChange;
};

// How to use
// storeMatchRules({
//   'font-size': {
//     value: ['sss'],
//     mergeRule: 'append'
//   }
// });
// storeConfig({
//   '$font-size-base': 'rgba(1 , 12, 12) 14px 12px',
//   '$sss': '14x',
//   '$wavy-line': "20px"
// });

module.exports = {
  storeConfig,
  styleKeyAndVarsMap,
  storeMatchRules,
  isSupportStyleKey
};
