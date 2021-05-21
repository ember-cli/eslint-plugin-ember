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
const readmeFile = path.resolve(__dirname, '../README.md');
const recommendedRulesFile = path.resolve(__dirname, '../lib/recommended-rules.js');
const tablePlaceholder = /<!--RULES_TABLE_START-->[\S\s]*<!--RULES_TABLE_END-->/;
const readmeContent = fs.readFileSync(readmeFile, 'utf8');

const RECOMMENDED = ':white_check_mark:';
const FIXABLE = ':wrench:';

const rules = fs
  .readdirSync(root)
  .filter((file) => path.extname(file) === '.js')
  .map((file) => path.basename(file, '.js'))
  .map((fileName) => [fileName, require(path.join(root, fileName))]); // eslint-disable-line import/no-dynamic-require

const categories = rules
  .map((entry) => entry[1].meta.docs.category)
  .reduce((arr, category) => {
    if (!arr.includes(category)) {
      arr.push(category);
    }
    return arr;
  }, [])
  .sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase()); // Case-insensitive sort function.
  });

let rulesTableContent = categories
  .map(
    (category) => `### ${category}

| Name    | Description | ${RECOMMENDED} | ${FIXABLE} |
|:--------|:------------|:---------------|:-----------|
${rules
  .filter(([, rule]) => rule.meta.docs.category === category && !rule.meta.deprecated)
  .map((entry) => {
    const name = entry[0];
    const meta = entry[1].meta;
    const link = `[${name}](./docs/rules/${name}.md)`;
    const description = meta.docs.description || '(no description)';
    return `| ${link} | ${description} | ${meta.docs.recommended ? RECOMMENDED : ''} | ${
      meta.fixable ? FIXABLE : ''
    } |`;
  })
  .join('\n')}
`
  )
  .join('\n');

const deprecatedRules = rules.filter((entry) => entry[1].meta.deprecated);
if (deprecatedRules.length > 0) {
  rulesTableContent += `
### Deprecated

> :warning: We're going to remove deprecated rules in the next major release. Please migrate to successor/new rules.

| Name    | Replaced by |
|:--------|:------------|
${deprecatedRules
  .map((entry) => {
    const name = entry[0];
    const meta = entry[1].meta;
    const link = `[${name}](./docs/rules/${name}.md)`;
    const replacedBy =
      (meta.docs.replacedBy || []).map((id) => `[${id}](./docs/rules/${id}.md)`).join(', ') ||
      '(no replacement)';
    return `| ${link} | ${replacedBy} |`;
  })
  .join('\n')}
`;
}

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

fs.writeFileSync(
  readmeFile,
  readmeContent.replace(
    tablePlaceholder,
    `<!--RULES_TABLE_START-->\n\n${rulesTableContent}\n<!--RULES_TABLE_END-->`
  )
);

fs.writeFileSync(recommendedRulesFile, recommendedRulesContent);
