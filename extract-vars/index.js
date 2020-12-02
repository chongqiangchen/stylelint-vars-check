const lessVars = require('./less-vars');
const file = process.argv[2];
const info = lessVars(file.split(','));
// eslint-disable-next-line no-console
console.log(info);
