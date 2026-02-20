const DEFAULT_FORBIDDEN = ['meta', 'html', 'script'];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow specific HTML elements',
      category: 'Best Practices',
      recommendedGjs: false,
      recommendedGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-forbidden-elements.md',
    },
    schema: [
      {
        oneOf: [{ type: 'array', items: { type: 'string' } }, { type: 'boolean' }],
      },
    ],
    messages: { forbidden: 'Use of forbidden element <{{element}}>' },
  },
  create(context) {
    const rawConfig = context.options[0];
    let forbiddenList;

    if (rawConfig === true || rawConfig === undefined) {
      forbiddenList = DEFAULT_FORBIDDEN;
    } else if (Array.isArray(rawConfig)) {
      forbiddenList = rawConfig;
    } else {
      forbiddenList = [];
    }

    const forbidden = new Set(forbiddenList);

    // Track element stack for <meta> in <head> exception
    const elementStack = [];

    return {
      GlimmerElementNode(node) {
        elementStack.push(node.tag);

        if (!forbidden.has(node.tag)) {
          return;
        }

        // Exception: <meta> inside <head> is allowed
        if (node.tag === 'meta' && elementStack.includes('head')) {
          return;
        }

        context.report({ node, messageId: 'forbidden', data: { element: node.tag } });
      },
      'GlimmerElementNode:exit'() {
        elementStack.pop();
      },
    };
  },
};
