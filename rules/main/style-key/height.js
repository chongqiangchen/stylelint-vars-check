const _ = require('lodash');

class Height {
  needNotice(value) {
    return !/\@|\$/.test(value);
  }

  getMsg(map, curValue) {
    const varConfig = _.find(map, ({ value }) => value === curValue.toLowerCase());

    if (varConfig && varConfig.length !== 0) {
      return `${curValue} 建议替换成 ${varConfig.key} 变量`;
    }

    return null;
  }
}

module.exports = {
  'height': new Height()
};
