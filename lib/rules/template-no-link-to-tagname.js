/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow tagName attribute on LinkTo component',
      category: 'Deprecations',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-link-to-tagname.md',
      templateMode: 'both',
    },
    schema: [],
    messages: {
      noLinkToTagname:
        '@tagName on <LinkTo> is not supported (removed in Ember 4.0). <LinkTo> always renders an <a> element.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-link-to-tagname.js',
      docs: 'docs/rule/no-link-to-tagname.md',
      tests: 'test/unit/rules/no-link-to-tagname-test.js',
    },
  },

  create(context) {
    const filename = context.filename;
    const isStrictMode = filename.endsWith('.gjs') || filename.endsWith('.gts');

    // In HBS, `LinkTo` almost always refers to Ember's router link component; a
    // user-defined `link-to` could shadow it, but detecting that in classic HBS
    // would require resolver-level info the rule doesn't have.
    // In GJS/GTS, LinkTo must be explicitly imported from '@ember/routing'
    // (and may be renamed, e.g. `import { LinkTo as Link } from '@ember/routing'`).
    // local alias → true
    const importedLinkComponents = new Map();

    function isLinkToComponent(node) {
      if (node.type !== 'GlimmerElementNode') {
        return false;
      }
      if (isStrictMode) {
        return importedLinkComponents.has(node.tag);
      }
      return node.tag === 'LinkTo' || node.tag === 'link-to';
    }

    function checkHashPairsForTagName(node) {
      if (!node.hash || !node.hash.pairs) {
        return;
      }
      const tagNamePair = node.hash.pairs.find((pair) => pair.key === 'tagName');
      if (tagNamePair) {
        context.report({
          node: tagNamePair,
          messageId: 'noLinkToTagname',
        });
      }
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
            importedLinkComponents.set(specifier.local.name, true);
          }
        }
      },

      GlimmerElementNode(node) {
        if (!isLinkToComponent(node)) {
          return;
        }

        const tagNameAttr = node.attributes.find(
          (attr) => attr.type === 'GlimmerAttrNode' && attr.name === '@tagName'
        );

        if (tagNameAttr) {
          context.report({
            node: tagNameAttr,
            messageId: 'noLinkToTagname',
          });
        }
      },

      GlimmerMustacheStatement(node) {
        if (node.path?.original === 'link-to') {
          checkHashPairsForTagName(node);
        }
      },

      GlimmerBlockStatement(node) {
        if (node.path?.original === 'link-to') {
          checkHashPairsForTagName(node);
        }
      },
    };
  },
};
