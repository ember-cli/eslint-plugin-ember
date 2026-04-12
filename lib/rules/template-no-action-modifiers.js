/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of {{action}} modifiers',
      category: 'Best Practices',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-action-modifiers.md',
    },
    fixable: 'code',
    schema: [
      {
        oneOf: [
          {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
          {
            type: 'object',
            properties: {
              allowlist: {
                type: 'array',
                items: { type: 'string' },
                uniqueItems: true,
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      noActionModifier: 'Do not use action modifiers. Use on modifier with a function instead.',
    },
  },

  create(context) {
    const firstOption = context.options[0];
    const allowlist = Array.isArray(firstOption) ? firstOption : firstOption?.allowlist || [];
    const sourceCode = context.sourceCode;

    function checkForActionModifier(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'action' &&
        node.path.head?.type !== 'AtHead' &&
        node.path.head?.type !== 'ThisHead'
      ) {
        // Only offer autofix when the first param is a path expression
        // and there are no hash pairs (e.g. on="submit") which would be left behind
        const maybePath = node.params?.[0];
        const hasHashPairs = node.hash?.pairs?.length > 0;
        const canFix = maybePath && maybePath.type === 'GlimmerPathExpression' && !hasHashPairs;

        context.report({
          node,
          messageId: 'noActionModifier',
          fix: canFix
            ? (fixer) => {
                const args = node.params.slice(1);
                const pathText = sourceCode.getText(maybePath);

                let replacement;
                if (args.length === 0) {
                  // {{action this.handleClick}} → {{on "click" this.handleClick}}
                  replacement = `on "click" ${pathText}`;
                } else {
                  // {{action this.handleClick "arg"}} → {{on "click" (fn this.handleClick "arg")}}
                  const argsText = args.map((a) => sourceCode.getText(a)).join(' ');
                  replacement = `on "click" (fn ${pathText} ${argsText})`;
                }

                const lastParam = node.params.at(-1);
                return fixer.replaceTextRange(
                  [node.path.range[0], lastParam.range[1]],
                  replacement
                );
              }
            : null,
        });
      }
    }

    return {
      GlimmerElementModifierStatement(node) {
        const parent = node.parent;
        if (parent && parent.type === 'GlimmerElementNode' && allowlist.includes(parent.tag)) {
          return;
        }
        checkForActionModifier(node);
      },
    };
  },
};
