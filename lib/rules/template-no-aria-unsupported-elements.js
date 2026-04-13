/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow ARIA roles, states, and properties on elements that do not support them',
      category: 'Accessibility',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-aria-unsupported-elements.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unsupported:
        'ARIA attribute "{{attribute}}" is not supported on <{{element}}> elements. Consider using a different element.',
    },
  },

  create(context) {
    // Elements that don't support ARIA per the W3C ARIA in HTML spec.
    // Includes metadata/structural elements that have no UI representation.
    const ELEMENTS_WITHOUT_ARIA_SUPPORT = new Set([
      'meta',
      'html',
      'script',
      'style',
      'title',
      'base',
      'head',
      'link',
    ]);

    return {
      GlimmerElementNode(node) {
        if (ELEMENTS_WITHOUT_ARIA_SUPPORT.has(node.tag)) {
          const ariaAttributes = node.attributes?.filter(
            (attr) =>
              attr.type === 'GlimmerAttrNode' &&
              attr.name &&
              (attr.name.startsWith('aria-') || attr.name === 'role')
          );

          for (const attr of ariaAttributes || []) {
            context.report({
              node: attr,
              messageId: 'unsupported',
              data: {
                attribute: attr.name,
                element: node.tag,
              },
            });
          }
        }
      },
    };
  },
};
