'use strict';

const ember = require('./ember');
const utils = require('./utils');


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

  create: decoratorPositionRule,
};

/////////////////////////////////////////////////////////////
// Everything below here can be copied into astexplorer.net
// parser: babel-eslint
// transform: ESLint v4

const defaultOptions = {
  onSameLine: [
    `@tracked`,
    `@action`,
    `@attr`, `@hasMany`, `@belongsTo`,
  ],
  onDifferentLines: [`@dependentKeyCompat`,  `@computed`],
};

function decoratorPositionRule(context) {
  const userOptions = context.options[0] || {};
  const options = Object.assign({}, defaultOptions, userOptions);

  validateOptions(options);

  return {
    ClassProperty(node) {
      const { decorators } = node;

      if (decorators.length === 1) {
        checkDecorators(context, node, options);
      }
    },
    // NOTE: both getters and methods are of type MethodDefinition
    MethodDefinition(node) {
      const { decorators } = node;

      if (decorators.length === 1) {
        checkDecorators(context, node, options);
      }
    }
  };
}

function validateOptions(options) {

}

function checkDecorators(context, node, options) {

  for (let decoratorConfig of options.onSameLine) {
	let [name, decoratorOptions] = normalizeConfig(decoratorConfig);
    let info = decoratorInfo(context, node, name, decoratorOptions);

    if (!info.needsTransform) {
      return;
    }

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

  for (let decoratorConfig of options.onDifferentLines) {
    let [name, decoratorOptions] = normalizeConfig(decoratorConfig);
    let info = decoratorInfo(context, node, name, decoratorOptions);

    if (!info.needsTransform) {
      return;
    }

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


function normalizeConfig(config) {
  let name;
  let options = {};

  if (typeof config === 'string') {
    name = config;
  } else {
    name = config[0];
    options = config[1];
  }

  name = name.replace('@', '');

  return [name, options];
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


function decoratorInfo(context, node, name, options) {
  const { decorators, key } = node;
  const decorator = decorators.find(decorator => {
    return nameOfDecorator(decorator) === name;
  });

  if (!decorator) {
    return {};
  }

  const decoratorName = nameOfDecorator(decorator);
  const arity = arityOfDecorator(decorator);
   let arityMatches = (
      // we don't care what the args are, if they exist
      options.withArgs === undefined
      // this config requires args, so ensure the decorator has them
      || (options.withArgs === true && (info.arity >= 0))
      // this config requires no args, so ensure the decorator doesn't have them
      || (options.withArgs === false && info.arity === undefined)
    );

  const positioning = linePositioning(decorator, key)

  return {
    decorator,
    arity,
    arityMatches,
    needsTransform: decorator || positioning.onSameLine || !arityMatches,
    name: decoratorName,
    ...positioning
  };
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
      return undefined;
  }
}
