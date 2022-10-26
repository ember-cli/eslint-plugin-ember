/**
 * This is a modified file that originally was created by:
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');

// ------------------------------------------------------------------------------
// Main
// ------------------------------------------------------------------------------

const root = path.resolve(__dirname, '../lib/rules');
const recommendedRulesFile = path.resolve(__dirname, '../lib/recommended-rules.js');

const rules = fs
  .readdirSync(root)
  .filter((file) => path.extname(file) === '.js')
  .map((file) => path.basename(file, '.js'))
  .map((fileName) => [fileName, require(path.join(root, fileName))]); // eslint-disable-line import/no-dynamic-require

const recommendedRules = rules.reduce((obj, entry) => {
  const name = `ember/${entry[0]}`;
  const recommended = entry[1].meta.docs.recommended;
  if (recommended) {
    obj[name] = 'error'; // eslint-disable-line no-param-reassign
  }
  return obj;
}, {});

const recommendedRulesContent = `/*
 * IMPORTANT!
 * This file has been automatically generated.
 * In order to update its content based on rules'
 * definitions, execute "npm run update"
 */
module.exports = ${JSON.stringify(recommendedRules, null, 2)}`;

fs.writeFileSync(recommendedRulesFile, recommendedRulesContent);
