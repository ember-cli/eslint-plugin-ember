const { ReferenceTracker } = require('eslint-utils');
const jqueryMethods = require('../utils/jquery-methods');

const jqueryMap = {
  [ReferenceTracker.CALL]: true,
};

for (const method of jqueryMethods) {
  jqueryMap[method] = { [ReferenceTracker.CALL]: true };
}

/**
 * Global references
 *
 * eg; $(body) and $.post()
 *
 * For use with ReferenceTracker: tracker.iterateGlobalReferences();
 */
const globalMap = {
  $: jqueryMap,
  jQuery: jqueryMap,
};

/**
 * ESM references
 *   import $ from 'jquery'
 *   import { $ as jq } from 'ember'
 *
 * eg;
 *   $(body) and jq.post()
 *
 * For use with ReferenceTracker: tracker.iterateEsmReferences();
 */
const esmMap = {
  jquery: {
    [ReferenceTracker.ESM]: true,
    default: jqueryMap,
  },
  ember: {
    [ReferenceTracker.ESM]: true,
    default: {
      $: jqueryMap,
    },
    $: jqueryMap,
  },
};

module.exports = {
  globalMap,
  esmMap,
};
