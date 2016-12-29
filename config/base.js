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
    'netguru-ember',
  ],

  rules: {
    'netguru-ember/local-modules': 2,
    'netguru-ember/no-observers': 2,
    'netguru-ember/no-side-effects': 2,
    'netguru-ember/jquery-ember-run': 2,
    'netguru-ember/named-functions-in-promises': 2,
    'netguru-ember/order-in-routes': 2,
    'netguru-ember/order-in-models': 2,
    'netguru-ember/order-in-controllers': 2,
    'netguru-ember/order-in-components': 2,
    'netguru-ember/alias-model-in-controller': 2,
    'netguru-ember/query-params-on-top': 2,
    'netguru-ember/no-empty-attrs': 2,
    'netguru-ember/closure-actions': 1,
    'netguru-ember/routes-segments-snake-case': 2,
    'netguru-ember/no-function-prototype-extensions': 2,
    'netguru-ember/no-on-calls-in-components': 2,
    'netguru-ember/use-ember-get-and-set': 1,
    'netguru-ember/avoid-leaking-state-in-components': 2,
    'netguru-ember/use-brace-expansion': 1,
  }
};
