'use strict';

const assert = require('assert');
const plugin = require('../lib/index.js');
const ember = require('../lib/utils/ember');
const utils = require('../lib/utils/utils');

describe('plugin exports library functions', () => {
  it('should export functions from the ember', () => {
    assert.ok(plugin.utils.ember);
    assert.equal(plugin.utils.ember, ember);
  });

  it('should export functions from utils', () => {
    assert.ok(plugin.utils.utils);
    assert.equal(plugin.utils.utils, utils);
  });
});
