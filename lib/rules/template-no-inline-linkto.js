/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow inline form of LinkTo component',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-inline-linkto.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noInlineLinkTo: 'Use block form of LinkTo component instead of inline form.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/inline-link-to.js',
      docs: 'docs/rule/inline-link-to.md',
      tests: 'test/unit/rules/inline-link-to-test.js',
    },
  },

  create(context) {
    const filename = context.filename;
    const isStrictMode = filename.endsWith('.gjs') || filename.endsWith('.gts');

    // In HBS, `<LinkTo>` always refers to Ember's router link component.
    // In GJS/GTS, `<LinkTo>` must be explicitly imported from '@ember/routing'
    // (and may be renamed, e.g. `import { LinkTo as Link } from '@ember/routing'`).
    // Limitation: namespace imports (`import * as routing from '@ember/routing'`
    // → `<routing.LinkTo />`) are not tracked — dotted tag paths would need a
    // separate match and are not a realistic usage pattern for this component.
    const importedLinkComponents = new Set();

    function isLinkToComponent(node) {
      if (isStrictMode) {
        return importedLinkComponents.has(node.tag);
      }
      return node.tag === 'LinkTo';
    }

    return {
      ImportDeclaration(node) {
        if (!isStrictMode) {
          return;
        }
        if (node.source.value !== '@ember/routing') {
          return;
        }
        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'LinkTo') {
            importedLinkComponents.add(specifier.local.name);
          }
        }
      },

      GlimmerElementNode(node) {
        if (!isLinkToComponent(node)) {
          return;
        }
        if (node.children && node.children.length === 0) {
          context.report({
            node,
            messageId: 'noInlineLinkTo',
          });
        }
      },

      // {{link-to 'text' 'route'}} inline curly form — HBS-only.
      // The `link-to` kebab path is not a valid JS identifier, so it cannot
      // be a user binding in strict mode; the strict-mode compiler would
      // already reject the source. Skip the curly handler in strict mode to
      // avoid emitting a fix that produces also-broken `{{#link-to ...}}`.
      GlimmerMustacheStatement(node) {
        if (isStrictMode) {
          return;
        }
        if (node.path?.type === 'GlimmerPathExpression' && node.path.original === 'link-to') {
          const sourceCode = context.sourceCode;
          const titleNode = node.params[0];
          const isFixable =
            titleNode &&
            (titleNode.type === 'GlimmerStringLiteral' ||
              titleNode.type === 'GlimmerSubExpression');

          context.report({
            node,
            messageId: 'noInlineLinkTo',
            fix: isFixable
              ? (fixer) => {
                  // Build the block body content from the first param (the link text)
                  let titleContent;
                  if (titleNode.type === 'GlimmerStringLiteral') {
                    titleContent = titleNode.value;
                  } else {
                    // SubExpression: (helper ...) → {{helper ...}}
                    const src = sourceCode.getText(titleNode);
                    titleContent = `{{${src.slice(1, -1)}}}`;
                  }

                  // Remaining positional params become the block's params
                  const remainingParams = node.params
                    .slice(1)
                    .map((p) => sourceCode.getText(p))
                    .join(' ');

                  // Hash pairs (named args) are preserved as-is
                  const hashPairs =
                    node.hash?.pairs?.length > 0
                      ? ` ${node.hash.pairs.map((p) => sourceCode.getText(p)).join(' ')}`
                      : '';

                  const paramsSep = remainingParams ? ' ' : '';
                  const newText = `{{#link-to${paramsSep}${remainingParams}${hashPairs}}}${titleContent}{{/link-to}}`;

                  return fixer.replaceText(node, newText);
                }
              : null,
          });
        }
      },
    };
  },
};
