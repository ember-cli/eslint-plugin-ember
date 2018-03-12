/**
 * @fileOverview Disallow the use of anonymous functions passed to scheduleOnce and once.
 */

'use strict';

const { getCaller, cleanCaller, isCallingWithApply, isCallingWithCall } = require('../utils/caller');
const { collectObjectPatternBindings } = require('../utils/destructed-binding');
const { getEmberImportBinding } = require('../utils/imports');
const { get } = require('../utils/get');

const MESSAGE
  = `The uniqueness once offers is based on function uniqueness, each invocation of this line will always create a new
     function instance, resulting in uniqueness checks, that will never be hit. Please replace with a named function.
     Reference: https://emberjs.com/api/ember/2.14/namespaces/Ember.run/methods/scheduleOnce?anchor=scheduleOnce`;

const DISALLOWED_OBJECTS = ['Ember.run', 'run'];
const SCHEDULE_ONCE = 'scheduleOnce';
const RUN_METHODS = [SCHEDULE_ONCE, 'once'];

/**
 * Extracts the method that we are trying to run once from the list of arguments.
 * An optional target parameter can be passed in as the first parameter so we need
 * to check the length of the array to determine where our function is being passed in.
 */
function getMethodToRunOnce(args) {
  return args.length > 1 ? args[1] : args[0];
}

/**
 * scheduleOnce takes in the queue name as the first parameter. In this function we will remove
 * that parameter from the array to make it look the same as the arguments to once and facilitate
 * extracting the method that we are trying to run once out of the args.
 */
function normalizeArguments(caller, args) {
  let mut = args.slice();

  if (isCallingWithCall(caller)) {
    // Whenever the action was called .call we want to remove the context parameter
    mut.shift();
  } else if (isCallingWithApply(caller)) {
    // Whenever the action was called with .apply we want to get the arguments
    // with which the function would actually get called
    mut = mut[1].elements.slice();
  }

  // scheduleOnce takes in the queue name as the first parameter so we have to
  // remove it have a similar structure as "once"
  if (cleanCaller(caller).indexOf(SCHEDULE_ONCE) > -1) {
    mut.shift();
  }

  return mut;
}
/**
 * Determines whether a function is anonymous based on whether it was a name
 * or if it is a method on the current context.
 * @param {ASTNode} fn
 * @return {Boolean}
 */
function isAnonymousFunction(fn) {
  return !(get(fn, 'name') || get(fn, 'object.type') === 'ThisExpression');
}

function isString(node) {
  return node.type === 'Literal' && typeof node.value === 'string';
}

function mergeDisallowedCalls(objects) {
  return objects
    .reduce((calls, obj) => {
      RUN_METHODS.forEach((method) => {
        calls.push(`${obj}.${method}`);
      });

      return calls;
    }, []);
}

module.exports = {
  meta: {
    message: MESSAGE,
    docs: {
      description: 'Disallow use of anonymous functions when use in scheduleOnce or once',
      category: 'Best Practices',
      recommended: false
    }
  },
  create(context) {
    let emberImportBinding;
    let disallowedCalls = mergeDisallowedCalls(DISALLOWED_OBJECTS);

    return {
      ImportDefaultSpecifier(node) {
        emberImportBinding = getEmberImportBinding(node);
      },

      ObjectPattern(node) {
        if (!emberImportBinding) {
          return;
        }

        /**
         * Retrieves the deconstructed bindings from the Ember import, accounting for aliasing
         * of the import.
         */
        disallowedCalls = disallowedCalls.concat(
          mergeDisallowedCalls(
            collectObjectPatternBindings(node, {
              [emberImportBinding]: ['run']
            })
          )
        );
      },

      CallExpression(node) {
        const caller = getCaller(node);

        if (!disallowedCalls.includes(cleanCaller(caller))) {
          return;
        }

        const normalizedArguments = normalizeArguments(caller, node.arguments);
        const fnToRunOnce = getMethodToRunOnce(normalizedArguments);

        // The fnToRunceOnce is a string it means that it will be resolved on
        // the target at the time once or scheduleOnce is invoked.
        if (isAnonymousFunction(fnToRunOnce) && !isString(fnToRunOnce)) {
          context.report(node, MESSAGE);
        }
      }
    };
  }
};
