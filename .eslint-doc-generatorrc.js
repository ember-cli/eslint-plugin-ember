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
};
