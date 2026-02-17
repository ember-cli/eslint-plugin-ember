/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow inline link-to, use the block form instead',
      category: 'Stylistic Issues',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-inline-link-to.md',
    },
    fixable: 'code',
    schema: [],
    messages: {},
  },

  create(context) {
    const MESSAGE = 'The inline form of link-to is not allowed. Use the block form instead.';

    return {
      GlimmerMustacheStatement(node) {
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'link-to'
        ) {
          const titleNode = node.params?.[0];
          const isFixable =
            titleNode &&
            (titleNode.type === 'GlimmerSubExpression' ||
              titleNode.type === 'GlimmerStringLiteral');

          context.report({
            node,
            message: MESSAGE,
            fix: isFixable
              ? (fixer) => {
                  const sourceCode = context.getSourceCode();
                  const text = sourceCode.getText(node);

                  // Convert {{link-to 'text' 'route' ...}} to {{#link-to 'route' ...}}text{{/link-to}}
                  let blockBody;
                  if (titleNode.type === 'GlimmerSubExpression') {
                    // {{link-to (helper ...) 'route'}} -> {{#link-to 'route'}}{{helper ...}}{{/link-to}}
                    const helperText = sourceCode.getText(titleNode);
                    blockBody = helperText.replace(/^\(/, '{{').replace(/\)$/, '}}');
                  } else if (titleNode.type === 'GlimmerStringLiteral') {
                    // {{link-to 'text' 'route'}} -> {{#link-to 'route'}}text{{/link-to}}
                    blockBody = titleNode.value;
                  }

                  // Get remaining params (everything after the first param)
                  const remainingParams = node.params.slice(1);
                  const remainingParamsText = remainingParams
                    .map((param) => sourceCode.getText(param))
                    .join(' ');

                  // Get hash if present
                  const hashText =
                    node.hash && node.hash.pairs && node.hash.pairs.length > 0
                      ? ` ${node.hash.pairs
                          .map((pair) => `${pair.key}=${sourceCode.getText(pair.value)}`)
                          .join(' ')}`
                      : '';

                  const fixedText = `{{#link-to ${remainingParamsText}${hashText}}}${blockBody}{{/link-to}}`;

                  return fixer.replaceText(node, fixedText);
                }
              : null,
          });
        }
      },
    };
  },
};
