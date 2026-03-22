/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow this in template-only components (gjs/gts)',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-this-in-template-only-components.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noThis:
        "Usage of 'this' in path '{{original}}' is not allowed in a template-only component. Use '{{fixed}}' if it is a named argument.",
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-this-in-template-only-components.js',
      docs: 'docs/rule/no-this-in-template-only-components.md',
      tests: 'test/unit/rules/no-this-in-template-only-components-test.js',
    },
  },
  create(context) {
    // Properties that should not be auto-fixed (built-in component properties)
    const BUILTIN_PROPERTIES = new Set([
      'action',
      'element',
      'parentView',
      'attrs',
      'elementId',
      'tagName',
      'ariaRole',
      'class',
      'classNames',
      'classNameBindings',
      'attributeBindings',
      'isVisible',
      'isDestroying',
      'isDestroyed',
    ]);

    return {
      GlimmerPathExpression(node) {
        // Only flag template-only components, not class components.
        // Walk ancestors to check if the <template> is inside a class body.
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const ancestors = sourceCode.getAncestors
          ? sourceCode.getAncestors(node)
          : context.getAncestors();
        const isInsideClass = ancestors.some(
          (ancestor) => ancestor.type === 'ClassBody' || ancestor.type === 'ClassDeclaration'
        );
        if (isInsideClass) {
          return;
        }

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
