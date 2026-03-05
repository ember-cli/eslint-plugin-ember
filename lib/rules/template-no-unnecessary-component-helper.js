/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary component helper',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unnecessary-component-helper.md',
      templateMode: 'loose',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noUnnecessaryComponent:
        'Unnecessary use of (component) helper. Use the component name directly.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-unnecessary-component-helper.js',
      docs: 'docs/rule/no-unnecessary-component-helper.md',
      tests: 'test/unit/rules/no-unnecessary-component-helper-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      GlimmerMustacheStatement(node) {
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'component' &&
          node.params &&
          node.params.length > 0 &&
          node.params[0].type === 'GlimmerStringLiteral'
        ) {
          const componentName = node.params[0].value || node.params[0].original;
          context.report({
            node,
            messageId: 'noUnnecessaryComponent',
            fix(fixer) {
              const text = sourceCode.getText(node);
              // Replace {{component "name" ...rest}} with {{name ...rest}}
              const restParams = node.params.slice(1);
              const hashPairs = node.hash?.pairs || [];

              let replacement = `{{${componentName}`;
              for (const param of restParams) {
                replacement += ` ${sourceCode.getText(param)}`;
              }
              for (const pair of hashPairs) {
                replacement += ` ${sourceCode.getText(pair)}`;
              }
              replacement += '}}';

              return fixer.replaceText(node, replacement);
            },
          });
        }
      },

      GlimmerBlockStatement(node) {
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'component' &&
          node.params &&
          node.params.length > 0 &&
          node.params[0].type === 'GlimmerStringLiteral'
        ) {
          context.report({
            node,
            messageId: 'noUnnecessaryComponent',
          });
        }
      },

      GlimmerSubExpression(node) {
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'component' &&
          node.params &&
          node.params.length > 0 &&
          node.params[0].type === 'GlimmerStringLiteral'
        ) {
          const componentName = node.params[0].value || node.params[0].original;
          context.report({
            node,
            messageId: 'noUnnecessaryComponent',
            fix(fixer) {
              const restParams = node.params.slice(1);
              const hashPairs = node.hash?.pairs || [];

              let replacement = `(${componentName}`;
              for (const param of restParams) {
                replacement += ` ${sourceCode.getText(param)}`;
              }
              for (const pair of hashPairs) {
                replacement += ` ${sourceCode.getText(pair)}`;
              }
              replacement += ')';

              return fixer.replaceText(node, replacement);
            },
          });
        }
      },
    };
  },
};
