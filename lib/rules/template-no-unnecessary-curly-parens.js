function isFixableMustache(node) {
  // Check if the mustache's "path" is actually a SubExpression with params or hash
  // e.g., {{(helper arg)}} where the path is (helper arg)
  return (
    node.path?.type === 'GlimmerSubExpression' &&
    ((node.path.params && node.path.params.length > 0) ||
      (node.path.hash?.pairs && node.path.hash.pairs.length > 0))
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary parentheses enclosing statements in curlies',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unnecessary-curly-parens.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noUnnecessaryCurlyParens: 'Unnecessary parentheses enclosing statement.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      GlimmerMustacheStatement(node) {
        if (isFixableMustache(node)) {
          const subExpr = node.path;
          context.report({
            node,
            messageId: 'noUnnecessaryCurlyParens',
            fix(fixer) {
              // Replace {{(helper params hash)}} with {{helper params hash}}
              const helperName = subExpr.path?.original || '';
              let replacement = `{{${helperName}`;

              for (const param of subExpr.params || []) {
                replacement += ` ${sourceCode.getText(param)}`;
              }
              for (const pair of subExpr.hash?.pairs || []) {
                replacement += ` ${sourceCode.getText(pair)}`;
              }
              replacement += '}}';

              return fixer.replaceText(node, replacement);
            },
          });
        }
      },
    };
  },
};
