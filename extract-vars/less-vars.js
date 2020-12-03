let less = require('less');
let _ = require('lodash');
let path = require('path');
let lessToJs = require('less-vars-to-js');
const { isTestEnv } = require('../utils/env');

const testRootPath = path.resolve(__dirname, '../../');
const prodRootPath = path.resolve(__dirname, '../../../');

function getOutput(files) {
  const context = files
    .map(file => {
      const filePath = isTestEnv ? path.resolve(testRootPath, file) : path.resolve(prodRootPath, file);
      const data = require('fs').readFileSync(filePath, {
        encoding: 'UTF-8'
      });
      // 忽略 @import 语法
      return data.replace(/^@import[^\n]+;/gi, '');
    })
    .join('\r\n');
  const palette = lessToJs(context, {
    resolveVariables: true,
    stripPrefix: false
  });
  return JSON.stringify(palette);
}

module.exports = getOutput;
