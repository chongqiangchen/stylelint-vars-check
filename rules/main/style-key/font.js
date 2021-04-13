const _ = require('lodash');

class FontSize {
  matchRule = ['font-size', 'font', 'fnt'];

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

class FontStyle extends FontSize{
  matchRule = ['font-style', 'font', 'fnt'];
}

class LineHeight extends FontSize{
  matchRule = ['line-height', 'lh'];
}

class FontWeight extends FontSize{
  matchRule = ['font-weight', 'weight', 'font', 'fnt'];
}

class FontVariant extends FontSize{
  matchRule = ['font-variant', 'variant', 'font', 'fnt'];
}

class TextTransform extends FontSize{
  matchRule = ['text-transform', 'txt-transform', 'text', 'txt'];
}

class TextDecoration extends FontSize {
  matchRule = ['text-decoration', 'txt-decoration', 'text', 'txt'];
}

class FontFamily extends FontSize {
  matchRule = ['font-family', 'font', 'fnt'];
}

module.exports = {
  'font-size': new FontSize(),
  'font-style': new FontStyle(),
  'line-height': new LineHeight(),
  'font-weight': new FontWeight(),
  'font-variant': new FontVariant(),
  'text-transform': new TextTransform(),
  'text-decoration': new TextDecoration(),
  'font-family': new FontFamily()
};
