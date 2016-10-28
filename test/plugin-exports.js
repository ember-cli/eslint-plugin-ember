var assert = require('assert');

describe('plugin exports library functions', function() {
  it('should export functions from the ember', function() {
    var plugin = require('../index.js');
    var ember = require('../rules/utils/ember');
    assert.ok(plugin.utils.ember);
    assert.equal(plugin.utils.ember, ember);
  });

  it('should export functions from utils', function() {
    var plugin = require('../index.js');
    var utils = require('../rules/utils/utils');
    assert.ok(plugin.utils.utils);
    assert.equal(plugin.utils.utils, utils);
  });
});
