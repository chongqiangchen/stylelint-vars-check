const _ = require('lodash');
const stylelint = require('stylelint');
const { storeConfig, storeMatchRules, isSupportStyleKey, styleKeyAndVarsMap } = require('./utils/store');
const StyleKeys = require('./style-key');
const { cleanValue } = require('./utils/resolve-value');
const { isFilesChange } = require('./utils/fs-change');
const lessVars = require('../../utils/less-vars');
const sassVars = require('../../utils/sass-vars');

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = 'vars/check';
let styleVarString;

const messages = ruleMessages(ruleName, {
  rejected: message => {
    return message;
  }
});

/**
 * 规则
 * @param inputs :  paths: ['path'], styleType: less | sass, ruleConfig: [] | {value: [], mergeRule}
 */
function rule(inputs) {
  const { paths, styleType, ruleConfig } = inputs;
  const matchRuleIsChange = storeMatchRules(ruleConfig);
  if (isFilesChange(paths) || matchRuleIsChange) {
    styleVarString = styleType === 'less' ? lessVars(paths) : sassVars(paths);

    try {
      const styleVars = JSON.parse(styleVarString);
      storeConfig(styleVars);
    } catch (error) {
    }
  }

  return (root, result) => {
    // 检查输入
    const validOptions = validateOptions(result, ruleName, {
      actual: inputs,
      possible: {
        paths: [_.isString],
        styleType: ['less', 'sass', 'scss'],
        ruleConfig: [_.isObject]
      }
    });
    if (!validOptions) {
      console.error('请确认输入参数是否错误');
      return;
    }

    root.walkDecls(decl => {
      // decl
      const styleKeyClass = StyleKeys[decl.prop.toLowerCase()];
      const curValue = cleanValue(decl.value); // 我们需要清理css value值
      // todo: 若存在支持的StyleKey，那么提示其增加对应的class
      if(isSupportStyleKey(decl.prop.toLowerCase()) && styleKeyClass && styleKeyClass.needNotice(curValue)) {
        const msg = styleKeyClass.getMsg(styleKeyAndVarsMap[decl.prop.toLowerCase()], curValue);
        if(msg) {
          report({
            message: messages.rejected(msg),
            node: decl,
            result,
            ruleName
          })
        }
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;