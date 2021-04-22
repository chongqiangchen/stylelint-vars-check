const _ = require('lodash');
const { generateMoreConfigMsg } = require('../../../utils/common');
const { resolveValue } = require('../utils/resolve-value');


class Border {
  matchRule = ['border', 'divider'];

  needNotice(value) {
    return !/\@|\$/.test(value);
  }

  getMsg(map, curValue) {
    return generateMoreConfigMsg(curValue, _.filter(map, ({ value }) => value === curValue || value === resolveValue(curValue)));
  }
}

module.exports = {
  border: new Border()
}

