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

function generate(filename, filter, { disableFilter } = {}) {
  const root = path.resolve(__dirname, '../lib/rules');
  const recommendedRulesFile = path.resolve(__dirname, filename);

  const rules = fs
    .readdirSync(root)
    .filter((file) => path.extname(file) === '.js')
    .map((file) => path.basename(file, '.js'))
    .map((fileName) => [fileName, require(path.join(root, fileName))]); // eslint-disable-line import/no-dynamic-require

  const recommendedRules = rules.reduce((obj, entry) => {
    const name = `ember/${entry[0]}`;
    if (disableFilter && disableFilter(entry)) {
      obj[name] = 'off'; // eslint-disable-line no-param-reassign
    } else if (filter(entry)) {
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
module.exports = ${JSON.stringify(recommendedRules, null, 2)};
`;

  fs.writeFileSync(recommendedRulesFile, recommendedRulesContent);
}

// Loose-mode rules that are in the base recommended config need to be turned off
// in gjs/gts configs, since those patterns don't exist in strict mode.
const isLooseRecommended = (entry) =>
  entry[1].meta.docs.recommended && entry[1].meta.docs.templateMode === 'loose';

generate('../lib/recommended-rules.js', (entry) => entry[1].meta.docs.recommended);
generate('../lib/recommended-rules-gjs.js', (entry) => entry[1].meta.docs.recommendedGjs, {
  disableFilter: isLooseRecommended,
});
generate('../lib/recommended-rules-gts.js', (entry) => entry[1].meta.docs.recommendedGts, {
  disableFilter: isLooseRecommended,
});
