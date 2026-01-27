const PRESENTATIONAL_ROLES = new Set(['none', 'presentation']);

const PRESENTATIONAL_CHILDREN = {
  table: ['tr', 'td', 'th', 'thead', 'tbody', 'tfoot'],
  select: ['option', 'optgroup'],
  ol: ['li'],
  ul: ['li'],
  dl: ['dt', 'dd'],
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require presentational elements to only contain presentational children',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-presentational-children.md',
    },
    fixable: null,
    schema: [],
    messages: {
      invalid:
        'Element <{{parent}}> has role="{{role}}" but contains semantic child <{{child}}>. Presentational elements should only contain presentational children.',
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
        if (!PRESENTATIONAL_ROLES.has(role)) {
          return;
        }

        const semanticChildren = PRESENTATIONAL_CHILDREN[node.tag];
        if (!semanticChildren) {
          return;
        }

        // Check if any children are semantic elements
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
      },
    };
  },
};
