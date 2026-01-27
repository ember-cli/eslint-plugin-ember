/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow duplicate landmark elements without unique labels',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-duplicate-landmark-elements.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      duplicate:
        'Duplicate <{{element}}> landmark element found. Each landmark must have a unique label.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-duplicate-landmark-elements.js',
      docs: 'docs/rule/no-duplicate-landmark-elements.md',
      tests: 'test/unit/rules/no-duplicate-landmark-elements-test.js',
    },
  },

  create(context) {
    // Map HTML5 landmark elements to their implicit ARIA roles
    const ELEMENT_TO_ROLE = {
      header: 'banner',
      footer: 'contentinfo',
      main: 'main',
      nav: 'navigation',
      aside: 'complementary',
      section: 'region',
      form: 'form',
    };

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

    // Sectioning elements that strip banner/contentinfo roles from header/footer
    const SECTIONING_ELEMENTS = new Set(['article', 'aside', 'main', 'nav', 'section']);
    const elementStack = [];

    // Stack-based scoping for landmarks to handle conditional branches.
    // Each scope is a Map<role, [{node, tag}]>.
    // When entering a GlimmerBlock that is a branch of an if/unless,
    // we push a copy of the current scope so that each branch starts
    // from the same baseline and landmarks from one branch don't
    // leak into another.
    const landmarksStack = [new Map()];

    function currentLandmarks() {
      return landmarksStack.at(-1);
    }

    function cloneLandmarks(landmarks) {
      const clone = new Map();
      for (const [role, entries] of landmarks) {
        clone.set(role, [...entries]);
      }
      return clone;
    }

    function isInsideSectioningElement() {
      return elementStack.some((tag) => SECTIONING_ELEMENTS.has(tag));
    }

    function checkDuplicates(landmarks) {
      for (const [, entries] of landmarks) {
        if (entries.length > 1) {
          const labeled = [];
          const unlabeled = [];

          for (const entry of entries) {
            const label = getLabel(entry.node);
            if (label) {
              labeled.push({ node: entry.node, tag: entry.tag, label });
            } else {
              unlabeled.push({ node: entry.node, tag: entry.tag });
            }
          }

          // When multiple landmarks of same type exist, unlabeled ones are violations
          if (unlabeled.length > 0) {
            if (unlabeled.length === entries.length) {
              // All unlabeled — report all but the first
              for (let i = 1; i < unlabeled.length; i++) {
                context.report({
                  node: unlabeled[i].node,
                  messageId: 'duplicate',
                  data: { element: unlabeled[i].tag },
                });
              }
            } else {
              // Some are labeled, some aren't — report the unlabeled ones
              for (const entry of unlabeled) {
                context.report({
                  node: entry.node,
                  messageId: 'duplicate',
                  data: { element: entry.tag },
                });
              }
            }
          }

          // Report same-label duplicates among labeled landmarks
          const labelGroups = new Map();
          for (const entry of labeled) {
            if (!labelGroups.has(entry.label)) {
              labelGroups.set(entry.label, []);
            }
            labelGroups.get(entry.label).push(entry);
          }
          for (const [, groupEntries] of labelGroups) {
            if (groupEntries.length > 1) {
              for (let i = 1; i < groupEntries.length; i++) {
                context.report({
                  node: groupEntries[i].node,
                  messageId: 'duplicate',
                  data: { element: groupEntries[i].tag },
                });
              }
            }
          }
        }
      }
    }

    return {
      GlimmerElementNode(node) {
        elementStack.push(node.tag);

        const landmarkRole = getLandmarkRole(
          node,
          LANDMARK_ROLES,
          ELEMENT_TO_ROLE,
          isInsideSectioningElement()
        );
        if (landmarkRole) {
          const landmarks = currentLandmarks();
          if (!landmarks.has(landmarkRole)) {
            landmarks.set(landmarkRole, []);
          }
          landmarks.get(landmarkRole).push({ node, tag: node.tag });
        }
      },

      'GlimmerElementNode:exit'() {
        elementStack.pop();
      },

      GlimmerBlock(node) {
        const parent = node.parent;
        if (parent && isIfUnless(parent)) {
          // Entering a branch of an if/unless block.
          // Push a copy of the scope from BEFORE the conditional
          // (which is the second-to-last on the stack, since the
          // conditional's own scope was pushed on enter).
          const parentScope = landmarksStack.at(-2) || landmarksStack.at(-1);
          landmarksStack.push(cloneLandmarks(parentScope));
        }
      },

      'GlimmerBlock:exit'(node) {
        const parent = node.parent;
        if (parent && isIfUnless(parent)) {
          landmarksStack.pop();
        }
      },

      GlimmerBlockStatement(node) {
        if (isIfUnless(node)) {
          // Push a scope for the conditional block itself.
          // Each branch (GlimmerBlock) will push its own scope on top.
          landmarksStack.push(cloneLandmarks(currentLandmarks()));
        }
      },

      'GlimmerBlockStatement:exit'(node) {
        if (isIfUnless(node)) {
          landmarksStack.pop();
        }
      },

      'Program:exit'() {
        checkDuplicates(currentLandmarks());
      },
    };
  },
};

function isIfUnless(node) {
  if (node.type === 'GlimmerBlockStatement' && node.path?.type === 'GlimmerPathExpression') {
    return ['if', 'unless'].includes(node.path.original);
  }
  return false;
}

function getLabel(node) {
  // Check aria-label
  const ariaLabel = node.attributes?.find((attr) => attr.name === 'aria-label');
  if (ariaLabel) {
    if (ariaLabel.value?.type === 'GlimmerTextNode') {
      return ariaLabel.value.chars.trim();
    }
    // Dynamic aria-label — treat as a unique label (can't statically determine duplicates)
    return `__dynamic:${ariaLabel.range?.[0] || Math.random()}`;
  }

  // Check aria-labelledby - extract the ID value
  const ariaLabelledby = node.attributes?.find((attr) => attr.name === 'aria-labelledby');
  if (ariaLabelledby) {
    if (ariaLabelledby.value?.type === 'GlimmerTextNode') {
      return `__labelledby:${ariaLabelledby.value.chars.trim()}`;
    }
    return `__dynamic:${ariaLabelledby.range?.[0] || Math.random()}`;
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

function getLandmarkRole(node, LANDMARK_ROLES, ELEMENT_TO_ROLE, insideSectioning) {
  const role = getRoleValue(node);
  if (role && LANDMARK_ROLES.has(role)) {
    return role;
  }
  const implicitRole = ELEMENT_TO_ROLE[node.tag];
  if (implicitRole) {
    // header and footer lose their landmark role when inside sectioning elements
    if (insideSectioning && (node.tag === 'header' || node.tag === 'footer')) {
      return null;
    }
    return implicitRole;
  }
  return null;
}
