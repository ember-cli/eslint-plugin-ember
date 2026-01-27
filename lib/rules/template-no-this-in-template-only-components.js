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
    fixable: 'code',
    schema: [],
    messages: {
      noThis:
        "Usage of 'this' in path '{{original}}' is not allowed in a template-only component. Use '{{fixed}}' if it is a named argument.",
    },
  },
  create(context) {
    // Properties that should not be auto-fixed (built-in component properties)
    const BUILTIN_PROPERTIES = new Set([
      'elementId',
      'tagName',
      'ariaRole',
      'class',
      'classNames',
      'classNameBindings',
      'attributeBindings',
      'isVisible',
    ]);

    return {
      GlimmerPathExpression(node) {
        // In gjs/gts files with <template> tags, check for this.* usage
        if (node.head?.type === 'ThisHead' && node.tail?.length > 0) {
          const original = node.original;
          const firstPart = node.tail[0];
          const fixed = `@${node.tail.join('.')}`;
          const canFix = !BUILTIN_PROPERTIES.has(firstPart);

          context.report({
            node,
            messageId: 'noThis',
            data: { original, fixed },
            fix: canFix ? (fixer) => fixer.replaceText(node, fixed) : undefined,
          });
        }
      },
    };
  },
};
