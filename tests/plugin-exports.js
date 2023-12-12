'use strict';

const plugin = require('../lib');
const ember = require('../lib/utils/ember');
const base = require('../lib/config/base');
const recommended = require('../lib/config-legacy/recommended');
const recommendedGjs = require('../lib/config/recommended-gjs');
const recommendedGts = require('../lib/config/recommended-gts');

describe('plugin exports', () => {
  describe('utils', () => {
    it('has the right util functions', () => {
      expect(plugin.utils).toStrictEqual({ ember });
    });
  });

  describe('configs', () => {
    it('has the right configurations', () => {
      expect(plugin.configs).toStrictEqual({
        base,
        recommended,
        'recommended-gjs': recommendedGjs,
        'recommended-gts': recommendedGts,
      });
    });
  });
});
