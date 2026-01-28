/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow duplicate landmark elements without unique labels',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-duplicate-landmark-elements.md',
    },
    fixable: null,
    schema: [],
    messages: {
      duplicate:
        'Duplicate <{{element}}> landmark element found. Each landmark must have a unique label.',
    },
  },

  create(context) {
    // HTML5 landmark elements
    const LANDMARK_ELEMENTS = new Set(['header', 'footer', 'main', 'nav', 'aside', 'section']);

    // Landmark ARIA roles
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

    const landmarks = new Map();

    return {
      'Program:exit'() {
        // Check for duplicates
        for (const [key, nodes] of landmarks) {
          if (nodes.length > 1) {
            // Check if all have unique labels
            const labelsMap = new Map();
            for (const node of nodes) {
              const label = getLabel(node);
              if (!label) {
                // Missing label - report
                context.report({
                  node,
                  messageId: 'duplicate',
                  data: { element: key },
                });
              } else if (labelsMap.has(label)) {
                // Duplicate label - report
                context.report({
                  node,
                  messageId: 'duplicate',
                  data: { element: key },
                });
              } else {
                labelsMap.set(label, true);
              }
            }
          }
        }
      },

      GlimmerElementNode(node) {
        const landmarkKey = getLandmarkKey(node, LANDMARK_ROLES, LANDMARK_ELEMENTS);
        if (landmarkKey) {
          if (!landmarks.has(landmarkKey)) {
            landmarks.set(landmarkKey, []);
          }
          landmarks.get(landmarkKey).push(node);
        }
      },
    };
  },
};

function getLabel(node) {
  // Check aria-label
  const ariaLabel = node.attributes?.find((attr) => attr.name === 'aria-label');
  if (ariaLabel && ariaLabel.value?.type === 'GlimmerTextNode') {
    return ariaLabel.value.chars.trim();
  }

  // Check aria-labelledby
  const ariaLabelledby = node.attributes?.find((attr) => attr.name === 'aria-labelledby');
  if (ariaLabelledby) {
    return '__labelledby__'; // Assume unique
  }

  return null;
}

function getRoleValue(node) {
  const roleAttr = node.attributes?.find((attr) => attr.name === 'role');
  if (roleAttr && roleAttr.value?.type === 'GlimmerTextNode') {
    return roleAttr.value.chars.trim();
  }
  return null;
}

function getLandmarkKey(node, LANDMARK_ROLES, LANDMARK_ELEMENTS) {
  const role = getRoleValue(node);
  if (role && LANDMARK_ROLES.has(role)) {
    return role;
  }
  if (LANDMARK_ELEMENTS.has(node.tag)) {
    return node.tag;
  }
  return null;
}
