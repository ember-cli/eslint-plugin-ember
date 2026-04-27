const { getBranchPath, areMutuallyExclusive } = require('../utils/control-flow');

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

    // Scope-root stack — a new scope starts at <dialog> and at any element
    // carrying a `popover` attribute. Landmarks in different scope roots
    // never collide with each other, matching the WAI-ARIA convention that
    // these elements present their own landmark hierarchy.
    const scopeRootStack = [null]; // root scope keyed by `null`

    function currentScopeRoot() {
      return scopeRootStack.at(-1);
    }

    function isInsideSectioningElement() {
      return elementStack.some((tag) => SECTIONING_ELEMENTS.has(tag));
    }

    // Accumulate every landmark in document order. At Program:exit we group
    // by (scopeRoot, role) and do pairwise duplicate detection, filtering out
    // pairs whose branch paths are mutually exclusive (different branches of
    // the same {{#if}} / {{#unless}} / {{#each}}…{{else}}… — these never
    // both render at runtime).
    const landmarks = [];

    function reportAgainstLabelGroup(entries) {
      // All-labeled same-label collisions: every entry after the first is a
      // duplicate of earlier ones that can co-render.
      const labeled = entries.filter((e) => e.label !== null);
      const unlabeled = entries.filter((e) => e.label === null);

      // Unlabeled duplicates:
      //   - If EVERY entry is unlabeled, report all except the first.
      //   - If some are labeled, report all unlabeled entries.
      if (unlabeled.length > 0) {
        if (unlabeled.length === entries.length) {
          for (let i = 1; i < unlabeled.length; i++) {
            context.report({ node: unlabeled[i].node, messageId: 'duplicate' });
          }
        } else {
          for (const entry of unlabeled) {
            context.report({ node: entry.node, messageId: 'duplicate' });
          }
        }
      }

      // Same-label collisions among labeled entries: group by label.
      const byLabel = new Map();
      for (const entry of labeled) {
        if (!byLabel.has(entry.label)) {
          byLabel.set(entry.label, []);
        }
        byLabel.get(entry.label).push(entry);
      }
      for (const [, group] of byLabel) {
        if (group.length > 1) {
          for (let i = 1; i < group.length; i++) {
            context.report({ node: group[i].node, messageId: 'duplicate' });
          }
        }
      }
    }

    // For a cluster of landmarks sharing (scopeRoot, role), drop entries whose
    // branch paths make them mutually exclusive with every other entry in the
    // cluster — those can never co-render and so can't collide. What remains
    // is the set of entries that COULD co-render; apply the labeled /
    // unlabeled duplicate rules to that residue.
    function checkCoRenderingCluster(entries) {
      if (entries.length < 2) {
        return;
      }
      // Keep any entry that has at least one other entry it can co-render
      // with. `areMutuallyExclusive` is commutative, so a single pass is
      // enough.
      const coRendering = entries.filter((entry) =>
        entries.some((other) => other !== entry && !areMutuallyExclusive(entry.path, other.path))
      );
      reportAgainstLabelGroup(coRendering);
    }

    return {
      GlimmerElementNode(node) {
        elementStack.push(node.tag);

        if (isNewScopeElement(node)) {
          scopeRootStack.push(node);
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
        if (!landmarkRole) {
          return;
        }

        // Dynamic aria-label / aria-labelledby — can't statically determine
        // whether this landmark duplicates a sibling, so skip registering.
        const labelAttr =
          node.attributes?.find((attr) => attr.name === 'aria-label') ||
          node.attributes?.find((attr) => attr.name === 'aria-labelledby');
        if (labelAttr && labelAttr.value?.type !== 'GlimmerTextNode') {
          return;
        }

        landmarks.push({
          node,
          tag: node.tag,
          role: landmarkRole,
          label: getLabel(node),
          path: getBranchPath(node),
          scopeRoot: currentScopeRoot(),
        });
      },

      'GlimmerElementNode:exit'(node) {
        elementStack.pop();
        if (scopeRootStack.at(-1) === node) {
          scopeRootStack.pop();
        }
      },

      'Program:exit'() {
        // Group by (scopeRoot, role). Keyed by node identity via WeakMap —
        // string keys derived from `loc` risk collisions when loc is missing
        // (synthetic nodes) or zeroed (parser edge cases). A WeakMap of the
        // actual scope-root node objects is collision-free by construction.
        // The root scope (no enclosing <dialog>/popover) lives in a
        // sibling Map (WeakMap requires object keys, so null-keyed root
        // clusters use a plain Map).
        const rootClusters = new Map(); // role → entries[]
        const byScopeRoot = new WeakMap(); // scopeRootNode → Map<role, entries[]>
        for (const entry of landmarks) {
          const map = entry.scopeRoot
            ? byScopeRoot.get(entry.scopeRoot) ||
              byScopeRoot.set(entry.scopeRoot, new Map()).get(entry.scopeRoot)
            : rootClusters;
          if (!map.has(entry.role)) {
            map.set(entry.role, []);
          }
          map.get(entry.role).push(entry);
        }
        for (const [, entries] of rootClusters) {
          checkCoRenderingCluster(entries);
        }
        // WeakMap is not iterable; walk back through the landmarks list to
        // collect the unique scope-root nodes we saw, dedupe, then process.
        const seenScopeRoots = new Set();
        for (const entry of landmarks) {
          if (entry.scopeRoot && !seenScopeRoots.has(entry.scopeRoot)) {
            seenScopeRoots.add(entry.scopeRoot);
            const map = byScopeRoot.get(entry.scopeRoot);
            if (map) {
              for (const [, entries] of map) {
                checkCoRenderingCluster(entries);
              }
            }
          }
        }
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
