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
    return {
      msg: getMsgCnt(resolveColor(color).matchOriginColor, varName),
      fixValue: varName[0],
    };
  }
  return {};
}

const messages = ruleMessages(ruleName, {
  rejected: message => {
    return message;
  }
});

function rule(inputs, secondary, context = {}) {
  const { paths, styleType, disableFix } = inputs;
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
          styleType: ['less', 'sass', 'scss'],
          disableFix: _.isBoolean,
        }
      }
    );
    if (!validOptions) {
      return;
    }

    // --fix选项
    const isAutoFixing = Boolean(context.fix) && !disableFix;

    root.walkDecls(decl => {
      if (isColorProp(decl.prop) && isColor(decl.value)) {
        const { msg, fixValue } = getColorWarnMessage(decl.value, colorInfo);

        if (msg) {
          if (isAutoFixing) {
            decl.value = fixValue;
          } else {
            report({
              message: messages.rejected(msg),
              node: decl,
              result,
              ruleName
            });
          }
        }
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
