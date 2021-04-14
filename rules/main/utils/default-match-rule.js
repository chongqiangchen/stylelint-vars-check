const _ = require('lodash');
const StyleKeys = require('../style-key');

// 匹配值顺序 [(...用户向前增加的值), styleKey本身, ...可能存在的值, (...用户向后增加的值)]
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

// {'font-size': ['font']} 默认replace
// {'font-size': {value: ['font'], mergeRule: 'replace | append | prepend'}}
const resolveMatchRules = (ruleConfig) => {
  let result = DEFAULT_MATCH_RULES();
  Object.entries(ruleConfig).forEach(([key, value]) => {
    let mergeRule = MergeRule.REPLACE;
    let mergeValue;
    if(_.isObject(value)) {
      // 若不存在mergeRule字段，则默认为REPLACE
      mergeRule = value.mergeRule || MergeRule.REPLACE;
      mergeValue = value.value
    }
    if (_.isArray(value)) {
      mergeValue = value;
    }
    // 若为其他情况，则不作合并value，value为空数组
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

// 使用方式
// resolveMatchRules({
//   'font-size': ['sss']
// })

module.exports = { DEFAULT_MATCH_RULES, resolveMatchRules };
