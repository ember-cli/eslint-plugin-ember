/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow element event actions (use {{on}} modifier instead)',
      category: 'Best Practices',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-element-event-actions.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          requireActionHelper: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noElementEventActions: 'Do not use element event actions. Use the `on` modifier instead.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    const options = context.options[0] || {};
    const requireActionHelper = options.requireActionHelper || false;

    return {
      GlimmerElementNode(node) {
        if (!node.attributes) {
          return;
        }

        for (const attr of node.attributes) {
          if (attr.type !== 'GlimmerAttrNode' || !attr.name) {
            continue;
          }
          const name = attr.name.toLowerCase();
          if (!name.startsWith('on')) {
            continue;
          }
          // Skip non-event attributes like "once", "open", etc.
          if (name.length <= 2) {
            continue;
          }

          // If requireActionHelper is true, only flag when the value uses {{action ...}}
          if (requireActionHelper) {
            if (
              attr.value?.type === 'GlimmerMustacheStatement' &&
              attr.value.path?.original === 'action'
            ) {
              context.report({ node: attr, messageId: 'noElementEventActions' });
            }
          } else {
            // Flag any mustache value on event attributes
            if (
              attr.value?.type === 'GlimmerMustacheStatement' ||
              attr.value?.type === 'GlimmerConcatStatement'
            ) {
              context.report({ node: attr, messageId: 'noElementEventActions' });
            }
          }
        }
      },
    };
  },
};
