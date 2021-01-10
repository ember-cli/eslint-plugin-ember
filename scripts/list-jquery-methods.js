'use strict';

const fs = require('fs');
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
    '// This file is built by build-all-methods.js; do not edit it directly.\n' +
    'module.exports = [\n'
  }${allMethods}\n];\n`,
  (err) => {
    if (err) {
      throw err;
    }
  }
);
