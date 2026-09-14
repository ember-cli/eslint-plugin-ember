'use strict';

const plugin = require('../lib');
const ember = require('../lib/utils/ember');
const base = require('../lib/config-legacy/base');
const recommended = require('../lib/config-legacy/recommended');
const templateLintMigration = require('../lib/config-legacy/template-lint-migration');

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
        'template-lint-migration': templateLintMigration,
      });
    });
  });
});
