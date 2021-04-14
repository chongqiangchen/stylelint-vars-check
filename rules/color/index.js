const _ = require('lodash');
const isColor = require('is-color');
const { execSync } = require('child_process');
const path = require('path');
const isColorProp = require('../../utils/is-color-prop');
const stylelint = require('stylelint');
const resolveColor = require('../../utils/resolve-color');
const { isTestEnv } = require('../../utils/env');
const { report, ruleMessages, validateOptions } = stylelint.utils;
const lessVars = require('../../utils/less-vars');
const sassVars = require('../../utils/sass-vars');

const ruleName = 'vars/color-variables';
let styleVars;

function getColorWarnMessage(color, colorInfo) {
  let varName = Object.keys(_.pickBy(colorInfo, value => value === resolveColor(color) || value === color));
  if (varName.length) {
    return `${color} 建议替换成 ${varName} 变量`;
  }
  return null;
}

const messages = ruleMessages(ruleName, {
  rejected: message => {
    return message;
  }
});

function rule(inputs) {
  const { paths, styleType } = inputs;
  if (!styleVars || isTestEnv) {
    styleVars = styleType === 'less' ? lessVars(paths) : sassVars(paths);
  }
  const colorInfo = JSON.parse(styleVars);

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
      }
    );
    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      if (isColorProp(decl.prop) && isColor(decl.value)) {
        const msg = getColorWarnMessage(decl.value, colorInfo);

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
