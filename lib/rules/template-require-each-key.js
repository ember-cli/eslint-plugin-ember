/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require key attribute in {{#each}} loops',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-each-key.md',
      templateMode: 'both',
    },
    schema: [],
    messages: {
      requireEachKey: 'each block should have a key attribute for better rendering performance.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-each-key.js',
      docs: 'docs/rule/require-each-key.md',
      tests: 'test/unit/rules/require-each-key-test.js',
    },
  },

  create(context) {
    const VALID_AT_KEYS = new Set(['@index', '@identity']);

    function isValidKey(pair) {
      if (!pair.value || pair.value.type !== 'GlimmerStringLiteral') {
        return true; // dynamic values are OK
      }
      const value = pair.value.value;
      if (!value || value.trim() === '') {
        return false; // empty key
      }
      if (value.startsWith('@') && !VALID_AT_KEYS.has(value)) {
        return false; // invalid @ key
      }
      return true;
    }

    return {
      GlimmerBlockStatement(node) {
        if (node.path.type === 'GlimmerPathExpression' && node.path.original === 'each') {
          const keyPair = node.hash && node.hash.pairs.find((pair) => pair.key === 'key');
          if (!keyPair || !isValidKey(keyPair)) {
            context.report({
              node,
              messageId: 'requireEachKey',
            });
          }
        }
      },
    };
  },
};
