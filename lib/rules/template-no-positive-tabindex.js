/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow positive tabindex values',
      category: 'Accessibility',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-positive-tabindex.md',
    },
    fixable: null,
    schema: [],
    messages: {
      positive: 'Avoid positive integer values for tabindex.',
      invalid: 'Tabindex values must be negative numeric.',
    },
  },

  create(context) {
    function getTabindexValue(attrValue) {
      if (!attrValue) {
        return null;
      }

      // Handle simple text values
      if (attrValue.type === 'GlimmerTextNode') {
        const value = parseInt(attrValue.chars, 10);
        return isNaN(value) ? null : value;
      }

      // Handle mustache statements
      if (attrValue.type === 'GlimmerMustacheStatement') {
        const path = attrValue.path;
        
        // Handle literal values
        if (path.type === 'GlimmerNumberLiteral') {
          return parseInt(path.original, 10);
        }
        if (path.type === 'GlimmerStringLiteral') {
          const value = parseInt(path.original, 10);
          return isNaN(value) ? null : value;
        }

        // Handle conditional expressions like {{if condition 0 1}}
        if (path.type === 'GlimmerPathExpression' && 
            (path.original === 'if' || path.original === 'unless')) {
          const params = attrValue.params || [];
          let maxValue = -Infinity;
          
          // Check the conditional values (params 1 and optionally 2)
          for (let i = 1; i < params.length && i < 3; i++) {
            const param = params[i];
            if (param.type === 'GlimmerNumberLiteral') {
              maxValue = Math.max(maxValue, parseInt(param.original, 10));
            } else if (param.type === 'GlimmerStringLiteral') {
              const val = parseInt(param.original, 10);
              if (!isNaN(val)) {
                maxValue = Math.max(maxValue, val);
              }
            }
          }
          
          return maxValue === -Infinity ? null : maxValue;
        }
      }

      // Handle concat statements
      if (attrValue.type === 'GlimmerConcatStatement') {
        const parts = attrValue.parts || [];
        if (parts.length > 0 && parts[0].type === 'GlimmerMustacheStatement') {
          return getTabindexValue(parts[0]);
        }
      }

      return null;
    }

    return {
      GlimmerElementNode(node) {
        const tabindexAttr = node.attributes?.find((attr) => attr.name === 'tabindex');

        if (!tabindexAttr || !tabindexAttr.value) {
          return;
        }

        const tabindexValue = getTabindexValue(tabindexAttr.value);

        if (tabindexValue === null) {
          // Can't determine the value, might be a variable reference
          // Report as potentially invalid
          context.report({
            node: tabindexAttr,
            messageId: 'invalid',
          });
        } else if (tabindexValue > 0) {
          context.report({
            node: tabindexAttr,
            messageId: 'positive',
          });
        }
      },
    };
  },
};
