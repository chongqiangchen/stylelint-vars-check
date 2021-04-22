const { createPlugin } = require('stylelint');

const rules = require('./rules');

module.exports = [
  createPlugin('vars/font-size-variables', rules['font-size']),
  createPlugin('vars/color-variables', rules['color-check']),
  createPlugin('vars/color-check', rules['color-check']),
  createPlugin('vars/check', rules['main-check']),
];
