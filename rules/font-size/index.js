const _ = require('lodash');
const path = require('path');
const stylelint = require('stylelint');
const { execSync } = require('child_process');
const { FONT_SIZE_VAR_REGEXP } = require('../utils/RegExp');
const { getFontSizeMap, getFontSizeVarMessage } = require('./utils');

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = 'vars/font-size-variables';
let sassVars;

const messages = ruleMessages(ruleName, {
  rejected: message => {
    return message;
  }
});

function rule(paths) {
  const parseVarsPath = path.resolve(__dirname, '../../extract-vars/index.js');
  if (!sassVars) {
    sassVars = execSync(`node ${parseVarsPath} ${paths}`).toString('UTF-8');
  }
  let fontSizeMap;
  try {
    const fontSizeInfo = JSON.parse(sassVars);
    fontSizeMap = getFontSizeMap(fontSizeInfo);
  } catch (error) {}

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: paths,
      possible: [_.isString],
      optional: true
    });

    if (!validOptions) {
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
