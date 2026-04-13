// Mirror upstream ember-template-lint's inverse-of-isAngleBracketComponent logic.
// A tag is treated as an HTML element only when it:
//   - does NOT contain ':' (named blocks like <:slot>)
//   - does NOT contain '.' (path/namespaced invocations like <foo.bar>)
//   - does NOT start with '@' (argument invocations like <@foo>)
//   - has NO uppercase letters (component invocations like <MyThing>)
//   - does NOT contain '-' (HTML custom elements like <my-element>)
// Everything else is a component / custom-element / slot — not a plain HTML element.
function isHtmlElement(tagName) {
  if (!tagName) {
    return false;
  }
  if (tagName.startsWith('@')) {
    return false;
  }
  if (tagName.includes(':')) {
    return false;
  }
  if (tagName.includes('.')) {
    return false;
  }
  if (tagName.includes('-')) {
    return false;
  }
  if (tagName !== tagName.toLowerCase()) {
    return false;
  }
  return true;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow ambiguity with block param names shadowing HTML elements',
      category: 'Possible Errors',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-shadowed-elements.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      shadowed: 'Component name "{{name}}" shadows HTML element <{{name}}>. Use a different name.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-shadowed-elements.js',
      docs: 'docs/rule/no-shadowed-elements.md',
      tests: 'test/unit/rules/no-shadowed-elements-test.js',
    },
  },

  create(context) {
    const blockParamScope = [];

    function pushScope(params) {
      blockParamScope.push(new Set(params || []));
    }

    function popScope() {
      blockParamScope.pop();
    }

    function isLocal(name) {
      for (const scope of blockParamScope) {
        if (scope.has(name)) {
          return true;
        }
      }
      return false;
    }

    return {
      GlimmerBlockStatement(node) {
        if (node.program && node.program.blockParams) {
          pushScope(node.program.blockParams);
        }
      },
      'GlimmerBlockStatement:exit'(node) {
        if (node.program && node.program.blockParams) {
          popScope();
        }
      },

      GlimmerElementNode(node) {
        // Push block params for elements with 'as |...|' syntax
        if (node.blockParams && node.blockParams.length > 0) {
          pushScope(node.blockParams);
        }

        const tag = node.tag;
        if (!tag) {
          return;
        }

        // Mirror upstream: if the tag is an angle-bracket-component (i.e.
        // not a plain HTML element — contains '.', is PascalCase, has a
        // hyphen, etc.) it cannot be a shadow of a native HTML element.
        // Only a lowercase / simple tag that is a local block param is
        // considered shadowed. This also covers tags not in any static
        // html-tags list (upstream does not restrict to a known set).
        if (!isHtmlElement(tag)) {
          return;
        }

        if (isLocal(tag)) {
          context.report({
            node,
            messageId: 'shadowed',
            data: { name: tag },
          });
        }
      },

      'GlimmerElementNode:exit'(node) {
        if (node.blockParams && node.blockParams.length > 0) {
          popScope();
        }
      },
    };
  },
};
