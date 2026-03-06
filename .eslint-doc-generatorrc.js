const path = require('path');

const HBS_ONLY_NOTE =
  '> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.';

const END_HEADER_MARKER = '<!-- end auto-generated rule header -->';

/** @type {import('eslint-doc-generator').GenerateOptions} */
module.exports = {
  configEmoji: [
    ['recommended-gjs', '![gjs logo](/docs/svgs/gjs.svg)'],
    ['recommended-gts', '![gts logo](/docs/svgs/gts.svg)'],
  ],
  ruleDocSectionInclude: ['Examples'],
  ruleDocTitleFormat: 'prefix-name',
  ruleListSplit: 'meta.docs.category',
  urlConfigs: 'https://github.com/ember-cli/eslint-plugin-ember#-configurations',
  postprocess(content, filePath) {
    // Only process rule doc files
    if (!filePath.includes(path.join('docs', 'rules'))) {
      return content;
    }

    const ruleName = path.basename(filePath, '.md');

    let rule;
    try {
      rule = require(path.join(__dirname, 'lib', 'rules', ruleName));
    } catch {
      return content;
    }

    // Strip any existing HBS Only note (with surrounding blank lines)
    let result = content.replace(/\n> \*\*HBS Only\*\*:[^\n]+\n/, '\n');

    // Add HBS Only note for loose-mode rules
    if (rule.meta?.docs?.templateMode === 'loose') {
      result = result.replace(END_HEADER_MARKER, `${HBS_ONLY_NOTE}\n\n${END_HEADER_MARKER}`);
    }

    return result;
  },
};
