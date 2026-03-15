/* eslint-disable unicorn/consistent-function-scoping */

const SIMPLE_DASHERIZE_REGEXP = /[A-Z]/g;
const ALPHA = /[A-Za-z]/;

function dasherize(key) {
  return key
    .replaceAll(SIMPLE_DASHERIZE_REGEXP, (char, index) => {
      if (index === 0 || !ALPHA.test(key[index - 1])) {
        return char.toLowerCase();
      }
      return `-${char.toLowerCase()}`;
    })
    .replaceAll('::', '/');
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require dasherized names for modifiers',
      category: 'Stylistic Issues',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-modifier-name-case.md',
      templateMode: 'loose',
    },
    fixable: 'code',
    schema: [],
    messages: {
      dasherized:
        'Use dasherized names for modifier invocation. Please replace `{{modifierName}}` with `{{dasherizedName}}`.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/modifier-name-case.js',
      docs: 'docs/rule/modifier-name-case.md',
      tests: 'test/unit/rules/modifier-name-case-test.js',
    },
  },

  create(context) {
    const filename = context.filename;
    if (!filename.endsWith('.hbs')) {
      return {};
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
          const dasherizedName = dasherize(modifierName);
          context.report({
            node,
            messageId: 'dasherized',
            data: { modifierName, dasherizedName },
            fix(fixer) {
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
            const dasherizedName = dasherize(modifierName);
            context.report({
              node: nameParam,
              messageId: 'dasherized',
              data: { modifierName, dasherizedName },
              fix(fixer) {
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
            const dasherizedName = dasherize(modifierName);
            context.report({
              node: nameParam,
              messageId: 'dasherized',
              data: { modifierName, dasherizedName },
              fix(fixer) {
                return fixer.replaceTextRange(nameParam.range, `"${dasherizedName}"`);
              },
            });
          }
        }
      },
    };
  },
};
/* eslint-enable unicorn/consistent-function-scoping */
