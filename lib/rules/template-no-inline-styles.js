/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow inline styles',
      category: 'Best Practices',
      recommendedGjs: false,
      recommendedGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-inline-styles.md',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowDynamicStyles: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: { noInlineStyles: 'Inline styles are not allowed' },
  },
  create(context) {
    const options = context.options[0] || {};
    const allowDynamicStyles =
      options.allowDynamicStyles === undefined ? true : options.allowDynamicStyles;

    return {
      GlimmerElementNode(node) {
        const styleAttr = node.attributes?.find((a) => a.name === 'style');
        if (!styleAttr) {
          return;
        }

        // If allowDynamicStyles is true, skip dynamic style values (MustacheStatement/ConcatStatement)
        if (allowDynamicStyles) {
          const valType = styleAttr.value?.type;
          if (valType === 'GlimmerMustacheStatement' || valType === 'GlimmerConcatStatement') {
            return;
          }
        }

        context.report({ node: styleAttr, messageId: 'noInlineStyles' });
      },
    };
  },
};
