/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of {{action}} modifiers',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-action-modifiers.md',
      templateMode: 'loose',
    },
    fixable: null,
    schema: [
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
    messages: {
      noActionModifier: 'Do not use action modifiers. Use on modifier with a function instead.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-action-modifiers.js',
      docs: 'docs/rule/no-action-modifiers.md',
      tests: 'test/unit/rules/no-action-modifiers-test.js',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowlist = new Set(options.allowlist || []);

    function checkForActionModifier(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'action' &&
        node.path.head?.type !== 'AtHead' &&
        node.path.head?.type !== 'ThisHead'
      ) {
        // Check if the parent element is in the allowlist
        const parentElement = node.parent;
        if (parentElement && parentElement.tag && allowlist.has(parentElement.tag)) {
          return;
        }
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
