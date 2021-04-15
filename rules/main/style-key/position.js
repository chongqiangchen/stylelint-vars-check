const { generateMoreConfigMsg } = require('../../../utils/common');
const _ = require('lodash');
const { resolveValue } = require('../utils/resolve-value');


class Position {
  matchRule = ['position'];

  needNotice(value) {
    return !/\@|\$/.test(value);
  }

  getMsg(map, curValue) {
    return generateMoreConfigMsg(curValue, _.filter(map, ({ value }) => value === curValue || value === resolveValue(curValue)));
  }
}

class Clip extends Position {
  matchRule = ['clip']
}

module.exports = {
  position: new Position(),
  clip: new Clip()
}
