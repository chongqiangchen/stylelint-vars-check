const _ = require('lodash');
const isColor = require('is-color');
const splitWords = require('../utils/split-words');
const { generateMoreConfigMsg } = require('../../../utils/common');
const { resolveValue } = require('../utils/resolve-value');

class Background {
  matchRule = ['background', 'bg'];
  propClazz = {
    'background-color': new BackgroundColor(),
    'background-image': new BackgroundImage(),
    'background-repeat': new BackgroundRepeat(),
    'background-attachment': new BackgroundAttachment(),
    'background-position': new BackgroundPosition(),
    'background-clip': new BackgroundClipOrOrigin(),
    'background-origin': new BackgroundClipOrOrigin(),
    'background-size': new BackgroundSize()
  };

  needNotice(value) {
    const bgArr = value.split(' ');
    return bgArr.some(item => !/\@|\$/.test(item));
  }

  getMsg(map, curValue) {
    const resolveObj = resolveBackground(curValue);
    let result = null;

    Object.keys(resolveObj).forEach(key => {
      const msg = this.propClazz[key].getMsg(map, resolveObj[key]);
      if (msg) {
        result = !result ? msg : `${result}\n${msg}`;
      }
    });
    return result;
  }
}

class BackgroundColor {
  matchRule = ['background-color', 'bg-color', 'bg'];

  needNotice(value) {
    return !/\@|\$/.test(value);
  }

  getMsg(map, curValue) {
    return generateMoreConfigMsg(curValue, _.filter(map, ({ value }) => value === curValue || value === resolveValue(curValue)));
  }

  static is(value) {
    return isColor(value);
  }
}

class BackgroundImage extends BackgroundColor {
  matchRule = ['background-image', 'bg-image', 'bg-img', 'bg'];

  static is(value) {
    return value.indexOf('url') !== -1 || value.indexOf('linear-gradient') !== -1;
  }
}

class BackgroundRepeat extends BackgroundColor {
  matchRule = ['background-repeat', 'bg-repeat', 'bg'];

  static is(value) {
    return value.indexOf('repeat') !== -1 || value.indexOf('space') !== -1 || value.indexOf('round') !== -1;
  }
}

class BackgroundAttachment extends BackgroundColor {
  matchRule = ['background-repeat', 'bg-repeat', 'bg'];

  static is(value) {
    return value === 'scroll' || value === 'fixed' || value === 'local';
  }
}

// Special considerations
class BackgroundPosition extends BackgroundColor {
  matchRule = ['background-position', 'bg-position', 'bg'];

  static is(value) {
    const hasNumber = /[0-9]/.test(value);
    const hasKeyword = /top|left|bottom|right|center/.test(value);
    return hasNumber || hasKeyword;
  }
}

class BackgroundSize extends BackgroundColor {
  matchRule = ['background-size', 'bg-size', 'bg'];

  static is(value) {
    const hasNumber = /[0-9]/.test(value);
    const hasKeyword = /contain|cover/.test(value);
    return hasNumber || hasKeyword;
  }
}

class BackgroundClipOrOrigin extends BackgroundColor {
  matchRule = ['background-clip', 'background-origin', 'bg-clip', 'bg-origin', 'bg'];

  static is(value) {
    return /(border\-box)|(padding\-box)|(content\-box)|(text)/.test(value);
  }
}

function resolveBackground(curValue) {
  let result = {};
  let isBgSize = false;
  let splitArr = splitWords(curValue);

  const update = (word) => {
    if (BackgroundColor.is(word)) {
      result['background-color'] = word;
    } else if (BackgroundImage.is(word)) {
      const curImageValue = result['background-image'];
      result['background-image'] = !curImageValue ? word : curImageValue + ' , ' + word;
    } else if (BackgroundRepeat.is(word)) {
      result['background-repeat'] = word;
    } else if (BackgroundAttachment.is(word)) {
      const curAttachmentValue = result['background-attachment'];
      result['background-attachment'] = !curAttachmentValue ? word : curAttachmentValue + ' , ' + word;
    } else if (BackgroundPosition.is(word) || BackgroundSize.is(word)) {
      if (!isBgSize) {
        const curValue = result['background-position'];
        result['background-position'] = !curValue ? word : curValue + ' ' + word;
      } else {
        const curValue = result['background-size'];
        result['background-size'] = !curValue ? word : curValue + ' ' + word;
      }
    } else if (BackgroundClipOrOrigin.is(word)) {
      const curOriginValue = result['background-origin'];
      if (!curOriginValue) {
        result['background-origin'] = word;
        result['background-clip'] = word;
      } else {
        result['background-clip'] = word;
      }
    }

    if (!BackgroundPosition.is(word) || !BackgroundSize.is(word)) {
      isBgSize = false;
    }
  };

  splitArr.forEach(word => {
    if (word === '/') {
      isBgSize = true;
    } else {
      update(word);
    }
  });

  return result;
}

module.exports = {
  'background': new Background(),
  'background-color': new BackgroundColor(),
  'background-image': new BackgroundImage(),
  'background-repeat': new BackgroundRepeat(),
  'background-attachment': new BackgroundAttachment(),
  'background-position': new BackgroundPosition(),
  'background-clip': new BackgroundClipOrOrigin(),
  'background-origin': new BackgroundClipOrOrigin(),
  'background-size': new BackgroundSize()
};

// 测试使用
// resolveBackground('linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5)), url(\'../../media/examples/lizard.png\') 50% 50% / 30% 30% border-box content-box');
// resolveBackground("no-repeat url('../../media/examples/lizard.png')")
// resolveBackground('#fff center/contain');
// resolveBackground("rgb(0, 0, 255) url('./img/src/sss,jpg') no-repeat center / contain");
// //
// const bgClazz = new BackgroundColor();
// console.log(bgClazz.getMsg(
//   [{
//     key: '$bg-size',
//     value: 'contain'
//   },{
//     key: '$bg-size-1',
//     value: 'contain'
//   }, {
//     key: '$bg-img',
//     value: "url(\\'./img/src/sss,jpg\\')"
//   }],
//   "contain"
//   )
// );
