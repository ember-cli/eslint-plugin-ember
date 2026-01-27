/* eslint-disable unicorn/consistent-function-scoping, eslint-plugin/no-unused-message-ids */

function dasherize(str) {
  return str.replaceAll(/([A-Z])/g, '-$1').toLowerCase();
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require dasherized names for modifiers',
      category: 'Stylistic Issues',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-modifier-name-case.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      dasherized:
        'Use dasherized names for modifier invocation. Please replace `{{dasherizeModifierName}}` with `{{dasherizeModifierName}}`.',
    },
  },

  create(context) {
    function generateErrorMessage(modifierName) {
      const dasherizedName = dasherize(modifierName);
      return `Use dasherized names for modifier invocation. Please replace \`${modifierName}\` with \`${dasherizedName}\`.`;
    }

    function isModifierHelper(node) {
      return (
        node.path && node.path.type === 'GlimmerPathExpression' && node.path.original === 'modifier'
      );
    }

    return {
      GlimmerElementModifierStatement(node) {
        const modifierName = node.path?.original;

        if (typeof modifierName === 'string' && modifierName !== dasherize(modifierName)) {
          context.report({
            node,
            message: generateErrorMessage(modifierName),
            fix(fixer) {
              const dasherizedName = dasherize(modifierName);
              return fixer.replaceTextRange(node.path.range, dasherizedName);
            },
          });
        }
      },

      GlimmerSubExpression(node) {
        if (!isModifierHelper(node)) {
          return;
        }

        const nameParam = node.params?.[0];

        if (nameParam && nameParam.type === 'GlimmerStringLiteral') {
          const modifierName = nameParam.value;

          if (typeof modifierName === 'string' && modifierName !== dasherize(modifierName)) {
            context.report({
              node: nameParam,
              message: generateErrorMessage(modifierName),
              fix(fixer) {
                const dasherizedName = dasherize(modifierName);
                return fixer.replaceTextRange(nameParam.range, `"${dasherizedName}"`);
              },
            });
          }
        }
      },

      GlimmerMustacheStatement(node) {
        if (!isModifierHelper(node)) {
          return;
        }

        const nameParam = node.params?.[0];

        if (nameParam && nameParam.type === 'GlimmerStringLiteral') {
          const modifierName = nameParam.value;

          if (typeof modifierName === 'string' && modifierName !== dasherize(modifierName)) {
            context.report({
              node: nameParam,
              message: generateErrorMessage(modifierName),
              fix(fixer) {
                const dasherizedName = dasherize(modifierName);
                return fixer.replaceTextRange(nameParam.range, `"${dasherizedName}"`);
              },
            });
          }
        }
      },
    };
  },
};
/* eslint-enable unicorn/consistent-function-scoping, eslint-plugin/no-unused-message-ids */
