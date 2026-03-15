'use strict';

const editorConfigUtil = require('../utils/editorconfig');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'require or disallow newline at the end of template files',
      category: 'Stylistic Issues',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-eol-last.md',
      templateMode: 'both',
    },
    fixable: 'whitespace',
    schema: [
      {
        enum: ['always', 'never', 'editorconfig'],
      },
    ],
    messages: {
      mustEnd: 'template must end with newline',
      mustNotEnd: 'template cannot end with newline',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/eol-last.js',
      docs: 'docs/rule/eol-last.md',
      tests: 'test/unit/rules/eol-last-test.js',
    },
  },

  create(context) {
    const option = context.options[0] || 'always';
    let config = option;

    if (option === 'editorconfig') {
      const editorConfig = editorConfigUtil.resolveEditorConfig(context.filename);
      const insertFinalNewline = editorConfig['insert_final_newline'];
      if (typeof insertFinalNewline === 'boolean') {
        config = insertFinalNewline ? 'always' : 'never';
      } else {
        throw new TypeError(
          `The template-eol-last rule allows setting the configuration to \`"editorconfig"\` only when an \`.editorconfig\` file with the \`insert_final_newline\` setting exists.\n\nFound: ${JSON.stringify(editorConfig, null, 2)}`
        );
      }
    }

    const sourceCode = context.sourceCode;

    return {
      'GlimmerTemplate:exit'(node) {
        if (node.body.length === 0) {
          return;
        }

        // In gjs/gts mode, the template is wrapped in <template> tags — eol-last
        // only applies to standalone .hbs files. File-level eol-last for gjs/gts
        // is handled by the standard eslint eol-last rule.
        const templateSource = sourceCode.getText(node);
        if (templateSource.startsWith('<template>')) {
          return;
        }
        const lastChar = templateSource.at(-1);

        if (config === 'always' && lastChar !== '\n') {
          context.report({
            node,
            messageId: 'mustEnd',
            fix(fixer) {
              return fixer.insertTextAfter(node.body.at(-1), '\n');
            },
          });
        } else if (config === 'never' && lastChar === '\n') {
          const lastBody = node.body.at(-1);
          context.report({
            node,
            messageId: 'mustNotEnd',
            fix(fixer) {
              // Trailing newline may be inside the last text node or in a gap after the last body node
              if (lastBody.type === 'GlimmerTextNode' && lastBody.chars.endsWith('\n')) {
                const text = sourceCode.getText(lastBody);
                return fixer.replaceText(lastBody, text.replace(/\n$/, ''));
              }
              // Trailing newline is after the last body node (e.g., after <img> or </div>)
              return fixer.removeRange([node.range[1] - 1, node.range[1]]);
            },
          });
        }
      },
    };
  },
};
