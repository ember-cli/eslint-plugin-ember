function isEmptyNode(node) {
  return (
    node.type === 'GlimmerMustacheCommentStatement' ||
    node.type === 'GlimmerCommentStatement' ||
    (node.type === 'GlimmerTextNode' && !node.chars.trim())
  );
}

function isBareYield(node) {
  return (
    node.type === 'GlimmerMustacheStatement' &&
    node.path.original === 'yield' &&
    (!node.params || node.params.length === 0)
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow templates whose only meaningful content is a bare {{yield}}',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-bare-yield.md',
      templateMode: 'both',
    },
    schema: [],
    messages: {
      noBareYield: '{{yieldCall}}-only templates are not allowed.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-yield-only.js',
      docs: 'docs/rule/no-yield-only.md',
      tests: 'test/unit/rules/no-yield-only-test.js',
    },
  },

  create(context) {
    return {
      GlimmerTemplate(node) {
        // In GJS/GTS mode the content lives inside a GlimmerElementNode wrapper
        // with tag="template"; in HBS mode the body is the content directly.
        let body = node.body;
        if (
          body.length === 1 &&
          body[0].type === 'GlimmerElementNode' &&
          body[0].tag === 'template'
        ) {
          body = body[0].children;
        }

        const nonEmptyNodes = body.filter((n) => !isEmptyNode(n));
        if (nonEmptyNodes.length === 1 && isBareYield(nonEmptyNodes[0])) {
          context.report({
            node: nonEmptyNodes[0],
            messageId: 'noBareYield',
            data: { yieldCall: '{{yield}}' },
          });
        }
      },
    };
  },
};
