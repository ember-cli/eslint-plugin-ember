const { existsSync } = require('node:fs');
const path = require('node:path');

const VALID_COMPONENT_EXTENSIONS = ['.js', '.ts'];
const GLIMMER_SCRIPT_EXTENSIONS = ['.gjs', '.gts'];

function componentClassExists(pathWithoutExtension) {
  return VALID_COMPONENT_EXTENSIONS.some((ext) => existsSync(pathWithoutExtension + ext));
}

// Port of ember-template-lint's no-this-in-template-only-components#isTemplateOnlyComponent.
// Returns true when the template has no backing component class file on disk.
function isTemplateOnlyComponent(templateFilePath) {
  // .gjs/.gts files always have JS context, so they cannot be template-only.
  if (GLIMMER_SCRIPT_EXTENSIONS.some((ext) => templateFilePath.endsWith(ext))) {
    return false;
  }

  const allSegments = path.normalize(templateFilePath).split(path.sep);

  const appIndex = allSegments.findIndex((seg) => seg === 'app' || seg === 'addon');
  if (appIndex === -1) {
    // No app/addon directory found — cannot determine layout, don't flag.
    return false;
  }
  // Preserve everything before `app`/`addon` as a prefix so we can rebuild
  // absolute class file paths (upstream uses relative paths, which only
  // works when the cwd happens to contain `app/`).
  const prefix = allSegments.slice(0, appIndex).join(path.sep);
  const segments = allSegments.slice(appIndex);

  if (segments[1] === 'templates') {
    if (segments[2] === 'components') {
      // Classic structure: app/templates/components/foo.hbs => app/components/foo.{js,ts}
      const moduleName = path.basename(templateFilePath, '.hbs');
      const classFilePath = path.join(
        prefix,
        segments[0],
        'components',
        ...segments.slice(3, -1),
        moduleName
      );
      return !componentClassExists(classFilePath);
    }
    // Route template — always has a backing controller/route context.
    return false;
  }

  if (segments[1] === 'components') {
    // Co-located structure: app/components/foo.hbs => app/components/foo.{js,ts}
    const moduleName = path.basename(templateFilePath, '.hbs');
    const classFilePath = path.join(path.dirname(templateFilePath), moduleName);
    return !componentClassExists(classFilePath);
  }

  // Unknown layout (e.g. pods) — assume template-only.
  return true;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow this in template-only components',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-this-in-template-only-components.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noThis:
        "Usage of 'this' in path '{{original}}' is not allowed in a template-only component. Use '{{fixed}}' if it is a named argument.",
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-this-in-template-only-components.js',
      docs: 'docs/rule/no-this-in-template-only-components.md',
      tests: 'test/unit/rules/no-this-in-template-only-components-test.js',
    },
  },
  create(context) {
    // Properties that should not be auto-fixed (built-in component properties)
    const BUILTIN_PROPERTIES = new Set([
      'action',
      'element',
      'parentView',
      'attrs',
      'elementId',
      'tagName',
      'ariaRole',
      'class',
      'classNames',
      'classNameBindings',
      'attributeBindings',
      'isVisible',
      'isDestroying',
      'isDestroyed',
    ]);

    const filename = context.filename;
    const isHbs = filename.endsWith('.hbs');

    // For .hbs files, check the filesystem for a companion class file.
    // If one exists, this is NOT a template-only component — skip entirely.
    if (isHbs && !isTemplateOnlyComponent(filename)) {
      return {};
    }

    return {
      GlimmerPathExpression(node) {
        // For .gjs/.gts files: walk ancestors to check if <template> is inside a class body.
        // If so, the component has a backing class — skip.
        // .hbs files are already handled above via the filesystem check.
        if (!isHbs) {
          const sourceCode = context.sourceCode;
          const ancestors = sourceCode.getAncestors
            ? sourceCode.getAncestors(node)
            : context.getAncestors();
          const isInsideClass = ancestors.some(
            (ancestor) => ancestor.type === 'ClassBody' || ancestor.type === 'ClassDeclaration'
          );
          if (isInsideClass) {
            return;
          }
        }

        // Check for this.* usage
        if (node.head?.type === 'ThisHead' && node.tail?.length > 0) {
          const original = node.original;
          const firstPart = node.tail[0];
          const fixed = `@${node.tail.join('.')}`;
          const canFix = !BUILTIN_PROPERTIES.has(firstPart);

          context.report({
            node,
            messageId: 'noThis',
            data: { original, fixed },
            fix: canFix ? (fixer) => fixer.replaceText(node, fixed) : undefined,
          });
        }
      },
    };
  },
};
