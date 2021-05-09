const babelEslint = require('@babel/eslint-parser');

function parse(code) {
  return babelEslint.parse(code, {
    babelOptions: {
      configFile: require.resolve('../../.babelrc'),
    },
  });
}

function parseForESLint(code) {
  return babelEslint.parseForESLint(code, {
    babelOptions: {
      configFile: require.resolve('../../.babelrc'),
    },
  });
}

module.exports = {
  parse,
  parseForESLint,
};
