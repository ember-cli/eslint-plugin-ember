const LANDMARK_ROLES = new Set([
  'banner',
  'complementary',
  'contentinfo',
  'form',
  'main',
  'navigation',
  'region',
  'search',
]);

const LANDMARK_ELEMENTS = new Set(['header', 'aside', 'footer', 'form', 'main', 'nav', 'section']);

function isLandmark(node) {
  // Check if element is inherently a landmark
  if (LANDMARK_ELEMENTS.has(node.tag)) {
    return true;
  }

  // Check if element has a landmark role
  const roleAttr = node.attributes?.find((a) => a.name === 'role');
  if (roleAttr?.value?.type === 'GlimmerTextNode') {
    return LANDMARK_ROLES.has(roleAttr.value.chars);
  }

  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow nested landmark elements',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-nested-landmark.md',
    },
    fixable: null,
    schema: [],
    messages: {
      nested: 'Landmark elements should not be nested within other landmarks.',
    },
  },

  create(context) {
    const landmarkStack = [];

    return {
      GlimmerElementNode(node) {
        const isCurrentLandmark = isLandmark(node);

        if (isCurrentLandmark && landmarkStack.length > 0) {
          context.report({
            node,
            messageId: 'nested',
          });
        }

        if (isCurrentLandmark) {
          landmarkStack.push(node);
        }
      },

      'GlimmerElementNode:exit'(node) {
        if (isLandmark(node)) {
          landmarkStack.pop();
        }
      },
    };
  },
};
