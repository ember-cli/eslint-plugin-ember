function isActionHelper(node) {
  if (!node.path || node.path.type !== 'GlimmerPathExpression') {
    return false;
  }

  // Check if it's the action helper (not this.action or @action)
  const path = node.path;
  if (path.original === 'action') {
    // Check head.type to avoid deprecated data/this properties
    const head = path.head;
    if (head && (head.type === 'AtHead' || head.type === 'ThisHead')) {
      return false;
    }
    return true;
  }

  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow {{action}} helper',
      category: 'Deprecations',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-action.md',
    },
    fixable: null,
    schema: [],
    messages: {
      subExpression:
        'Do not use `action` as (action ...). Instead, use the `on` modifier and `fn` helper.',
      mustache: 'Do not use `action` in templates. Instead, use the `on` modifier and `fn` helper.',
      modifier:
        'Do not use `action` as an element modifier. Instead, use the `on` modifier and `fn` helper.',
    },
  },

  create(context) {
    return {
      GlimmerSubExpression(node) {
        if (isActionHelper(node)) {
          context.report({
            node,
            messageId: 'subExpression',
          });
        }
      },

      GlimmerMustacheStatement(node) {
        if (isActionHelper(node)) {
          context.report({
            node,
            messageId: 'mustache',
          });
        }
      },

      GlimmerElementModifierStatement(node) {
        if (isActionHelper(node)) {
          context.report({
            node,
            messageId: 'modifier',
          });
        }
      },
    };
  },
};
