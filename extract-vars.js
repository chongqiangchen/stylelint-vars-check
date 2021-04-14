const lessVars = require('./utils/less-vars');
const sassVars = require('./utils/sass-vars');
const file = process.argv[2];
const type = process.argv[3] || 'less';
const info = type === 'less' ? lessVars(file.split(',')) : sassVars(file.split(','));
// eslint-disable-next-line no-console
console.log(info);
