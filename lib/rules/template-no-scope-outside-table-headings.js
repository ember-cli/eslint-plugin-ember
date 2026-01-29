/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow scope attribute outside th/td elements',
      category: 'Possible Errors',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-scope-outside-table-headings.md',
    },
    schema: [],
    messages: {
      noScopeOutsideTableHeadings:
        'Unexpected scope attribute on <{{tagName}}>. Use only on <th> or <td>.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const tagName = node.tag;
        const hasScopeAttr = node.attributes.some(
          (attr) => attr.type === 'GlimmerAttrNode' && attr.name === 'scope'
        );

        if (hasScopeAttr && tagName !== 'th' && tagName !== 'td') {
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
