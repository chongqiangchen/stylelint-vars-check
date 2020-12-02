'use strict';

const sassExtract = require('sass-extract');
const path = require('path');
const _ = require('lodash');

const rootPath = path.resolve(__dirname, '../../');

class SassVars {
  static parseTypeToValue(chunk) {
    // eslint-disable-next-line default-case
    switch (chunk.type) {
      case 'SassMap':
        return SassVars.parseChunks(chunk.value);

      case 'SassList':
        return SassVars.parseList(chunk);

      case 'SassColor':
        return SassVars.parseColor(chunk.value);

      case 'SassString':
        return chunk.value;

      case 'SassNumber':
        return chunk.value + chunk.unit;

      case 'SassBoolean':
      case 'SassNull':
        return chunk.value;
    }
  }

  static parseChunks(chunks) {
    return _.mapValues(chunks, chunk => {
      return SassVars.parseTypeToValue(chunk);
    });
  }

  static parseColor(color) {
    if (color.a < 1) {
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    }

    return color.hex;
  }

  static parseList(list) {
    const values = list.value;
    let parsedString = '';

    const separator =
      // eslint-disable-next-line no-negated-condition
      list.separator !== ' ' ? list.separator + ' ' : list.separator;

    values.forEach((value, index) => {
      parsedString += `${SassVars.parseTypeToValue(value)}${
        index === values.length - 1 ? '' : separator
      }`;
    });

    return parsedString;
  }

  static extract(files) {
    // 拿到文件内容
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
    // 利用sassExtract插件解析sass变量， {type: SassColor | SassNumber, value ,...}
    const {
      vars: { global }
    } = sassExtract.renderSync({ data: context });
    // 将获取到的[{type: SassColor | SassNumber, value ,...}, ...]转成{key: value}
    return SassVars.parseChunks(global);
  }
}

module.exports = SassVars.extract;
