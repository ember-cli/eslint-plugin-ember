'use strict';

const plugin = require('../lib');
const ember = require('../lib/utils/ember');
const utils = require('../lib/utils/utils');
const base = require('../lib/config/base');
const recommended = require('../lib/config/recommended');

describe('plugin exports', () => {
  describe('utils', () => {
    it('has the right util functions', () => {
      expect(plugin.utils).toStrictEqual({ ember, utils });
    });
  });

  describe('configs', () => {
    it('has the right configurations', () => {
      expect(plugin.configs).toStrictEqual({ base, recommended });
    });
  });
});
