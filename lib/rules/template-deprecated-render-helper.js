/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow {{render}} helper',
      category: 'Deprecations',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-deprecated-render-helper.md',
      templateMode: 'loose',
    },
    fixable: 'code',
    schema: [],
    messages: {
      deprecated:
        'The render helper is deprecated in favor of using components. See https://emberjs.com/deprecations/v2.x/#toc_code-render-code-helper',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/deprecated-render-helper.js',
      docs: 'docs/rule/deprecated-render-helper.md',
      tests: 'test/unit/rules/deprecated-render-helper-test.js',
    },
  },

  create(context) {
    const isStrictMode = context.filename.endsWith('.gjs') || context.filename.endsWith('.gts');
    if (isStrictMode) {
      return {};
    }

    const sourceCode = context.sourceCode;

    function buildFix(node) {
      const first = node.params[0];
      if (!first || first.type !== 'GlimmerStringLiteral') {
        return null;
      }
      const templateName = first.value;

      if (node.params.length === 1) {
        // {{render 'name'}} → {{name}}
        return (fixer) => fixer.replaceText(node, `{{${templateName}}}`);
      }

      if (node.params.length === 2) {
        // {{render 'name' model}} → {{name model=model}}
        const model = sourceCode.getText(node.params[1]);
        return (fixer) => fixer.replaceText(node, `{{${templateName} model=${model}}}`);
      }

      return null;
    }

    function checkForRender(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'render'
      ) {
        context.report({
          node,
          messageId: 'deprecated',
          fix: buildFix(node),
        });
      }
    }

    return {
      GlimmerMustacheStatement(node) {
        checkForRender(node);
      },

      GlimmerBlockStatement(node) {
        checkForRender(node);
      },
    };
  },
};
