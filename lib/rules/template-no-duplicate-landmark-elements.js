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
        'If multiple landmark elements (or elements with an equivalent role) of the same type are found on a page, they must each have a unique label.',
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
                });
              }
            } else {
              // Some are labeled, some aren't — report the unlabeled ones
              for (const entry of unlabeled) {
                context.report({
                  node: entry.node,
                  messageId: 'duplicate',
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
                });
              }
            }
          }
        }
      }
    }

    // Track elements that create new landmark scopes (dialog, popover)
    const newScopeElements = [];

    return {
      GlimmerElementNode(node) {
        elementStack.push(node.tag);

        // <dialog> and elements with popover attribute create isolated landmark scopes
        if (isNewScopeElement(node)) {
          landmarksStack.push(new Map());
          newScopeElements.push(node);
        }

        // Dynamic role values — skip (can't determine role statically)
        const roleAttr = node.attributes?.find((attr) => attr.name === 'role');
        if (roleAttr && roleAttr.value?.type !== 'GlimmerTextNode') {
          return;
        }

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

      'GlimmerElementNode:exit'(node) {
        elementStack.pop();
        if (newScopeElements.at(-1) === node) {
          newScopeElements.pop();
          landmarksStack.pop();
        }
      },

      // Every Block gets its own scope (matching the original's Block visitor).
      // This handles each, let, with, etc. — not just if/unless.
      GlimmerBlock() {
        landmarksStack.push(cloneLandmarks(currentLandmarks()));
      },

      'GlimmerBlock:exit'() {
        landmarksStack.pop();
      },

      'Program:exit'() {
        checkDuplicates(currentLandmarks());
      },
    };
  },
};

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

function isNewScopeElement(node) {
  return node.tag === 'dialog' || node.attributes?.some((attr) => attr.name === 'popover');
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
