/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the use of block params (`as |...|`)',
      category: 'Best Practices',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-block-params.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      noBlockParams:
        'Block params (`as |...|`) are not allowed. Avoid using `as |{{params}}|` on `{{name}}`.',
    },
  },

  create(context) {
    return {
      // Catches angle-bracket invocations with block params:
      //   <MyComponent as |foo|>
      //   <div as |bar|>
      GlimmerElementNode(node) {
        if (node.blockParams && node.blockParams.length > 0) {
          context.report({
            node,
            messageId: 'noBlockParams',
            data: {
              params: node.blockParams.join(', '),
              name: node.tag,
            },
          });
        }
      },

      // Catches curly block invocations with block params:
      //   {{#each items as |item|}}
      //   {{#let foo as |bar|}}
      //   {{#my-component as |val|}}
      GlimmerBlockStatement(node) {
        const blockParams = node.program?.blockParams || [];
        if (blockParams.length > 0) {
          const pathName = node.path?.original || node.path?.head?.original || 'block';
          context.report({
            node,
            messageId: 'noBlockParams',
            data: {
              params: blockParams.join(', '),
              name: pathName,
            },
          });
        }
      },
    };
  },
};
