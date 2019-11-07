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
      recommended: false,
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
          checkDecoratorByName(context, node, 'tracked', options.trackedOnSameLine);
        }
      },
      MethodDefinition(node) {
        const { decorators } = node;

        if (decorators.length === 1) {
          checkDecoratorByName(context, node, 'computed', options.computedWithArgumentsOnSameLine);
          checkDecoratorByName(context, node, 'action', options.actionOnSameLine);
        }
      }
    };
  },
};



function handleSingleDecoratorPosition(context, node, info, desiresSameLine) {
  if (desiresSameLine) {
    if (info.onDifferentLines) {
      context.report({
        node,
        message: `@${info.name} in unexpected position`,

        fix(fixer) {
          const decorator = node.decorators[0];
          const indentation = decorator.loc.start.column;
          const padding = ' '.repeat(indentation);

          return [
            // replace indentation + decorator + newline
            fixer.replaceTextRange(
              [decorator.start - decorator.loc.start.column, node.start - 1],
              `${padding}@${info.name}`
            ),
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

/////////////////////////////////////
// Helpers
/////////////////////////////////////

function linePositioning(decorator, key) {
  const decoratorLine = decorator.expression.loc.start.line;
  const keyLine = key.loc.start.line;
  const onDifferentLines = decoratorLine !== keyLine;
  const onSameLine = decoratorLine === keyLine;

  return { onDifferentLines, onSameLine };
}


function decoratorInfo(context, node, name) {
  const { decorators, key } = node;
  const decorator = decorators.find(decorator => {
    return nameOfDecorator(decorator) === name;
  });

  if (!decorator) {
    return {};
  }

  const decoratorName = nameOfDecorator(decorator);
  const arity = arityOfDecorator(decorator);

  return { decorator, arity, name: decoratorName, ...linePositioning(decorator, key) };
}

function checkDecoratorByName(context, node, name, desiresOnSameLine) {
  const { decorator, ...info } = decoratorInfo(context, node, name);

  if (!decorator) {
    return;
  }

  handleSingleDecoratorPosition(context, node, { decorator, ...info}, desiresOnSameLine);
}

function nameOfDecorator(decorator) {
  let type = decorator.expression.type;

  switch(type) {
    case 'CallExpression':
      return decorator.expression.callee.name;
    case 'Identifier':
      return decorator.expression.name;
    default:
      throw new Error(`Decorator of type ${type} not yet handled`);
  }
}

function arityOfDecorator(decorator) {
  let type = decorator.expression.type;

  switch(type) {
    case 'CallExpression':
      return decorator.expression.arguments.length;
    default:
      return 0;
  }
}
