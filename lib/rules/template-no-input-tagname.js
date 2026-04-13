/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow tagName attribute on {{input}} helper',
      category: 'Best Practices',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-input-tagname.md',
      templateMode: 'both',
    },
    schema: [],
    messages: { unexpected: 'Unexpected tagName usage on input helper.' },
  },
  create(context) {
    const isStrictMode = context.filename.endsWith('.gjs') || context.filename.endsWith('.gts');

    // local name → 'Input'. Only populated in GJS/GTS via ImportDeclaration.
    const importedComponents = new Map();

    function checkCurly(node) {
      if (!node.path) {
        return;
      }
      const attrs = node.hash?.pairs || [];
      const hasTagName = attrs.some((a) => a.key === 'tagName');

      if (node.path.original === 'input' && hasTagName) {
        context.report({ node, messageId: 'unexpected' });
      } else if (
        node.path.original === 'component' &&
        node.params?.[0]?.original === 'input' &&
        hasTagName
      ) {
        context.report({ node, messageId: 'unexpected' });
      }
    }

    const visitors = {
      GlimmerElementNode(node) {
        const hasTagName = node.attributes?.some((a) => a.name === '@tagName');
        if (!hasTagName) {
          return;
        }
        if (isStrictMode) {
          // In GJS/GTS: only flag if explicitly imported from @ember/component
          if (importedComponents.has(node.tag)) {
            context.report({ node, messageId: 'unexpected' });
          }
        } else {
          // In HBS: <Input ...> always resolves to the framework Input
          if (node.tag === 'Input') {
            context.report({ node, messageId: 'unexpected' });
          }
        }
      },
    };

    if (isStrictMode) {
      visitors.ImportDeclaration = function (node) {
        if (node.source.value === '@ember/component') {
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'Input') {
              importedComponents.set(specifier.local.name, 'Input');
            }
          }
        }
      };
    } else {
      visitors.GlimmerMustacheStatement = checkCurly;
      visitors.GlimmerSubExpression = checkCurly;
    }

    return visitors;
  },
};
