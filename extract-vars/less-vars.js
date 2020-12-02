var less = require('less');
var _ = require('lodash');
var path = require('path');
var lessToJs = require('less-vars-to-js');

const rootPath = path.resolve(__dirname, '../../');

// Auxiliary functions
function getOutput(files) {
  const context = files
    .map(file => {
      const filePath = path.join(rootPath, file);
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
