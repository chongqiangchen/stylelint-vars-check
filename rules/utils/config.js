const _ = require('lodash');
const DEFAULT_MATCH_RULES = require('./default-match-rule');

const styleKeyAndVarsMap = {};
const VAR_REGEXP_PREFIX = '^([$@])(S)*';

const canMatch = (value, matches) => {
  return matches.some(m => new RegExp(VAR_REGEXP_PREFIX + m).test(value));
};

const storeConfig = (config, styleVars) => {
  // todo: 解析config 与DefaultMatchRules合并

  Object.entries(DEFAULT_MATCH_RULES).forEach(([styleKey, styleMatchRule]) => {
    const result = _.map(styleVars, (value, key) => ({
      key,
      value
    })).filter(({ key }) => canMatch(key, styleMatchRule));
    styleKeyAndVarsMap[styleKey] =  result;
  });
};

const isSupportStyleKey = (styleKey) => {
  return _.hasIn(styleKeyAndVarsMap, styleKey);
}

module.exports = {
  storeConfig,
  styleKeyAndVarsMap,
  isSupportStyleKey
};
