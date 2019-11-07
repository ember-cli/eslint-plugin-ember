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
      MethodDefinition(node) {
        const { decorators } = node;

        if (decorators.length === 1) {
          handleSingleDecorator(context, node, options);
        }
      }
    };
  },
};



function linePositioning(decorator, key) {
  const decoratorLine = decorator.expression.loc.start.line;
  const keyLine = key.loc.start.line;
  const onDifferentLines = decoratorLine !== keyLine;
  const onSameLine = decoratorLine === keyLine;

  return { onDifferentLines, onSameLine };
}

function handleSingleDecorator(context, node, options) {
  //tracked(context, node, options);
  action(context, node, options);
}

function decoratorInfo(context, node, name) {
  const { decorators, key } = node;
  const decorator = decorators.find(decorator => decorator.expression.name === name);

  if (!decorator) {
    return {};
  }

  const decoratorName = decorator.expression.name;

  return { decorator, name: decoratorName, ...linePositioning(decorator, key) };
}

function action(context, node, options) {
  const { decorator, ...info } = decoratorInfo(context, node, 'action');

  if (!decorator) {
    return;
  }

  handleSingleDecoratorPosition(context, node, { decorator, ...info}, options.actionOnSameLine);
}

function tracked(context, node, options) {
  const { decorator, ...info } = decoratorInfo(context, node, 'tracked');

  if (!decorator) {
    return;
  }

  handleSingleDecoratorPosition(context, node, { decorator, ...info}, options.trackedOnSameLine);
}

function handleSingleDecoratorPosition(context, node, info, desiresSameLine) {

  if (desiresSameLine) {
    if (info.onDifferentLines) {
      context.report({
        node,
        message: `@${info.name} in unexpected position`,

        fix(fixer) {
          return [
            fixer.remove(info.decorator),
            fixer.replaceTextRange([node.start, node.start - 1], `@${info.name}`),
          ];
        },
      });
    }
  } else if (info.onSameLine) {
    const indentation = node.loc.start.column - info.name.length - 2;
    const padding = ' '.repeat(indentation - 1);

    context.report({
      node,
      message: `@${info.name} in unexpected position`,

      fix(fixer) {
        return [
          fixer.remove(info.decorator),
          fixer.replaceTextRange([node.start - 1, node.start - 1], `@${info.name}\n${padding}`),
        ];
      },
    });
  }
}
