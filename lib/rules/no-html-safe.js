'use strict';

// Module → the exports that mark a string as trusted HTML.
const HTML_SAFE_EXPORTS = {
  '@ember/string': ['htmlSafe'],
  '@ember/template': ['htmlSafe', 'trustHTML'],
};

// An import or export name can be an identifier or, since ES2022, a string.
function getModuleExportName(node) {
  return node.type === 'Identifier' ? node.name : node.value;
}

function isTypeOnly(node) {
  return node.importKind === 'type' || node.exportKind === 'type';
}

// The node to report for a reference to `htmlSafe`/`trustHTML`, or null.
// In gjs/gts, ember-eslint-parser adds template paths like `{{htmlSafe x}}`
// to the scope as references, so this covers templates as well as JS.
function getNamedUseNode(identifier) {
  // `{{htmlSafe x}}`, `(htmlSafe x)`, `{{htmlSafe}}`
  if (identifier.parent.type === 'GlimmerPathExpression') {
    return identifier.parent;
  }

  // Look through TypeScript wrappers: `htmlSafe!(x)`, `(htmlSafe as Fn)(x)`.
  const node = skipTypeScriptWrappers(identifier);
  const parent = node.parent;

  // `typeof htmlSafe`, in a type or at runtime, does not mark anything safe.
  if (
    parent.type === 'TSTypeQuery' ||
    (parent.type === 'UnaryExpression' && parent.operator === 'typeof')
  ) {
    return null;
  }

  // `export type { htmlSafe }`
  if (parent.type === 'ExportSpecifier' && (isTypeOnly(parent) || isTypeOnly(parent.parent))) {
    return null;
  }

  // `htmlSafe(x)`
  if (parent.type === 'CallExpression' && parent.callee === node) {
    return parent;
  }

  // Any other use passes the function on: `const f = htmlSafe`,
  // `items.map(htmlSafe)`, `htmlSafe.call(...)`, `export { htmlSafe }`.
  return identifier;
}

const TYPESCRIPT_WRAPPERS = new Set([
  'TSAsExpression',
  'TSNonNullExpression',
  'TSSatisfiesExpression',
  'TSTypeAssertion',
]);

function skipTypeScriptWrappers(node) {
  let current = node;
  while (TYPESCRIPT_WRAPPERS.has(current.parent.type)) {
    current = current.parent;
  }
  return current;
}

// The property name of `t.htmlSafe`, `t['htmlSafe']` or ``t[`htmlSafe`]``.
function getStaticPropertyName(memberExpression) {
  const property = memberExpression.property;
  if (!memberExpression.computed) {
    return property.name;
  }
  if (property.type === 'Literal') {
    return property.value;
  }
  if (property.type === 'TemplateLiteral' && property.expressions.length === 0) {
    return property.quasis[0].value.cooked;
  }
  return undefined;
}

// The node and name to report for a reference to a namespace import, or null.
function getNamespaceUse(identifier, names) {
  const parent = identifier.parent;

  // `t.htmlSafe` or `t['htmlSafe']`, reported as the call when it is called.
  if (parent.type === 'MemberExpression' && parent.object === identifier) {
    const name = getStaticPropertyName(parent);
    if (!names.includes(name)) {
      return null;
    }

    const node = skipTypeScriptWrappers(parent);
    const grandparent = node.parent;
    const isCalled = grandparent.type === 'CallExpression' && grandparent.callee === node;
    return { node: isCalled ? grandparent : parent, name };
  }

  // `{{t.htmlSafe x}}`
  if (parent.type === 'GlimmerPathExpression' && names.includes(parent.tail[0])) {
    return { node: parent, name: parent.tail[0] };
  }

  return null;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the use of `htmlSafe` and `trustHTML`',
      category: 'Miscellaneous',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-html-safe.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noHtmlSafe: 'Do not use `{{name}}`.',
    },
  },

  create(context) {
    function report(node, name) {
      context.report({ node, messageId: 'noHtmlSafe', data: { name } });
    }

    function getReferences(specifier) {
      return context.sourceCode
        .getDeclaredVariables(specifier)
        .flatMap((variable) => variable.references);
    }

    return {
      ImportDeclaration(node) {
        const names = HTML_SAFE_EXPORTS[node.source.value];
        if (!names || isTypeOnly(node)) {
          return;
        }

        for (const specifier of node.specifiers) {
          if (isTypeOnly(specifier)) {
            continue;
          }

          if (specifier.type === 'ImportNamespaceSpecifier') {
            for (const { identifier } of getReferences(specifier)) {
              const use = getNamespaceUse(identifier, names);
              if (use) {
                report(use.node, use.name);
              }
            }
            continue;
          }

          if (specifier.type !== 'ImportSpecifier') {
            continue;
          }

          const name = getModuleExportName(specifier.imported);
          if (!names.includes(name)) {
            continue;
          }

          for (const { identifier } of getReferences(specifier)) {
            const useNode = getNamedUseNode(identifier);
            if (useNode) {
              report(useNode, name);
            }
          }
        }
      },

      // `export { htmlSafe } from '@ember/template'`
      ExportNamedDeclaration(node) {
        const names = node.source && HTML_SAFE_EXPORTS[node.source.value];
        if (!names || isTypeOnly(node)) {
          return;
        }

        for (const specifier of node.specifiers) {
          const name = getModuleExportName(specifier.local);
          if (names.includes(name) && !isTypeOnly(specifier)) {
            report(specifier, name);
          }
        }
      },
    };
  },
};
