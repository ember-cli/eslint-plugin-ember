/**
 * Based on work from wikimedia/eslint-plugin-no-jquery
 *
 * https://github.com/wikimedia/eslint-plugin-no-jquery/blob/351eca834e002a056f71072af412bb19255157ce/tools/build-all-methods.js
 */

'use strict';

const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const { window } = new JSDOM('');
const $ = require('jquery')(window);

const allMethods = Object.keys($)
  .filter((k) => !k.startsWith('_') && typeof $[k] === 'function')
  .sort()
  .map((k) => `  '${k}',`)
  .join('\n');

fs.writeFile(
  'lib/utils/jquery-methods.js',
  `${
    '// This file is built by scripts/list-jquery-methods.js; do not edit it directly.\n' +
    'module.exports = [\n'
  }${allMethods}\n];\n`,
  (err) => {
    if (err) {
      throw err;
    }
  }
);
