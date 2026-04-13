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
        // Only offer autofix when the first param is a path expression.
        // If hash pairs are present, only fix when the sole hash pair is `on="<event>"` —
        // we can read the event name from there and drop the pair in the output.
        const maybePath = node.params?.[0];
        const hashPairs = node.hash?.pairs || [];
        const onPair = hashPairs.find((p) => p.key === 'on');
        const otherPairs = hashPairs.filter((p) => p.key !== 'on');

        const canFix =
          maybePath &&
          maybePath.type === 'GlimmerPathExpression' &&
          otherPairs.length === 0 &&
          (onPair === undefined || onPair.value.type === 'GlimmerStringLiteral');

        context.report({
          node,
          messageId: 'noActionModifier',
          fix: canFix
            ? (fixer) => {
                const eventName =
                  onPair && onPair.value.type === 'GlimmerStringLiteral'
                    ? onPair.value.value
                    : 'click';

                const args = node.params.slice(1);
                const pathText = sourceCode.getText(maybePath);

                let replacement;
                if (args.length === 0) {
                  // {{action this.handleClick}} → {{on "click" this.handleClick}}
                  // {{action this.handleClick on="submit"}} → {{on "submit" this.handleClick}}
                  replacement = `on "${eventName}" ${pathText}`;
                } else {
                  // {{action this.handleClick "arg"}} → {{on "click" (fn this.handleClick "arg")}}
                  const argsText = args.map((a) => sourceCode.getText(a)).join(' ');
                  replacement = `on "${eventName}" (fn ${pathText} ${argsText})`;
                }

                // Replace from start of `action` to just before `}}`, covering any hash pairs
                return fixer.replaceTextRange([node.path.range[0], node.range[1] - 2], replacement);
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
