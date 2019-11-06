'use strict';

const ember = require('./ember');
const utils = require('./utils');

const defaultOptions = {
  trackedOnSameLine: true,
  computedWithArgumentsOnSameLine: false,
  emberDataOnSameLine: true,

  computedWithoutArgumentsOnSameLine: true,
  actionOnSameLine: true,
  dependentKeyCompatOnSameLine: false,
};

module.exports = {
  meta: {
    docs: {
      description: 'Enforces consistent decorator position on properties, methods, etc',
      category: '',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/decorator-position.md',
    },
    fixable: 'code',
  },

  create(context) {
    const options = Object.assign({}, defaultOptions, context.options[0] || {});

    return {
      ClassProperty(node) {
        const { decorators } = node;

        if (decorators.length === 1) {
          return tracked(context, options);
        }
      },
    };
  },
};

function tracked(context, node, options) {
  const { decorators, key } = node;

  const tracked = decorators.find(decorator => decorator.expression.name === 'tracked');

  if (!tracked) {
    return;
  }

  if (tracked.expression.loc.start.line !== key.loc.start.line) {
    context.report({
      node,
      message: '@tracked in unexpected position',

      fix(fixer) {
        if (options.trackedOnSameLine) {
          return [
            fixer.remove(tracked),
            fixer.replaceTextRange([node.start, node.start - 1], '@tracked'),
          ];
        }
      },
    });
  }
}
