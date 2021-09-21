const babelESLint = require('@babel/eslint-parser');

function parse(code) {
  return babelESLint.parse(code, {
    babelOptions: {
      configFile: require.resolve('../../.babelrc'),
    },
  });
}

function parseForESLint(code) {
  return babelESLint.parseForESLint(code, {
    babelOptions: {
      configFile: require.resolve('../../.babelrc'),
    },
  });
}

module.exports = {
  parse,
  parseForESLint,
};
