const _ = require('lodash');
const isColor = require('is-color');
const { execSync } = require('child_process');
const path = require('path');
const isColorProp = require('../../utils/is-color-prop');
const stylelint = require('stylelint');
const resolveColor = require('../../utils/resolve-color');
const { getMsgCnt } = require('../../utils/common');
const { isTestEnv } = require('../../utils/env');
const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = 'vars/color-variables';
let sassVars;

function getColorWarnMessage(color, colorInfo) {
  let varName = Object.keys(_.pickBy(colorInfo, value => value === resolveColor(color).matchColor || value === color));
  if (varName.length) {
    return getMsgCnt(resolveColor(color).matchOriginColor, varName);
  }
  return null;
}

const messages = ruleMessages(ruleName, {
  rejected: message => {
    return message;
  }
});

function rule(inputs) {
  const {paths, styleType} = inputs;
  const parseVarsPath = path.resolve(__dirname, '../../extract-vars.js');
  if (!sassVars || isTestEnv) {
    sassVars = execSync(`node ${parseVarsPath} ${paths} ${styleType}`).toString('UTF-8');
  }
  const colorInfo = JSON.parse(sassVars);

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
