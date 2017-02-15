module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  env: {
    node: true,
    mocha: true,
  },
  extends: [
    'airbnb-base',
  ],
  rules: {
    'func-names': 0,
    'no-use-before-define': 0,
    'no-plusplus': 0,
    'strict': 0,
  },
}
