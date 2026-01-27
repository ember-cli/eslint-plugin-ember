const IGNORABLE_TYPES = new Set(['GlimmerTextNode', 'GlimmerMustacheCommentStatement']);

function isBareYield(node) {
  return (
    node.type === 'GlimmerMustacheStatement' &&
    node.path &&
    node.path.type === 'GlimmerPathExpression' &&
    node.path.original === 'yield' &&
    (!node.params || node.params.length === 0) &&
    (!node.hash || !node.hash.pairs || node.hash.pairs.length === 0)
  );
}

function isMeaningfulContent(node) {
  if (node.type === 'GlimmerTextNode') {
    return node.chars && node.chars.trim().length > 0;
  }
  return !IGNORABLE_TYPES.has(node.type);
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow components that only yield',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-yield-only.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      noYieldOnly:
        'Component should not only yield. Add wrapper element or additional functionality.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-yield-only.js',
      docs: 'docs/rule/no-yield-only.md',
      tests: 'test/unit/rules/no-yield-only-test.js',
    },
  },

  create(context) {
    function checkChildren(children) {
      let yieldNode = null;

      for (const child of children) {
        if (isBareYield(child)) {
          yieldNode = child;
        } else if (isMeaningfulContent(child)) {
          return;
        }
      }

      if (yieldNode) {
        context.report({ node: yieldNode, messageId: 'noYieldOnly' });
      }
    }

    return {
      GlimmerTemplate(node) {
        if (!node.body || node.body.length === 0) {
          return;
        }

        const firstChild = node.body[0];
        if (firstChild && firstChild.type === 'GlimmerElementNode') {
          // gjs/gts: body[0] is the <template> element, check its children
          checkChildren(firstChild.children || []);
        } else {
          // hbs: body directly contains the template nodes
          checkChildren(node.body);
        }
      },
    };
  },
};
