const _ = require('lodash');
const StyleKeys = require('../style-key');

// Match value order [(...prepend value), default, (...append value)]
const DEFAULT_MATCH_RULES = () => {
  let result = {};
  Object.keys(StyleKeys).forEach(key=> {
    const clazz = StyleKeys[key];
    result[key] = clazz.matchRule;
  })
  return result;
};

const MergeRule = {
  REPLACE: 'replace',
  APPEND: 'append',
  PREPEND: 'prepend'
}

// {'font-size': ['font']} default: replace
// {'font-size': {value: ['font'], mergeRule: 'replace | append | prepend'}}
const resolveMatchRules = (ruleConfig) => {
  let result = DEFAULT_MATCH_RULES();
  Object.entries(ruleConfig).forEach(([key, value]) => {
    let mergeRule = MergeRule.REPLACE;
    let mergeValue;
    if(_.isObject(value)) {
      // If the mergeRule field does not exist, the default is REPLACE
      mergeRule = value.mergeRule || MergeRule.REPLACE;
      mergeValue = value.value
    }
    if (_.isArray(value)) {
      mergeValue = value;
    }
    // In other cases, the value is not merged, and the value is an empty array
    result[key] = mergeRuleConfig(result[key], mergeValue || [], mergeRule);
  })
  return result;
}

const mergeRuleConfig = (origin, target, type) => {
  switch (type) {
    case MergeRule.REPLACE:
      return target || [];
    case MergeRule.APPEND:
      return (origin || []).concat(target || []);
    case MergeRule.PREPEND:
      return (target || []).concat(origin || []);
    default:
      return origin || [];
  }
}

// How to use
// resolveMatchRules({
//   'font-size': ['sss']
// })

module.exports = { DEFAULT_MATCH_RULES, resolveMatchRules };
