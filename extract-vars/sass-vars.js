'use strict';

const sassExtract = require('sass-extract');
const path = require('path');
const _ = require('lodash');
const { isTestEnv } = require('../utils/env');

const testRootPath = path.resolve(__dirname, '../');
const prodRootPath = path.resolve(__dirname, '../../../');

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
    const context = files
      .map(file => {
        const filePath = isTestEnv ? path.resolve(testRootPath, file) : path.resolve(prodRootPath, file);
        const data = require('fs').readFileSync(filePath, {
          encoding: 'UTF-8'
        });
        return data.replace(/^@import[^\n]+;/gi, '');
      })
      .join('\r\n');
    const {
      vars: { global }
    } = sassExtract.renderSync({ data: context });
    return JSON.stringify(SassVars.parseChunks(global));
  }
}

module.exports = SassVars.extract;
