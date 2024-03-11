const base = require('./base');
const gtsRules = require('../recommended-rules-gts');

let typescriptRecommendedRules = {};
try {
  // typescript recommended rules turn off eslint rules that do not work for ts/gts
  // but they only to that for known extensions, therefore we need to reapply them in our
  // recommended config
  // see issue https://github.com/typescript-eslint/typescript-eslint/issues/8607
  const recommended = // eslint-disable-next-line n/no-extraneous-require
    require('@typescript-eslint/eslint-plugin').configs['eslint-recommended'];
  typescriptRecommendedRules = recommended.overrides[0].rules;
} catch {
  // not available
}

module.exports = [...base, { rules: { ...gtsRules, ...typescriptRecommendedRules } }];
