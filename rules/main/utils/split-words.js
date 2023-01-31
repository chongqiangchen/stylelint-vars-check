const SPACE = ' ';
const DELIMITER = '/';
const LEFT_PARENTHESIS = '(';
const RIGHT_PARENTHESIS = ')';
const SINGLE_QUOTES = '\'';

const Status = {
  NORMAL_VALUE: 'NORMAL_VALUE',
  COLOR_VALUE: 'COLOR_VALUE',
  URL_VALUE: 'URL_VALUE',
  LINEAR_GRADIENT_VALUE: 'LINEAR_GRADIENT_VALUE',
  WORD_END: 'WORD_END'
};

const splitWords = (value) => {
  const result = [];
  let tmpStr = '';
  let bracketsNum = 0;
  let status = Status.NORMAL_VALUE;

  function storeWord() {
    if (tmpStr === '' || tmpStr === SPACE || tmpStr == null) {
      return;
    }
    result.push(tmpStr);
    tmpStr = '';
    status = Status.NORMAL_VALUE;
  }

  for (let char of value + SPACE) {
    if (status === Status.NORMAL_VALUE) {
      if (char === SPACE) {
        storeWord();
        continue;
      }
      if (char === DELIMITER) {
        storeWord();
        result.push('/');
        continue;
      }
      if (char === SINGLE_QUOTES) {
        tmpStr += '\'';
        continue;
      }
      tmpStr += char;

      if (tmpStr === 'rgb' || tmpStr === 'hsl') {
        status = Status.COLOR_VALUE;
      }

      if(tmpStr === 'url') {
        status = Status.URL_VALUE;
      }

      if (tmpStr === 'linear-gradient') {
        status = Status.LINEAR_GRADIENT_VALUE;
      }
    }
    else if (status === Status.COLOR_VALUE) {
      if (char === 'a') {
        tmpStr += char;
        continue;
      }
      if (char === LEFT_PARENTHESIS) bracketsNum++;
      if (char === RIGHT_PARENTHESIS) bracketsNum--;
      if (char === SINGLE_QUOTES) {
        tmpStr += '\'';
        continue;
      } else {
        tmpStr += char;
      }
      if (bracketsNum === 0) storeWord();
    }
    else if (status === Status.URL_VALUE) {
      if (char === LEFT_PARENTHESIS) bracketsNum++;
      if (char === RIGHT_PARENTHESIS) bracketsNum--;
      if (char === SINGLE_QUOTES) {
        tmpStr += '"';
        continue;
      } else {
        tmpStr += char;
      }
      if (bracketsNum === 0) storeWord();
    }
    else if (status === Status.LINEAR_GRADIENT_VALUE) {
      if (char === LEFT_PARENTHESIS) bracketsNum++;
      if (char === RIGHT_PARENTHESIS) bracketsNum--;
      if (char === SINGLE_QUOTES) {
        tmpStr += '\'';
        continue;
      } else {
        tmpStr += char;
      }
      if (bracketsNum === 0) storeWord();
    }
  }
  return result;
};

// console.log(splitWords("#fff xxx rgba(0, 0, 0, 0), url('ss') url((0, 0,  0)) linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5))"));

module.exports = splitWords;
