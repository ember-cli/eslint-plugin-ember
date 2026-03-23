function isComponentWithStringLiteral(node) {
  return (
    node.path &&
    node.path.type === 'GlimmerPathExpression' &&
    node.path.original === 'component' &&
    node.params &&
    node.params.length > 0 &&
    node.params[0].type === 'GlimmerStringLiteral' &&
    !(node.params[0].value || '').includes('@')
  );
}

function getComponentInvocationText(sourceCode, node, componentName) {
  const parts = [];

  for (const param of node.params.slice(1)) {
    parts.push(sourceCode.getText(param));
  }

  for (const pair of node.hash?.pairs || []) {
    parts.push(sourceCode.getText(pair));
  }

  return [componentName, ...parts].join(' ');
}

function getOpenInvocationEnd(node) {
  if (node.hash?.pairs?.length) {
    return node.hash.range[1];
  }

  const lastParam = node.params.at(-1);

  return lastParam ? lastParam.range[1] : node.path.range[1];
}

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
      noUnnecessaryComponent: 'Invoke component directly instead of using `component` helper',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-unnecessary-component-helper.js',
      docs: 'docs/rule/no-unnecessary-component-helper.md',
      tests: 'test/unit/rules/no-unnecessary-component-helper-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;
    let inAttribute = 0;

    return {
      GlimmerAttrNode() {
        inAttribute++;
      },
      'GlimmerAttrNode:exit'() {
        inAttribute--;
      },

      GlimmerMustacheStatement(node) {
        if (inAttribute > 0) {
          return;
        }
        if (!isComponentWithStringLiteral(node)) {
          return;
        }

        const componentName = node.params[0].value || node.params[0].original;
        const invocation = getComponentInvocationText(sourceCode, node, componentName);
        context.report({
          node,
          messageId: 'noUnnecessaryComponent',
          fix(fixer) {
            return fixer.replaceText(node, `{{${invocation}}}`);
          },
        });
      },

      GlimmerBlockStatement(node) {
        if (inAttribute > 0) {
          return;
        }
        if (!isComponentWithStringLiteral(node)) {
          return;
        }

        const componentName = node.params[0].value || node.params[0].original;
        const invocation = getComponentInvocationText(sourceCode, node, componentName);

        context.report({
          node,
          messageId: 'noUnnecessaryComponent',
          fix(fixer) {
            const openInvocationEnd = getOpenInvocationEnd(node);
            const closingPathEnd = node.range[1] - 2;
            const closingPathStart = closingPathEnd - node.path.original.length;

            return [
              fixer.replaceTextRange([node.path.range[0], openInvocationEnd], invocation),
              fixer.replaceTextRange([closingPathStart, closingPathEnd], componentName),
            ];
          },
        });
      },
    };
  },
};
