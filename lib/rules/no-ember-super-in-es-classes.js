'use strict';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow use of `this._super` in ES class methods',
      category: 'Ember Octane',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-ember-super-in-es-classes.md',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    return {
      'MethodDefinition MemberExpression[object.type="ThisExpression"][property.name="_super"]'(
        node
      ) {
        context.report({
          node,
          message: "Don't use `this._super` in ES classes; instead, you should use `super`",
          fix(fixer) {
            let method = node;
            while (method.type !== 'MethodDefinition') {
              method = method.parent;
            }

            if (method.key.type === 'Identifier') {
              return fixer.replaceText(node, `super.${method.key.name}`);
            }

            const text = context.getSourceCode().getText(method.key);
            return fixer.replaceText(node, `super[${text}]`);
          },
        });
      },
    };
  },
};
