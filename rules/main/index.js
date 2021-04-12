const _ = require('lodash');
const path = require('path');
const stylelint = require('stylelint');
const { isTestEnv } = require('../../utils/env');
const { storeConfig, isSupportStyleKey, styleKeyAndVarsMap } = require('../utils/config');
const { execSync } = require('child_process');
const StyleKeys = require('./style-key');

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
 * @param {Array} paths ['path']
 * @param {String} styleType less | sass
 */
function rule(inputs, options) {
  const { paths, styleType, ruleConfig } = inputs;
  const parseVarsPath = path.resolve(__dirname, '../../extract-vars/index.js');

  if (!styleVarString || isTestEnv) {
    styleVarString = execSync(`node ${parseVarsPath} ${paths} ${styleType}`).toString('UTF-8');

    try {
      const styleVars = JSON.parse(styleVarString);
      storeConfig(ruleConfig || {}, styleVars);
    } catch (error) {
    }
  }

  return (root, result) => {
    // 检查输入
    const validOptions = validateOptions(result, ruleName, {
      actual: inputs,
      possible: {
        paths: [_.isString],
        styleType: ['less', 'sass', 'scss']
      }
    });
    if (!validOptions) {
      console.error('请确认输入参数是否错误');
      return;
    }

    root.walkDecls(decl => {
      // decl
      const styleKeyClass = StyleKeys[decl.prop.toLowerCase()];
      // todo: 若存在支持的StyleKey，那么提示其增加对应的class
      if(isSupportStyleKey(decl.prop.toLowerCase()) && styleKeyClass && styleKeyClass.needNotice(decl.value)) {
        const msg = styleKeyClass.getMsg(styleKeyAndVarsMap[decl.prop.toLowerCase()], decl.value);
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
