module.exports = {
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
    'comma-dangle': [0, {
      'functions': 'never',
    }]
  },
}
