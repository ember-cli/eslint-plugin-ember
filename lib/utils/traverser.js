'use strict';

module.exports = getTraverser;

/* eslint node/no-unpublished-require:"off", node/no-missing-require:"off" */

function getTraverser() {
  let traverser;
  try {
    traverser = require('eslint/lib/shared/traverser'); // eslint >= 6
  } catch {
    traverser = require('eslint/lib/util/traverser'); // eslint < 6
  }
  return traverser;
}
