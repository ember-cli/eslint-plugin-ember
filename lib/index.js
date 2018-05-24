'use strict';

/* eslint-disable global-require */
module.exports = {
  rules: {
    'alias-model-in-controller': require('./rules/alias-model-in-controller'),
    'avoid-leaking-state-in-components': require('./rules/avoid-leaking-state-in-components'),
    'avoid-leaking-state-in-ember-objects': require('./rules/avoid-leaking-state-in-ember-objects'),
    'closure-actions': require('./rules/closure-actions'),
    'jquery-ember-run': require('./rules/jquery-ember-run'),
    'local-modules': require('./rules/local-modules'),
    'named-functions-in-promises': require('./rules/named-functions-in-promises'),
    'new-module-imports': require('./rules/new-module-imports'),
    'no-attrs-in-components': require('./rules/no-attrs-in-components'),
    'no-attrs-snapshot': require('./rules/no-attrs-snapshot'),
    'no-capital-letters-in-routes': require('./rules/no-capital-letters-in-routes'),
    'no-duplicate-dependent-keys': require('./rules/no-duplicate-dependent-keys'),
    'no-get-untracked-props-in-computed': require('./rules/no-get-untracked-props-in-computed'),
    'no-empty-attrs': require('./rules/no-empty-attrs'),
    'no-function-prototype-extensions': require('./rules/no-function-prototype-extensions'),
    'no-global-jquery': require('./rules/no-global-jquery'),
    'no-jquery': require('./rules/no-jquery'),
    'no-observers': require('./rules/no-observers'),
    'no-old-shims': require('./rules/no-old-shims'),
    'no-on-calls-in-components': require('./rules/no-on-calls-in-components'),
    'no-side-effects': require('./rules/no-side-effects'),
    'order-in-components': require('./rules/order-in-components'),
    'order-in-controllers': require('./rules/order-in-controllers'),
    'order-in-models': require('./rules/order-in-models'),
    'order-in-routes': require('./rules/order-in-routes'),
    'require-super-in-init': require('./rules/require-super-in-init'),
    'routes-segments-snake-case': require('./rules/routes-segments-snake-case'),
    'use-brace-expansion': require('./rules/use-brace-expansion'),
    'use-ember-get-and-set': require('./rules/use-ember-get-and-set'),
  },
  configs: {
    base: require('./config/base'),
    recommended: require('./config/recommended'),
  },
  utils: {
    ember: require('./utils/ember'),
    utils: require('./utils/utils'),
  },
};
