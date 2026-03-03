const PRESENTATIONAL_ROLES = new Set(['none', 'presentation']);

const PRESENTATIONAL_CHILDREN = {
  table: ['tr', 'td', 'th', 'thead', 'tbody', 'tfoot'],
  select: ['option', 'optgroup'],
  ol: ['li'],
  ul: ['li'],
  dl: ['dt', 'dd'],
};

// Roles that require all descendants to be presentational
const ROLES_REQUIRING_PRESENTATIONAL_CHILDREN = new Set([
  'button',
  'checkbox',
  'img',
  'link',
  'menuitem',
  'option',
  'progressbar',
  'radio',
  'scrollbar',
  'separator',
  'slider',
  'switch',
  'tab',
  'treeitem',
]);

// Known semantic HTML elements that need role="presentation" when
// inside an element whose role requires presentational children
const SEMANTIC_ELEMENTS = new Set([
  'a',
  'article',
  'aside',
  'blockquote',
  'button',
  'caption',
  'dd',
  'details',
  'dialog',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'img',
  'input',
  'label',
  'legend',
  'li',
  'main',
  'mark',
  'meter',
  'nav',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'pre',
  'progress',
  'section',
  'select',
  'summary',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'tr',
  'ul',
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

function findSemanticDescendant(children) {
  for (const child of children || []) {
    if (child.type === 'GlimmerElementNode') {
      if (SEMANTIC_ELEMENTS.has(child.tag) && !hasPresentationalRole(child)) {
        return child;
      }
      const found = findSemanticDescendant(child.children);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require presentational elements to only contain presentational children',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-presentational-children.md',
    },
    fixable: null,
    schema: [],
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
              if (child.type === 'GlimmerElementNode' && semanticChildren.includes(child.tag)) {
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
          const semanticChild = findSemanticDescendant(node.children);
          if (semanticChild) {
            context.report({
              node,
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
