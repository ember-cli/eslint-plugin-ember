/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow scope attribute outside th elements',
      category: 'Possible Errors',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-scope-outside-table-headings.md',
      templateMode: 'both',
    },
    schema: [],
    messages: {
      noScopeOutsideTableHeadings: 'Unexpected scope attribute on <{{tagName}}>. Use only on <th>.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-scope-outside-table-headings.js',
      docs: 'docs/rule/no-scope-outside-table-headings.md',
      tests: 'test/unit/rules/no-scope-outside-table-headings-test.js',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const tagName = node.tag;

        // Skip custom components (non-HTML elements)
        if (!tagName || /^[A-Z]/.test(tagName) || tagName.includes('.')) {
          return;
        }

        const hasScopeAttr = node.attributes.some(
          (attr) => attr.type === 'GlimmerAttrNode' && attr.name === 'scope'
        );

        if (hasScopeAttr && tagName !== 'th') {
          context.report({
            node,
            messageId: 'noScopeOutsideTableHeadings',
            data: { tagName },
          });
        }
      },
    };
  },
};
