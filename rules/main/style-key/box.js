const { generateMoreConfigMsg } = require('../../../utils/common');
const _ = require('lodash');
const { resolveValue } = require('../utils/resolve-value');


class Width {
  matchRule = ['width'];

  needNotice(value) {
    return !/\@|\$/.test(value);
  }

  getMsg(map, curValue) {
    return generateMoreConfigMsg(curValue, _.filter(map, ({ value }) => value === curValue || value === resolveValue(curValue)));
  }
}


class Height extends Width {
  matchRule = ['height', 'height-size', 'hgt', 'ht'];
}

class Padding extends Width {
  matchRule = ['padding', 'pd']
}

class Float extends Width {
  matchRule = ['float']
}

class Margin extends Width {
  matchRule = ['margin', 'mr']
}


module.exports = {
  width: new Width(),
  height: new Height(),
  padding: new Padding(),
  float: new Float(),
  margin: new Margin(),
}
