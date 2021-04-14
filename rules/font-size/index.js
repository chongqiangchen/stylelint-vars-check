const _ = require('lodash');
const path = require('path');
const stylelint = require('stylelint');
const { isTestEnv } = require('../../utils/env');
const { execSync } = require('child_process');
const { FONT_SIZE_VAR_REGEXP } = require('./RegExp');
const { getFontSizeMap, getFontSizeVarMessage } = require('./utils');

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = 'vars/font-size-variables';
let styleVars;


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
  const { paths, styleType } = inputs;
  const parseVarsPath = path.resolve(__dirname, '../../extract-vars.js');
  if (!styleVars || isTestEnv) {
    styleVars = execSync(`node ${parseVarsPath} ${paths} ${styleType}`).toString('UTF-8');
  }
  let fontSizeMap;
  try {
    const fontSizeInfo = JSON.parse(styleVars);
    fontSizeMap = getFontSizeMap(fontSizeInfo);
  } catch (error) {
  }

  return (root, result) => {
    const validOptions = validateOptions(
      result,
      ruleName,
      {
        actual: inputs,
        possible: {
          paths: [_.isString],
          styleType: ['less', 'sass', 'scss']
        }
      },
    );
    if (!validOptions) {
      console.error('请确认输入参数是否错误');
      return;
    }

    root.walkDecls(decl => {
      if (decl.prop.toLowerCase() === 'font-size' && FONT_SIZE_VAR_REGEXP.test(decl.value) === false) {
        const msg = getFontSizeVarMessage(decl.value, fontSizeMap);

        if (msg) {
          report({
            message: messages.rejected(msg),
            node: decl,
            result,
            ruleName
          });
        }
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
