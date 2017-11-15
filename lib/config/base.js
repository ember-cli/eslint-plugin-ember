module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },

  env: {
    browser: true,
    es6: true,
  },

  plugins: [
    'ember',
  ],
};
