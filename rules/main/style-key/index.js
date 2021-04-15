const Font = require('./font');
const Background = require('./background');
const Block = require('./block');
const Box = require('./box');
const Border = require('./border');
const Position = require('./position');

module.exports = {
  ...Font,
  ...Background,
  ...Block,
  ...Box,
  ...Border,
  ...Position
}
