module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },

  env: {
    browser: true,
    jquery: true,
  },

  plugins: [
    'ember',
  ],

  rules: {
    'ember/local-modules': 2,
    'ember/no-observers': 2,
    'ember/no-side-effects': 2,
    'ember/jquery-ember-run': 2,
    'ember/named-functions-in-promises': 2,
    'ember/order-in-routes': 2,
    'ember/order-in-models': 2,
    'ember/order-in-controllers': 2,
    'ember/order-in-components': 2,
    'ember/alias-model-in-controller': 2,
    'ember/query-params-on-top': 2,
    'ember/no-empty-attrs': 2,
    'ember/closure-actions': 1,
    'ember/routes-segments-snake-case': 2,
    'ember/no-function-prototype-extensions': 2,
    'ember/no-on-calls-in-components': 2,
    'ember/use-ember-get-and-set': 1,
    'ember/avoid-leaking-state-in-components': 2,
    'ember/use-brace-expansion': 1,
  },
};
