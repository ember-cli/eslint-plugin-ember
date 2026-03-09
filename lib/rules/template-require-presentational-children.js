const PRESENTATIONAL_ROLES = new Set(['none', 'presentation']);

const PRESENTATIONAL_CHILDREN = {
  table: ['tr', 'td', 'th', 'thead', 'tbody', 'tfoot'],
  select: ['option', 'optgroup'],
  ol: ['li'],
  ul: ['li'],
  dl: ['dt', 'dd'],
};

// Roles that require all descendants to be presentational
// https://w3c.github.io/aria-practices/#children_presentational
const ROLES_REQUIRING_PRESENTATIONAL_CHILDREN = new Set([
  'button',
  'checkbox',
  'img',
  'meter',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'progressbar',
  'radio',
  'scrollbar',
  'separator',
  'slider',
  'switch',
  'tab',
]);

// Tags that do not have semantic meaning
const NON_SEMANTIC_TAGS = new Set([
  'span',
  'div',
  'basefont',
  'big',
  'blink',
  'center',
  'font',
  'marquee',
  's',
  'spacer',
  'strike',
  'tt',
  'u',
]);

const SKIPPED_TAGS = new Set([
  // SVG tags can contain a lot of special child tags
  // Instead of marking all possible SVG child tags as NON_SEMANTIC_TAG,
  // we skip checking this rule for presentational SVGs
  'svg',
]);

function getRoleValue(node) {
  const roleAttr = node.attributes?.find((a) => a.name === 'role');
  if (!roleAttr || roleAttr.value?.type !== 'GlimmerTextNode') {
    return null;
  }
  return roleAttr.value.chars;
}

function hasPresentationalRole(node) {
  const role = getRoleValue(node);
  return role !== null && PRESENTATIONAL_ROLES.has(role);
}

function findAllSemanticDescendants(children, nonSemanticTags, results) {
  for (const child of children || []) {
    if (child.type === 'GlimmerElementNode') {
      // If child tag starts with ':', it's a named block — skip it but recurse into its children
      if (child.tag.startsWith(':')) {
        findAllSemanticDescendants(child.children, nonSemanticTags, results);
        continue;
      }

      const isPresentational = hasPresentationalRole(child);

      // Include this node in results if it's not non-semantic and not presentational
      if (!nonSemanticTags.has(child.tag) && !isPresentational) {
        results.push(child);
      }

      // Always recurse into children — even if the current node is presentational,
      // its descendants may still be semantic and need to be reported
      findAllSemanticDescendants(child.children, nonSemanticTags, results);
    }
  }
  return results;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require presentational elements to only contain presentational children',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-presentational-children.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          additionalNonSemanticTags: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalid:
        'Element <{{parent}}> has role="{{role}}" but contains semantic child <{{child}}>. Presentational elements should only contain presentational children.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-presentational-children.js',
      docs: 'docs/rule/require-presentational-children.md',
      tests: 'test/unit/rules/require-presentational-children-test.js',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const nonSemanticTags = new Set([
      ...NON_SEMANTIC_TAGS,
      ...(options.additionalNonSemanticTags || []),
    ]);

    return {
      GlimmerElementNode(node) {
        const roleAttr = node.attributes?.find((a) => a.name === 'role');
        if (!roleAttr || roleAttr.value?.type !== 'GlimmerTextNode') {
          return;
        }

        const role = roleAttr.value.chars;

        // Case 1: Presentational role (none/presentation) on specific parent elements
        if (PRESENTATIONAL_ROLES.has(role)) {
          const semanticChildren = PRESENTATIONAL_CHILDREN[node.tag];
          if (!semanticChildren) {
            return;
          }

          if (node.children) {
            for (const child of node.children) {
              if (
                child.type === 'GlimmerElementNode' &&
                semanticChildren.includes(child.tag) &&
                !nonSemanticTags.has(child.tag)
              ) {
                context.report({
                  node: child,
                  messageId: 'invalid',
                  data: {
                    parent: node.tag,
                    role,
                    child: child.tag,
                  },
                });
              }
            }
          }
          return;
        }

        // Case 2: Roles that require all descendants to be presentational
        if (ROLES_REQUIRING_PRESENTATIONAL_CHILDREN.has(role)) {
          // Skip SVG and similar tags
          if (SKIPPED_TAGS.has(node.tag)) {
            return;
          }

          const semanticDescendants = findAllSemanticDescendants(
            node.children,
            nonSemanticTags,
            []
          );
          for (const semanticChild of semanticDescendants) {
            context.report({
              node: semanticChild,
              messageId: 'invalid',
              data: {
                parent: node.tag,
                role,
                child: semanticChild.tag,
              },
            });
          }
        }
      },
    };
  },
};
