'use strict';

const plugin = require('../lib');
const ember = require('../lib/utils/ember');
const utils = require('../lib/utils/utils');
const base = require('../lib/config/base.js');
const recommended = require('../lib/config/recommended.js');
const octane = require('../lib/config/octane.js');

describe('plugin exports', () => {
  describe('utils', () => {
    it('has the right util functions', () => {
      expect(plugin.utils).toStrictEqual({ ember, utils });
    });
  });

  describe('configs', () => {
    it('has the right configurations', () => {
      expect(plugin.configs).toStrictEqual({ base, recommended, octane });
    });
  });
});
