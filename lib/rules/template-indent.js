const { builtinRules } = require('eslint/use-at-your-own-risk');

const baseRule = builtinRules.get('indent');
const IGNORED_ELEMENTS = new Set(['pre', 'script', 'style', 'textarea']);

const schema = baseRule.meta.schema.map((s) => ({ ...s }));
schema[1].properties = {
  ignoredNodes: schema[1].properties.ignoredNodes,
  ignoreComments: schema[1].properties.ignoreComments,
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  name: 'indent',
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent indentation for gts/gjs templates',
      // too opinionated to be recommended
      recommendedGjs: false,
      recommendedGts: false,
      category: 'Ember Octane',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-indent.md',
    },
    fixable: 'whitespace',
    hasSuggestions: baseRule.meta.hasSuggestions,
    schema,
    messages: baseRule.meta.messages,
  },

  create: (context) => {
    const ctx = Object.create(context, {
      report: {
        writable: false,
        configurable: false,
        value: (info) => {
          const node = context.sourceCode.getNodeByRangeIndex(info.node.range[0]);
          if (!node.type.startsWith('Glimmer')) {
            return;
          }
          context.report(info);
        },
      },
    });
    const rules = baseRule.create(ctx);
    const sourceCode = context.sourceCode;

    function JSXElement(node) {
      let closingElement;
      let openingElement;
      if (node.type === 'GlimmerElementNode') {
        const tokens = sourceCode.getTokens(node);
        const openEnd = tokens.find((t) => t.value === '>');
        const closeStart = tokens.findLast((t) => t.value === '<');
        if (!node.selfClosing) {
          closingElement = {
            type: 'JSXClosingElement',
            parent: node,
            range: [closeStart.range[0], node.range[1]],
            loc: {
              start: Object.assign({}, node.loc.start),
              end: Object.assign({}, node.loc.end),
            },
          };
          closingElement.loc.start = sourceCode.getLocFromIndex(closeStart.range[0]);
          closingElement.name = { ...closingElement, type: 'JSXIdentifier' };
          closingElement.name.range = [
            closingElement.name.range[0] + 1,
            closingElement.name.range[1] - 1,
          ];
        }

        openingElement = {
          type: 'JSXOpeningElement',
          selfClosing: node.selfClosing,
          attributes: node.attributes,
          parent: node,
          range: [node.range[0], openEnd.range[1]],
          loc: {
            start: Object.assign({}, node.loc.start),
            end: Object.assign({}, node.loc.end),
          },
        };
        openingElement.loc.end = sourceCode.getLocFromIndex(openEnd.range[1]);
        openingElement.name = { ...openingElement, type: 'JSXIdentifier' };
        openingElement.name.range = [
          openingElement.name.range[0] + 1,
          openingElement.name.range[1] - 1,
        ];
      }
      if (node.type === 'GlimmerBlockStatement') {
        const tokens = sourceCode.getTokens(node);
        let openEndIdx = tokens.findIndex((t) => t.value === '}');
        while (tokens[openEndIdx + 1].value === '}') {
          openEndIdx += 1;
        }
        const openEnd = tokens[openEndIdx];
        let closeStartIdx = tokens.findLastIndex((t) => t.value === '{');
        while (tokens[closeStartIdx - 1].value === '{') {
          closeStartIdx -= 1;
        }
        const closeStart = tokens[closeStartIdx];
        closingElement = {
          type: 'JSXClosingElement',
          parent: node,
          range: [closeStart.range[0], node.range[1]],
          loc: {
            start: Object.assign({}, node.loc.start),
            end: Object.assign({}, node.loc.end),
          },
        };
        closingElement.loc.start = sourceCode.getLocFromIndex(closeStart.range[0]);

        openingElement = {
          type: 'JSXOpeningElement',
          attributes: node.params,
          parent: node,
          range: [node.range[0], openEnd.range[1]],
          loc: {
            start: Object.assign({}, node.loc.start),
            end: Object.assign({}, node.loc.end),
          },
        };
        openingElement.loc.end = sourceCode.getLocFromIndex(openEnd.range[1]);
      }
      return {
        type: 'JSXElement',
        openingElement,
        closingElement,
        children: node.children || node.body,
        parent: node.parent,
        range: node.range,
        loc: node.loc,
      };
    }

    const ignoredStack = new Set();

    return Object.assign({}, rules, {
      // overwrite the base rule here so we can use our KNOWN_NODES list instead
      '*:exit'(node) {
        // For nodes we care about, skip the default handling, because it just marks the node as ignored...
        if (
          !node.type.startsWith('Glimmer') ||
          (ignoredStack.size > 0 && !ignoredStack.has(node))
        ) {
          rules['*:exit'](node);
        }
        if (ignoredStack.has(node)) {
          ignoredStack.delete(node);
        }
      },
      'GlimmerTemplate:exit'(node) {
        if (!node.parent) {
          rules['Program:exit'](node);
        }
      },
      GlimmerElementNode(node) {
        if (ignoredStack.size > 0) {
          return;
        }
        if (IGNORED_ELEMENTS.has(node.tag)) {
          ignoredStack.add(node);
        }
        const jsx = JSXElement(node);
        rules['JSXElement'](jsx);
        rules['JSXOpeningElement'](jsx.openingElement);
        if (jsx.closingElement) {
          rules['JSXClosingElement'](jsx.closingElement);
        }
      },
      GlimmerAttrNode(node) {
        if (ignoredStack.size > 0 || !node.value) {
          return;
        }
        rules['JSXAttribute[value]']({
          ...node,
          type: 'JSXAttribute',
          name: {
            type: 'JSXIdentifier',
            name: node.name,
            range: [node.range[0], node.range[0] + node.name.length - 1],
          },
        });
      },
      GlimmerTemplate(node) {
        if (!node.parent) {
          return;
        }
        const jsx = JSXElement({ ...node, tag: 'template', type: 'GlimmerElementNode' });
        rules['JSXElement'](jsx);
      },
      GlimmerBlockStatement(node) {
        const body = [...node.program.body, ...(node.inverse?.body || [])];
        rules['JSXElement'](JSXElement({ ...node, body }));
      },
    });
  },
};
