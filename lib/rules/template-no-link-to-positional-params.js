/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow positional params in LinkTo component',
      category: 'Deprecations',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-link-to-positional-params.md',
    },
    schema: [],
    messages: {
      noLinkToPositionalParams: 'Positional params in LinkTo are deprecated. Use @route instead.',
    },
  },

  create(context) {
    function isLinkToComponent(node) {
      if (node.type === 'GlimmerElementNode') {
        return node.tag === 'LinkTo' || node.tag === 'link-to';
      }
      return false;
    }

    return {
      GlimmerElementNode(node) {
        if (!isLinkToComponent(node)) {
          return;
        }

        // Check if there are positional params (non-@ attributes without = sign, which are params)
        const hasPositionalParams = node.attributes.some(
          (attr) =>
            attr.type === 'GlimmerAttrNode' &&
            !attr.name.startsWith('@') &&
            attr.value &&
            attr.value.type !== 'GlimmerTextNode' &&
            !node.modifiers.some((mod) => mod.path.original === attr.name)
        );

        if (hasPositionalParams) {
          context.report({
            node,
            messageId: 'noLinkToPositionalParams',
          });
        }
      },
    };
  },
};
