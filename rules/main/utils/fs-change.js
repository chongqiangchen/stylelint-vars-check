const fs = require('fs');
const md5 = require('md5');
const { isTestEnv } = require('../../../utils/env');
const { resolve } = require('path');

let preMd5Map = new Map();
let rootPath = isTestEnv ? '' : resolve(__dirname, '../../../../../');

const isFileChange = (path) => {
  const filePath = resolve(rootPath, path);
  let curMd5 = md5(fs.readFileSync(filePath));
  if (curMd5 !== preMd5Map.get(filePath)) {
    preMd5Map.set(filePath, curMd5);
    return true;
  }
  return false;
};

const isFilesChange = (filePaths) => {
  let isChange = true;
  try {
    isChange = filePaths.every(path => isFileChange(path));
  } catch {
    isChange = true;
  }
  return isChange;
};

module.exports = {
  isFileChange,
  isFilesChange
};
