const types = require('../utils/types');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce v2 addon boilerplate in the package.json',
      category: 'Miscellaneous',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/v2-addon-package-json.md',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    const fileName = context.getFilename();

    if (!fileName.endsWith('package.json')) {
      return {};
    }

    // eslint-disable-next-line import/no-dynamic-require
    const pJson = require(fileName);
    const { keywords, 'ember-addon': emberAddon, files, exports, repository } = pJson;

    const report = (message, id) => {
      context.report({
        ruleId: id ?? 'v2-addon-package-json',
        message,
        loc: {
          start: { line: 0, column: 0 },
          end: { line: 1, column: 1 },
        },
      });
    };

    if (!keywords) {
      report('keywords is missing');
    }

    if (!Array.isArray(keywords)) {
      report('keywords must be an array');
    }

    if (keywords?.includes('ember-addon')) {
      report('keywords must have "ember-addon" as one of the entries');
    }

    if (!emberAddon) {
      report('"ember-addon" entry is missing');
    }

    if (emberAddon && Number.parseInt(emberAddon.version, 10) !== 2) {
      report('"ember-addon.version" must be "2"');
    }

    if (!files) {
      report('"files" entry is missing');
    }

    if (!exports) {
      report('"exports" entry is missing');
    }

    if (!repository) {
      report('"repository" entry is missing');
    }

    return {};
  },
};
