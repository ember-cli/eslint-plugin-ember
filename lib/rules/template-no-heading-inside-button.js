const HEADING_ELEMENTS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function hasButtonParent(node) {
  let parent = node.parent;
  while (parent) {
    if (parent.type === 'GlimmerElementNode') {
      // Check if it's a button element
      if (parent.tag === 'button') {
        return true;
      }
      // Check if it has role="button"
      const roleAttr = parent.attributes?.find((a) => a.name === 'role');
      if (roleAttr?.value?.type === 'GlimmerTextNode' && roleAttr.value.chars === 'button') {
        return true;
      }
    }
    parent = parent.parent;
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow heading elements inside button elements',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-heading-inside-button.md',
    },
    schema: [],
    messages: {
      noHeading: 'Buttons should not contain heading elements',
    },
  },
  create(context) {
    return {
      GlimmerElementNode(node) {
        if (HEADING_ELEMENTS.has(node.tag) && hasButtonParent(node)) {
          context.report({ node, messageId: 'noHeading' });
        }
      },
    };
  },
};
