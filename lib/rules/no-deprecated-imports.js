'use strict';

const emberSourceVersion = require('../utils/ember-source-version');
const { DEPRECATED_IMPORTS, getReportVersion } = require('../utils/deprecated-imports');

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/** @type {Map<string, typeof DEPRECATED_IMPORTS>} */
const DEPRECATIONS_BY_SOURCE = new Map();
for (const deprecation of DEPRECATED_IMPORTS) {
  const list = DEPRECATIONS_BY_SOURCE.get(deprecation.source) || [];
  list.push(deprecation);
  DEPRECATIONS_BY_SOURCE.set(deprecation.source, list);
}

function isReachedBy(installedVersion, deprecation) {
  const [major, minor] = getReportVersion(deprecation).split('.').map(Number);
  return emberSourceVersion.isVersionAtLeast(installedVersion, major, minor);
}

function describeExport(source, exportName) {
  if (exportName === 'default') {
    return `the default export of \`${source}\``;
  }
  return `\`${exportName}\` from \`${source}\``;
}

function getName(node) {
  return node.type === 'Literal' ? node.value : node.name;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow imports that are deprecated in the installed (or an upcoming) ember-source version',
      category: 'Deprecations',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-deprecated-imports.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          reportAll: {
            type: 'boolean',
            default: false,
            description:
              'Report every known deprecation, including ones that are not yet available in the installed ember-source version.',
          },
          imports: {
            type: 'object',
            description:
              'Per import path overrides. `report: true` opts in to that path early, `report: false` silences it.',
            propertyNames: { enum: [...DEPRECATIONS_BY_SOURCE.keys()] },
            additionalProperties: {
              type: 'object',
              properties: {
                report: { type: 'boolean' },
              },
              required: ['report'],
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      deprecated:
        'Importing {{what}} is deprecated in Ember {{version}} (id: {{id}}). {{replacement}} See {{url}}',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const reportAll = options.reportAll === true;
    const overrides = options.imports || {};

    const hasOptIn = reportAll || Object.values(overrides).some((o) => o.report === true);
    const installedVersion = reportAll
      ? null
      : emberSourceVersion.getEmberSourceVersion(context.cwd ?? context.getCwd?.());

    // Without a detectable ember-source, only explicit opt-ins are reported.
    if (!installedVersion && !hasOptIn) {
      return {};
    }

    function shouldReport(deprecation) {
      const override = overrides[deprecation.source];
      if (override) {
        return override.report;
      }
      if (reportAll) {
        return true;
      }
      return Boolean(installedVersion) && isReachedBy(installedVersion, deprecation);
    }

    function report(node, what, deprecation) {
      context.report({
        node,
        messageId: 'deprecated',
        data: {
          what,
          version: getReportVersion(deprecation),
          id: deprecation.id,
          replacement: deprecation.replacement,
          url: deprecation.url,
        },
      });
    }

    /**
     * @param {string} source
     * @param {Array<{ node: import('eslint').Rule.Node, exportName: string | null }>} bindings
     *   `exportName` is null for namespace bindings
     * @param {import('eslint').Rule.Node} declaration
     */
    function check(source, bindings, declaration) {
      const deprecations = DEPRECATIONS_BY_SOURCE.get(source);
      if (!deprecations) {
        return;
      }

      for (const deprecation of deprecations) {
        if (!shouldReport(deprecation)) {
          continue;
        }

        if (deprecation.exports === null) {
          // The whole module is deprecated: flag every binding, or the bare import itself.
          if (bindings.length === 0) {
            report(declaration, `\`${source}\``, deprecation);
          }
          for (const { node, exportName } of bindings) {
            report(
              node,
              exportName ? describeExport(source, exportName) : `\`${source}\``,
              deprecation
            );
          }
          continue;
        }

        for (const { node, exportName } of bindings) {
          if (exportName && deprecation.exports.includes(exportName)) {
            report(node, describeExport(source, exportName), deprecation);
          }
        }
      }
    }

    return {
      ImportDeclaration(node) {
        const bindings = node.specifiers.map((specifier) => {
          switch (specifier.type) {
            case 'ImportDefaultSpecifier': {
              return { node: specifier, exportName: 'default' };
            }
            case 'ImportNamespaceSpecifier': {
              return { node: specifier, exportName: null };
            }
            default: {
              return { node: specifier, exportName: getName(specifier.imported) };
            }
          }
        });
        check(node.source.value, bindings, node);
      },

      ExportNamedDeclaration(node) {
        if (!node.source) {
          return;
        }
        const bindings = node.specifiers.map((specifier) => ({
          node: specifier,
          exportName: getName(specifier.local),
        }));
        check(node.source.value, bindings, node);
      },

      ExportAllDeclaration(node) {
        check(node.source.value, [], node);
      },
    };
  },
};
