const _ = require('lodash');
const stylelint = require('stylelint');
const { storeConfig, storeMatchRules, isSupportStyleKey, styleKeyAndVarsMap } = require('./utils/store');
const { execSync } = require('child_process');
const path = require('path');
const StyleKeys = require('./style-key');
const { cleanValue } = require('./utils/resolve-value');
const { isFilesChange } = require('./utils/fs-change');

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = 'vars/check';
let styleVarString;

const messages = ruleMessages(ruleName, {
  rejected: message => {
    return message;
  }
});

/**
 * Stylelint Rule
 * @param inputs: paths: ['path'], styleType: less | sass, ruleConfig: [] | {value: [], mergeRule}
 */
function rule(inputs) {
  const { paths, styleType, ruleConfig } = inputs;
  const parseVarsPath = path.resolve(__dirname, '../../extract-vars.js');

  const matchRuleIsChange = storeMatchRules(ruleConfig);

  if (isFilesChange(paths) || matchRuleIsChange) {
    styleVarString = execSync(`node ${parseVarsPath} ${paths} ${styleType}`).toString('UTF-8');

    try {
      const styleVars = JSON.parse(styleVarString);
      storeConfig(styleVars);
    } catch (error) {
    }
  }

  return (root, result) => {
    // check input
    const validOptions = validateOptions(result, ruleName, {
      actual: inputs,
      possible: {
        paths: [_.isString],
        styleType: ['less', 'sass', 'scss'],
        ruleConfig: [_.isObject]
      }
    });
    if (!validOptions) {
      console.error('Please confirm whether the input parameter is wrong?');
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
