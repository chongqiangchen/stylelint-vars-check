const _ = require('lodash');

class FontSize {
  needNotice(value) {
    return !/\@|\$/.test(value);
  }

  getMsg(map, curValue) {
    const varConfig = _.find(map, ({ value }) => value === curValue.toLowerCase());

    if (varConfig) {
      return `${curValue} 建议替换成 ${varConfig.key} 变量`;
    }

    return null;
  }
}

module.exports = {
  'font-size': new FontSize()
};
