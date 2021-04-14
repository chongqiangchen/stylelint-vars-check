const _ = require('lodash');
const isColor = require('is-color');

class Background  {
  matchRule = ['background', 'bg'];

  needNotice(value) {
    const bgArr = value.split(' ');
    return bgArr.some(item => !/\@|\$/.test(item));
  }

  getMsg(map, curValue) {
    const resolveObj = resolveBackground(curValue);
    let result = null;

    Object.keys(resolveObj).forEach(key => {
      const varConfig = _.find(map, ({ value }) => value === resolveObj[key].toLowerCase());
      if (varConfig) {
        const msg = `${key}: ${resolveObj[key]} 建议替换成 ${varConfig.key} 变量`;
        result = result ? msg: `\n ${msg}`;
      }
    })
    return result;
  }
}

class BackgroundColor {
  matchRule = ['background-color', 'bg-color', 'bg'];

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

// 特殊考虑
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

const BackgroundStatus = {
  START: 'START',
  END: 'END',
  POSITION_AND_SIZE_DELIMITER: 'POSITION_AND_SIZE_DELIMITER',
  LINER_GRADIENT: 'LINER_GRADIENT',
  IMAGE_URL: 'IMAGE_URL',
  COLOR: 'COLOR'
};

function resolveBackground(curValue) {
  let result = {};
  let tmpStr = '';
  let bracketsNum = 0;
  let status = BackgroundStatus.START;
  let isBgSize = false;
  const END_ATTACH = '  ';


  const update = () => {
    if (BackgroundColor.is(tmpStr)) {
      result['background-color'] = tmpStr;
    } else if (BackgroundImage.is(tmpStr)) {
      const curImageValue = result['background-image'];
      result['background-image'] = !curImageValue ? tmpStr : curImageValue + ',' + tmpStr;
    } else if (BackgroundRepeat.is(tmpStr)) {
      result['background-repeat'] = tmpStr;
    } else if (BackgroundAttachment.is(tmpStr)) {
      const curAttachmentValue = result['background-attachment'];
      result['background-attachment'] = !curAttachmentValue ? tmpStr : curAttachmentValue + ',' + tmpStr;
    } else if (BackgroundPosition.is(tmpStr) || BackgroundSize.is(tmpStr)) {
      if (!isBgSize) {
        const curValue = result['background-position'];
        result['background-position'] = !curValue ? tmpStr : curValue + ' ' + tmpStr;
      } else {
        const curValue = result['background-size'];
        result['background-size'] = !curValue ? tmpStr : curValue + ' ' + tmpStr;
      }
    } else if (BackgroundClipOrOrigin.is(tmpStr)) {
      const curOriginValue = result['background-origin'];
      if (!curOriginValue) {
        result['background-origin'] = tmpStr;
        result['background-clip'] = tmpStr;
      } else {
        result['background-clip'] = tmpStr;
      }
    }


    if (!BackgroundPosition.is(tmpStr) || !BackgroundSize.is(tmpStr)) {
      isBgSize = false;
    }
  };

  const resetStatus = (char) => {
    tmpStr = char !== ' ' ? char : '';
    status = BackgroundStatus.START;
  };

  for (let char of curValue + END_ATTACH) {
    switch (status) {
      case BackgroundStatus.START:
        // 注1和注2两个顺序不能换，考虑到30% / 50%的情况
        // 注1
        if (char === '/' || tmpStr.indexOf('/') !== -1) {
          status = BackgroundStatus.POSITION_AND_SIZE_DELIMITER;
          break;
        }
        // 注2
        if (char === ' ') {
          status = BackgroundStatus.END;
          break;
        }

        tmpStr += char;

        if (tmpStr === 'linear-gradient') {
          status = BackgroundStatus.LINER_GRADIENT;
        }
        if (tmpStr === 'url') {
          status = BackgroundStatus.IMAGE_URL;
        }
        if (tmpStr === 'rgba' || tmpStr === 'rgb') {
          status = BackgroundStatus.COLOR;
        }
        break;
      case BackgroundStatus.END:
        update();
        resetStatus(char);
        break;
      case BackgroundStatus.POSITION_AND_SIZE_DELIMITER:
        const splitArr = tmpStr.split('/');
        if (splitArr[0] !== '') {
          result['background-position'] =
            !result['background-position'] ? splitArr[0]
              : result['background-position'] + ' ' + splitArr[0];
        }
        isBgSize = true;
        resetStatus(char);
        break;
      case BackgroundStatus.LINER_GRADIENT:
        if (char === '(') bracketsNum++;
        if (char === ')') bracketsNum--;
        tmpStr += char;
        if (bracketsNum === 0) status = BackgroundStatus.END;
        break;
      case BackgroundStatus.IMAGE_URL:
        if (char === '(') bracketsNum++;
        if (char === ')') bracketsNum--;
        tmpStr += char;
        if (bracketsNum === 0) status = BackgroundStatus.END;
        break;
      case BackgroundStatus.COLOR:
        if (char === 'a') {
          tmpStr += char;
          break;
        }
        if (char === '(') bracketsNum++;
        if (char === ')') bracketsNum--;
        tmpStr += char;
        if (bracketsNum === 0) status = BackgroundStatus.END;
        break;
    }
  }
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
// resolveBackground("no-repeat url(\\'../../media/examples/lizard.png\\')")
// resolveBackground('#fff center/contain');
// resolveBackground('rgb(0, 0, 255) url(\'./img/src/sss,jpg\') no-repeat center / contain');
//
// const bgClazz = new Background();
// bgClazz.getMsg(
//   [{
//     key: '$bg-size',
//     value: 'contain'
//   }],
//   "rgb(0, 0, 255) url(\\'./img/src/sss,jpg\\') no-repeat center / contain"
// )
