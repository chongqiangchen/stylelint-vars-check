const { generateMoreConfigMsg } = require('../../../utils/common');
const _ = require('lodash');
const { resolveValue } = require('../utils/resolve-value');


class LetterSpacing {
  matchRule = ['letter-spacing', 'letter'];

  needNotice(value) {
    return !/\@|\$/.test(value);
  }

  getMsg(map, curValue) {
    return generateMoreConfigMsg(curValue, _.filter(map, ({ value }) => value === curValue || value === resolveValue(curValue)));
  }
}

class TextAlign extends LetterSpacing{
  matchRule = ['text-align', 'txt-align'];
}

class TextIndent extends LetterSpacing{
  matchRule = ['text-indent', 'txt-indent'];
}

class VerticalAlign extends LetterSpacing{
  matchRule = ['vertical-align'];
}

class WordSpacing extends LetterSpacing{
  matchRule = ['word-spacing'];
}

class Display extends LetterSpacing {
  matchRule = ['display'];
}


module.exports = {
  'letter-spacing': new LetterSpacing(),
  'text-align': new TextAlign(),
  'text-indent': new TextIndent(),
  'vertical-align': new VerticalAlign(),
  'word-spacing': new WordSpacing(),
  'display': new Display(),
}
