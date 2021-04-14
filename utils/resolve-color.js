const hexColorRegex = require('hex-color-regex');
const keywords = require('css-color-names');

const resolveColor = (color) => {
  let matchColor;

  // 取出对应class name中的所有的颜色值
  let matchColors = hexColorRegex().exec(color);

  if (matchColors) {
    // 只对第一个进行报错
    matchColor = matchColors[0];

    // 匹配是否是#000简写的颜色
    const matchAbbreviationColor = /^#(\d{3})$/.exec(matchColor); // 判断 #000
    if (matchAbbreviationColor) {
      matchColor = '#' + matchAbbreviationColor[1].repeat(2);
    }
  } else if (keywords.hasOwnProperty(color)) {
    // 匹配类似 blue black white直接单词形容的颜色
    matchColor = keywords[color];
  }

  return matchColor;
}

// console.log(resolveColor('#000'));

module.exports = resolveColor;
