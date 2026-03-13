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
    const sourceCode = context.sourceCode;

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
            (titleNode.type === 'GlimmerStringLiteral' ||
              titleNode.type === 'GlimmerSubExpression');

          context.report({
            node,
            messageId: 'noInlineLinkTo',
            fix: isFixable
              ? (fixer) => {
                  // Build the block body content from the first param (the link text)
                  let titleContent;
                  if (titleNode.type === 'GlimmerStringLiteral') {
                    titleContent = titleNode.value;
                  } else {
                    // SubExpression: (helper ...) → {{helper ...}}
                    const src = sourceCode.getText(titleNode);
                    titleContent = `{{${src.slice(1, -1)}}}`;
                  }

                  // Remaining positional params become the block's params
                  const remainingParams = node.params
                    .slice(1)
                    .map((p) => sourceCode.getText(p))
                    .join(' ');

                  // Hash pairs (named args) are preserved as-is
                  const hashPairs =
                    node.hash?.pairs?.length > 0
                      ? ` ${node.hash.pairs.map((p) => sourceCode.getText(p)).join(' ')}`
                      : '';

                  const paramsSep = remainingParams ? ' ' : '';
                  const newText = `{{#link-to${paramsSep}${remainingParams}${hashPairs}}}${titleContent}{{/link-to}}`;

                  return fixer.replaceText(node, newText);
                }
              : null,
          });
        }
      },
    };
  },
};
