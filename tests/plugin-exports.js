'use strict';

const plugin = require('../lib');
const ember = require('../lib/utils/ember');
const base = require('../lib/config-legacy/base');
const recommended = require('../lib/config-legacy/recommended');
const hbs = require('../lib/config-legacy/hbs');
const recommendedV13 = require('../lib/config-legacy/recommended-v13');

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
        hbs,
        recommended,
        'recommended-v13': recommendedV13,
      });
    });
  });
});
