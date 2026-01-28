/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow this in template-only components (gjs/gts)',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-this-in-template-only-components.md',
    },
    schema: [],
    messages: {
      noThis:
        "Usage of 'this' in path '{{original}}' is not allowed in a template-only component. Use '{{fixed}}' if it is a named argument.",
    },
  },
  create(context) {
    return {
      GlimmerPathExpression(node) {
        // In gjs/gts files with <template> tags, check for this.* usage
        if (node.head?.type === 'ThisHead' && node.tail?.length > 0) {
          const original = node.original;
          const fixed = `@${node.tail[0]}`;
          context.report({
            node,
            messageId: 'noThis',
            data: { original, fixed },
          });
        }
      },
    };
  },
};
