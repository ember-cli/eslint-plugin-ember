'use strict';

module.exports = getTraverser;

function getTraverser() {
  let traverser;
  try {
    // eslint-disable-next-line node/no-unpublished-require
    traverser = require('eslint/lib/shared/traverser'); // eslint >= 6
  } catch (error) {
    // eslint-disable-next-line node/no-unpublished-require, node/no-missing-require
    traverser = require('eslint/lib/util/traverser'); // eslint < 6
  }
  return traverser;
}
