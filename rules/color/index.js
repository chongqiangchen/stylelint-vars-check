const _ = require('lodash');
const isColor = require('is-color');
const hexColorRegex = require('hex-color-regex');
const keywords = require('css-color-names');
const { execSync } = require('child_process');
const path = require('path');
const isColorProp = require('./is-color-prop');
const stylelint = require('stylelint');
const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = 'vars/color-variables';
let sassVars;

function getColorWarnMessage(color, colorInfo) {
  let matchColor, varName;

  // 取出对应class name中的所有的颜色值
  let matchColors = hexColorRegex().exec(color);

  if (matchColors) {
    // 只对第一个进行报错
    matchColor = matchColors[0];

    // 匹配是否是#000简写的颜色
    const matchAbbreviationColor = /^#(\d{3})$/.exec(matchColor); // 判断 #000
    if (matchAbbreviationColor) {
      matchColor = '#' + matchAbbreviationColor[1].repeat(2);
    }
  } else if (keywords.hasOwnProperty(color)) {
    // 匹配类似 blue black white直接单词形容的颜色
    matchColor = color;
  }

  // 利用lodash中的PickBy筛选对应的变量名
  varName = Object.keys(_.pickBy(colorInfo, value => value === matchColor));
  if (varName.length) {
    return `${matchColor} 建议替换成 ${varName} 变量`;
  }
  return null;
}

const messages = ruleMessages(ruleName, {
  rejected: message => {
    return message;
  }
});

function rule(colorFile) {
  const parseVarsPath = path.resolve(__dirname, '../../extract-vars/index.js');
  if (!sassVars) {
    sassVars = execSync(`node ${parseVarsPath} ${colorFile}`).toString('UTF-8');
  }
  const colorInfo = JSON.parse(sassVars);
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: [colorFile],
      possible: [_.isArray]
    });
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
