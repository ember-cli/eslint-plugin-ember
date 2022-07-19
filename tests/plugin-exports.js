'use strict';

const plugin = require('../lib');
const ember = require('../lib/utils/ember');
const recommended = require('../lib/config/recommended');

describe('plugin exports', () => {
  describe('utils', () => {
    it('has the right util functions', () => {
      expect(plugin.utils).toStrictEqual({ ember });
    });
  });

  describe('configs', () => {
    it('has the right configurations', () => {
      expect(plugin.configs).toStrictEqual({ recommended });
    });
  });
});
