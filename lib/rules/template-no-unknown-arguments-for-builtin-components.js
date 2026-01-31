/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unknown arguments for built-in components',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unknown-arguments-for-builtin-components.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unknownArgument: 'Unknown argument "@{{name}}" for built-in component <{{component}}>.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    const BUILTIN_COMPONENTS = {
      Input: new Set(['type', 'value', 'checked', 'disabled', 'placeholder', 'required']),
      Textarea: new Set(['value', 'disabled', 'placeholder', 'required', 'rows', 'cols']),
      LinkTo: new Set(['route', 'model', 'models', 'query']),
    };

    return {
      GlimmerElementNode(node) {
        if (!node.tag || !node.attributes) {
          return;
        }

        const componentName = node.tag;
        const allowedArgs = BUILTIN_COMPONENTS[componentName];
        if (!allowedArgs) {
          return;
        }

        for (const attr of node.attributes) {
          if (attr.type === 'GlimmerAttrNode' && attr.name && attr.name.startsWith('@')) {
            const argName = attr.name.slice(1);
            if (!allowedArgs.has(argName)) {
              context.report({
                node: attr,
                messageId: 'unknownArgument',
                data: {
                  name: argName,
                  component: componentName,
                },
              });
            }
          }
        }
      },
    };
  },
};
