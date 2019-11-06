'use strict';

const assert = require('assert');
const plugin = require('../lib/index.js');
const ember = require('../lib/utils/ember');
const utils = require('../lib/utils/utils');
const base = require('../lib/config/base.js');
const recommended = require('../lib/config/recommended.js');
const octane = require('../lib/config/octane.js');

describe('plugin exports', () => {
  describe('utils', () => {
    it('has the right util functions', () => {
      assert.deepStrictEqual(plugin.utils, { ember, utils });
    });
  });

  describe('configs', () => {
    it('has the right configurations', () => {
      assert.deepStrictEqual(plugin.configs, { base, recommended, octane });
    });
  });
});
