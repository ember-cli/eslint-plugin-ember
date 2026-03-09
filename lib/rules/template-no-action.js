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
      templateMode: 'loose',
    },
    fixable: null,
    schema: [],
    messages: {
      subExpression:
        'Do not use `action` as (action ...). Instead, use the `on` modifier and `fn` helper.',
      mustache:
        'Do not use the `action` mustache helper. Instead, use the `on` modifier and `fn` helper.',
      elementModifier:
        'Do not use the `action` modifier on <{{tag}}>. Instead, use the `on` modifier and `fn` helper.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-action.js',
      docs: 'docs/rule/no-action.md',
      tests: 'test/unit/rules/no-action-test.js',
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
        if (!isActionHelper(node)) {
          return;
        }

        // Check if inside an attribute
        let parent = node.parent;
        let inAttribute = false;
        while (parent) {
          if (parent.type === 'GlimmerAttrNode') {
            inAttribute = true;
            break;
          }
          parent = parent.parent;
        }

        if (inAttribute) {
          // Only report when it has params/hash (definitely action helper, not a block param named "action")
          if (
            (node.params && node.params.length > 0) ||
            (node.hash && node.hash.pairs && node.hash.pairs.length > 0)
          ) {
            context.report({
              node,
              messageId: 'mustache',
            });
          }
          return;
        }

        context.report({
          node,
          messageId: 'mustache',
        });
      },

      GlimmerElementModifierStatement(node) {
        if (isActionHelper(node)) {
          const parentTag = node.parent && node.parent.tag ? node.parent.tag : 'unknown';
          context.report({
            node,
            messageId: 'elementModifier',
            data: { tag: parentTag },
          });
        }
      },
    };
  },
};
