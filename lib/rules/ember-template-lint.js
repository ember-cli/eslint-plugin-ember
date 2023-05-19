'use strict';
const synckit = require('synckit');
const { cache } = require('../preprocessors/hbs');
const { TEXT_CACHE } = require('../preprocessors/glimmer');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'lint hbs files',
      category: 'template linting',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/ember-template-lint.md',
    },
    fixable: 'code',
  },

  create(context) {
    const config = {};
    let linter;
    let TemplateLinter;

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      Program: (node) => {
        try {
          const syncFn = synckit.createSyncFn(require.resolve('../preprocessors/hbs-worker'));
          const filename = context.getPhysicalFilename();
          const text = cache[filename] || TEXT_CACHE.get(filename) || context.getSourceCode().text;
          const response = syncFn(filename, text);
          const lintMessages = response.messages;
          for (const msg of lintMessages) {
            console.log(msg);
            msg.ruleId = `ember-template-lint/${msg.rule}`;
            context.report({
              fix: (fixer) => {
                if (!msg.isFixable) {
                  return null;
                }
                return {
                  range: [0, text.length],
                  text: response.withFix,
                };
              },
              loc: {
                start: {
                  line: msg.line,
                  column: msg.column,
                },
                end: {
                  line: msg.endLine,
                  column: msg.endColumn,
                },
              },
              message: `${msg.message} (${msg.ruleId})`,
            });
          }
        } catch (error) {
          console.error(error);
        }
      },
    };
  },
};
