'use strict';

//------------------------------------------------------------------------------
// General rule - Don’t use runloop functions
//------------------------------------------------------------------------------

/**
 * Map of runloop functions to ember-lifeline recommended replacements
 */
const RUNLOOP_TO_LIFELINE_MAP = Object.freeze({
  later: 'runTask',
  next: 'runTask',
  debounce: 'debounceTask',
  schedule: 'scheduleTask',
  throttle: 'throttleTask',
});

const ERROR_MESSAGE =
  "Don't use @ember/runloop functions. Use ember-lifeline, ember-concurrency, or @ember/destroyable instead.";

// https://api.emberjs.com/ember/3.24/classes/@ember%2Frunloop
const EMBER_RUNLOOP_FUNCTIONS = [
  'begin',
  'bind',
  'cancel',
  'debounce',
  'end',
  'join',
  'later',
  'next',
  'once',
  'run',
  'schedule',
  'scheduleOnce',
  'throttle',
];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow usage of `@ember/runloop` functions',
      category: 'Miscellaneous',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-runloop.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowList: {
            type: 'array',
            uniqueItems: true,
            items: {
              type: 'string',
              enum: EMBER_RUNLOOP_FUNCTIONS,
              minItems: 1,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      main: ERROR_MESSAGE,
      lifelineReplacement: `${ERROR_MESSAGE} For this case, you can replace \`{{actualMethodUsed}}\` with \`{{lifelineEquivalent}}\` from ember-lifeline.`,
    },
  },

  create(context) {
    // List of allowed runloop functions
    const allowList = context.options[0]?.allowList ?? [];
    // Maps local names to imported names of imports
    const localToImportedNameMap = {};

    /**
     * Reports a node with usage of a disallowed runloop function
     * @param {Node} node
     * @param {String} [runloopFn] the name of the runloop function that is not allowed
     * @param {String} [localName] the locally used name of the runloop function
     */
    const report = function (node, runloopFn, localName) {
      if (Object.keys(RUNLOOP_TO_LIFELINE_MAP).includes(runloopFn)) {
        // If there is a recommended lifeline replacement, include the suggestion
        context.report({
          node,
          messageId: 'lifelineReplacement',
          data: {
            actualMethodUsed: localName,
            lifelineEquivalent: RUNLOOP_TO_LIFELINE_MAP[runloopFn],
          },
        });
      } else {
        // Otherwise, show a generic error message
        context.report({ node, messageId: 'main' });
      }
    };

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/runloop') {
          for (const spec of node.specifiers) {
            if (spec.type === 'ImportSpecifier') {
              const importedName = spec.imported.name;
              if (EMBER_RUNLOOP_FUNCTIONS.includes(importedName)) {
                localToImportedNameMap[spec.local.name] = importedName;
              }
            }
          }
        }
      },

      CallExpression(node) {
        // Examples: run(...), later(...)
        if (node.callee.type === 'Identifier') {
          const name = node.callee.name;
          const runloopFn = localToImportedNameMap[name];
          const isNotAllowed = runloopFn && !allowList.includes(runloopFn);
          if (isNotAllowed) {
            report(node, runloopFn, name);
          }
        }

        // runloop functions (aside from run itself) can chain onto `run`, so we need to check for this
        // Examples: run.later(...), run.schedule(...)
        if (node.callee.type === 'MemberExpression' && node.callee.object?.type === 'Identifier') {
          const objectName = node.callee.object.name;
          const objectRunloopFn = localToImportedNameMap[objectName];

          if (objectRunloopFn === 'run' && node.callee.property?.type === 'Identifier') {
            const runloopFn = node.callee.property.name;

            if (
              EMBER_RUNLOOP_FUNCTIONS.includes(runloopFn) &&
              runloopFn !== 'run' &&
              !allowList.includes(runloopFn)
            ) {
              report(node, runloopFn, `${objectName}.${runloopFn}`);
            }
          }
        }
      },
    };
  },
};
