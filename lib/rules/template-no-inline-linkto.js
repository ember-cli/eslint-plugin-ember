/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow inline form of LinkTo component',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-inline-linkto.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noInlineLinkTo: 'Use block form of LinkTo component instead of inline form.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/inline-link-to.js',
      docs: 'docs/rule/inline-link-to.md',
      tests: 'test/unit/rules/inline-link-to-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      GlimmerElementNode(node) {
        if (node.tag === 'LinkTo' && node.children && node.children.length === 0) {
          context.report({
            node,
            messageId: 'noInlineLinkTo',
          });
        }
      },

      // {{link-to 'text' 'route'}} inline curly form
      GlimmerMustacheStatement(node) {
        if (node.path?.type === 'GlimmerPathExpression' && node.path.original === 'link-to') {
          const titleNode = node.params[0];
          const isFixable =
            titleNode &&
            (titleNode.type === 'GlimmerSubExpression' || titleNode.type === 'GlimmerStringLiteral');

          context.report({
            node,
            messageId: 'noInlineLinkTo',
            fix: isFixable
              ? (fixer) => {
                const body =
                  titleNode.type === 'GlimmerStringLiteral'
                      ? titleNode.value
                      : `{{${sourceCode.getText(titleNode).replace(/^\((.*)\)$/s, '$1')}}}`;
                  const headerParts = [
                    ...node.params.slice(1).map((param) => sourceCode.getText(param)),
                    ...(node.hash?.pairs || []).map((pair) => sourceCode.getText(pair)),
                  ];
                  const opening =
                    headerParts.length > 0
                      ? `{{#link-to ${headerParts.join(' ')}}}`
                      : '{{#link-to}}';

                  return fixer.replaceText(node, `${opening}${body}{{/link-to}}`);
                }
              : null,
          });
        }
      },
    };
  },
};
