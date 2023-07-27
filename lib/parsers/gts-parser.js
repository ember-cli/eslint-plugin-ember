const gjsParser = require('./gjs-parser');

module.exports = {
  parseForESLint(code, options) {
    return gjsParser.parseForESLint(code, options, true);
  },
};
