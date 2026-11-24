'use strict';

const tseslint = require('typescript-eslint');
const tsRecommendedRules = require('../lib/ts-recommended-rules');
const recommendedGts = require('../lib/config/recommended-gts');

describe('typescript-eslint overrides for .gts', () => {
  it('match the rules typescript-eslint turns off for .ts files', () => {
    expect(tsRecommendedRules).toStrictEqual(tseslint.configs.eslintRecommended.rules);
  });

  it('apply in the gts config from eslint-plugin-ember/recommended', async () => {
    const { gts } = await import('../lib/recommended');
    expect(gts.rules).toMatchObject(tsRecommendedRules);
  });

  it('apply in eslint-plugin-ember/configs/recommended-gts', () => {
    expect(recommendedGts.at(-1).rules).toMatchObject(tsRecommendedRules);
  });
});
