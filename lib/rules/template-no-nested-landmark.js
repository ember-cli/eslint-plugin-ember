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

const EQUIVALENT_ROLE = {
  aside: 'complementary',
  footer: 'contentinfo',
  header: 'banner',
  main: 'main',
  nav: 'navigation',
  section: 'region',
};

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

function getLandmarkType(node) {
  // If node has an explicit role attribute, use that
  const roleAttr = node.attributes?.find((a) => a.name === 'role');
  if (roleAttr?.value?.type === 'GlimmerTextNode') {
    return roleAttr.value.chars;
  }
  // Otherwise, use the equivalent role for the tag
  return EQUIVALENT_ROLE[node.tag] || node.tag;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow nested landmark elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-nested-landmark.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      nested: 'Landmark elements should not be nested within other landmarks.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-nested-landmark.js',
      docs: 'docs/rule/no-nested-landmark.md',
      tests: 'test/unit/rules/no-nested-landmark-test.js',
    },
  },

  create(context) {
    const landmarkStack = [];

    return {
      GlimmerElementNode(node) {
        const isCurrentLandmark = isLandmark(node);

        if (isCurrentLandmark) {
          const currentType = getLandmarkType(node);
          // Check if any ancestor landmark has the same type
          for (const ancestor of landmarkStack) {
            if (getLandmarkType(ancestor) === currentType) {
              context.report({
                node,
                messageId: 'nested',
              });
              break;
            }
          }
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
