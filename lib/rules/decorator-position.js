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
          return handleSingleDecorator(context, node, options);
        }
      },
    };
  },
};

function linePositioning(decorator, key) {
  const onDifferentLines = decorator.expression.loc.start.line !== key.loc.start.line;
  const onSameLine = decorator.expression.loc.start.line === key.loc.start.line;

  return { onDifferentLines, onSameLine };
}

function handleSingleDecorator(context, node, options) {
  tracked(context, node, options);
  action(context, node, options);
}

function action(context, node, options) {
  const { decorators, key } = node;

  const action = decorators.find(decorator => decorator.expression.name === 'action');

  if (!action) {
    return;
  }

  const name = action.expression.name;
}

function tracked(context, node, options) {
  const { decorators, key } = node;

  const tracked = decorators.find(decorator => decorator.expression.name === 'tracked');

  if (!tracked) {
    return;
  }

  const trackedName = tracked.expression.name;

  const { onDifferentLines, onSameLine } = linePositioning(tracked, key);

  if (options.trackedOnSameLine) {
    if (onDifferentLines) {
      context.report({
        node,
        message: '@tracked in unexpected position',

        fix(fixer) {
          return [
            fixer.remove(tracked),
            fixer.replaceTextRange([node.start, node.start - 1], '@tracked'),
          ];
        },
      });
    }
  } else if (onSameLine) {
    const indentation = node.loc.start.column - trackedName.length - 2;
    const padding = ' '.repeat(indentation - 1);

    context.report({
      node,
      message: '@tracked in unexpected position',

      fix(fixer) {
        return [
          fixer.remove(tracked),
          fixer.replaceTextRange([node.start - 1, node.start - 1], `@${trackedName}\n${padding}`),
        ];
      },
    });
  }
}
