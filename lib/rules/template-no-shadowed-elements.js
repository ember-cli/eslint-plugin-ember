/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow shadowing of built-in HTML elements',
      category: 'Possible Errors',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-shadowed-elements.md',
    },
    fixable: null,
    schema: [],
    messages: {
      shadowed: 'Component name "{{name}}" shadows HTML element <{{name}}>. Use a different name.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-shadowed-elements.js',
      docs: 'docs/rule/no-shadowed-elements.md',
      tests: 'test/unit/rules/no-shadowed-elements-test.js',
    },
  },

  create(context) {
    const HTML_ELEMENTS = new Set([
      'a',
      'abbr',
      'address',
      'area',
      'article',
      'aside',
      'audio',
      'b',
      'base',
      'bdi',
      'bdo',
      'blockquote',
      'body',
      'br',
      'button',
      'canvas',
      'caption',
      'cite',
      'code',
      'col',
      'colgroup',
      'data',
      'datalist',
      'dd',
      'del',
      'details',
      'dfn',
      'dialog',
      'div',
      'dl',
      'dt',
      'em',
      'embed',
      'fieldset',
      'figcaption',
      'figure',
      'footer',
      'form',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'head',
      'header',
      'hgroup',
      'hr',
      'html',
      'i',
      'iframe',
      'img',
      'input',
      'ins',
      'kbd',
      'label',
      'legend',
      'li',
      'link',
      'main',
      'map',
      'mark',
      'meta',
      'meter',
      'nav',
      'noscript',
      'object',
      'ol',
      'optgroup',
      'option',
      'output',
      'p',
      'param',
      'picture',
      'pre',
      'progress',
      'q',
      'rp',
      'rt',
      'ruby',
      's',
      'samp',
      'script',
      'section',
      'select',
      'small',
      'source',
      'span',
      'strong',
      'style',
      'sub',
      'summary',
      'sup',
      'table',
      'tbody',
      'td',
      'template',
      'textarea',
      'tfoot',
      'th',
      'thead',
      'time',
      'title',
      'tr',
      'track',
      'u',
      'ul',
      'var',
      'video',
      'wbr',
    ]);

    const blockParamScope = [];

    function pushScope(params) {
      blockParamScope.push(new Set(params || []));
    }

    function popScope() {
      blockParamScope.pop();
    }

    function isLocal(name) {
      for (const scope of blockParamScope) {
        if (scope.has(name)) {
          return true;
        }
      }
      return false;
    }

    return {
      GlimmerBlockStatement(node) {
        if (node.program && node.program.blockParams) {
          pushScope(node.program.blockParams);
        }
      },
      'GlimmerBlockStatement:exit'(node) {
        if (node.program && node.program.blockParams) {
          popScope();
        }
      },

      GlimmerElementNode(node) {
        // Push block params for elements with 'as |...|' syntax
        if (node.blockParams && node.blockParams.length > 0) {
          pushScope(node.blockParams);
        }

        const tag = node.tag;
        if (!tag) {
          return;
        }

        const firstChar = tag.charAt(0);
        const startsWithUpperCase =
          firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase();
        const containsDot = tag.includes('.');

        if (containsDot) {
          // dot paths like bar.baz are not ambiguous
          return;
        }

        if (startsWithUpperCase) {
          // PascalCase element
          if (isLocal(tag)) {
            // Local block param starting with uppercase → unambiguous → don't flag
            return;
          }
          // Not a local: check if it shadows HTML element
          const lowerTag = tag.toLowerCase();
          if (HTML_ELEMENTS.has(lowerTag)) {
            context.report({
              node,
              messageId: 'shadowed',
              data: { name: lowerTag },
            });
          }
        } else {
          // Lowercase element - check if it's a local that shadows HTML element
          if (isLocal(tag) && HTML_ELEMENTS.has(tag)) {
            context.report({
              node,
              messageId: 'shadowed',
              data: { name: tag },
            });
          }
        }
      },

      'GlimmerElementNode:exit'(node) {
        if (node.blockParams && node.blockParams.length > 0) {
          popScope();
        }
      },
    };
  },
};
