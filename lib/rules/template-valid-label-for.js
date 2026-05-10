'use strict';

// See html-validate (https://html-validate.org/rules/valid-for.html) for the related peer rule.
//
// Validates <label for="x"> in two ways:
//   1. Points to a labelable HTML control defined in the same template
//      (not a <div> or other arbitrary element).
//   2. If the target is already nested inside the label, flag it as
//      redundant (the `for` adds nothing — the nested element is
//      already associated via the containment rule).
//
// Dynamic `for` values (mustache) are skipped. Targets we can't find in
// this template are also skipped (partial templates, yielded content).

const LABELABLE_TAGS = new Set([
  'button',
  'input',
  'meter',
  'output',
  'progress',
  'select',
  'textarea',
]);

// Ember's built-in <Input> / <Textarea> components render to native <input>
// and <textarea> and accept `id=` forwarding — they are valid targets for
// <label for="…">. In classic Handlebars `<Input>` always resolves globally
// to the built-in; in strict GJS/GTS the tag must be explicitly imported.
// Resolution logic:
//
//   1. PascalCase tag with a local import binding → check whether the
//      import source is `@ember/component` and the imported name is
//      `Input` / `Textarea`. If so, the local alias (e.g. `<MyInput>`)
//      still resolves to the built-in → labelable. Imports from other
//      modules → NOT labelable (false-negative acceptable).
//   2. PascalCase tag with no local import binding in classic HBS (no
//      import scope) → global resolution; treat as the built-in.
//      In strict GJS/GTS, no import binding → NOT the built-in.
const EMBER_BUILTIN_FORM_COMPONENTS = new Set(['Input', 'Textarea']);

// Cache of imports parsed once per sourceCode. Key is sourceCode (a fresh
// object per ESLint traversal); value is a Map<localName, importedName|null>
// where null means "bound to an import from some other module". Turns a
// per-call O(n) scan of ast.body into an amortized O(1) lookup per tag.
const IMPORT_CACHE = new WeakMap();

function getImportedComponents(sourceCode) {
  if (!sourceCode) {
    return null;
  }
  let cached = IMPORT_CACHE.get(sourceCode);
  if (cached) {
    return cached;
  }
  const ast = sourceCode.ast;
  if (!ast || !Array.isArray(ast.body)) {
    return null;
  }
  cached = new Map();
  for (const decl of ast.body) {
    if (decl.type !== 'ImportDeclaration') {
      continue;
    }
    const fromEmberComponent = decl.source?.value === '@ember/component';
    for (const specifier of decl.specifiers) {
      const local = specifier.local?.name;
      if (!local) {
        continue;
      }
      if (!fromEmberComponent) {
        // Local binding exists but points outside @ember/component → not
        // the built-in. Record null so we short-circuit future lookups.
        cached.set(local, null);
        continue;
      }
      // Only named imports (`import { Input }`, `import { Input as X }`)
      // introduce a built-in binding. Default and namespace imports from
      // @ember/component are not the form components — skip them.
      if (specifier.type !== 'ImportSpecifier') {
        continue;
      }
      cached.set(local, specifier.imported?.name);
    }
  }
  IMPORT_CACHE.set(sourceCode, cached);
  return cached;
}

function resolvesToEmberFormComponent(tagName, sourceCode, isStrictMode) {
  if (!tagName) {
    return false;
  }
  if (!isStrictMode) {
    // Classic HBS: <Input>/<Textarea> resolve globally to the built-in.
    return EMBER_BUILTIN_FORM_COMPONENTS.has(tagName);
  }
  const imports = getImportedComponents(sourceCode);
  if (!imports) {
    return false;
  }
  if (imports.has(tagName)) {
    const importedName = imports.get(tagName);
    return importedName !== null && EMBER_BUILTIN_FORM_COMPONENTS.has(importedName);
  }
  // No import binding in strict GJS/GTS — not the built-in.
  return false;
}

function findAttr(node, name) {
  return node.attributes?.find((attr) => attr.name === name);
}

function getStaticAttrString(node, name) {
  const attr = findAttr(node, name);
  if (!attr || !attr.value || attr.value.type !== 'GlimmerTextNode') {
    return null;
  }
  return attr.value.chars;
}

function isInputHidden(node, sourceCode, isStrictMode) {
  // Native <input type="hidden">.
  if (node.tag === 'input') {
    const type = getStaticAttrString(node, 'type');
    return type !== null && type.toLowerCase() === 'hidden';
  }
  // Ember <Input type="hidden"> (including aliased imports). Renders to a
  // native <input type="hidden"> → not labelable for the same reason.
  if (resolvesToEmberFormComponent(node.tag, sourceCode, isStrictMode)) {
    // Only <Input> carries a type= attribute; <Textarea> never has hidden
    // semantics. But check the attr regardless — cheap and keeps the
    // predicate symmetric.
    const type = getStaticAttrString(node, 'type');
    return type !== null && type.toLowerCase() === 'hidden';
  }
  return false;
}

function isLabelable(node, sourceCode, isStrictMode) {
  if (!node || node.type !== 'GlimmerElementNode') {
    return false;
  }
  if (isInputHidden(node, sourceCode, isStrictMode)) {
    return false;
  }
  if (resolvesToEmberFormComponent(node.tag, sourceCode, isStrictMode)) {
    return true;
  }
  if (!LABELABLE_TAGS.has(node.tag)) {
    return false;
  }
  return true;
}

function isDescendant(candidate, ancestor) {
  let current = candidate.parent;
  while (current) {
    if (current === ancestor) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

// Per HTML §4.10.4 ("The label element"), a label with BOTH `for=` and a
// labelable descendant binds to the `for`-referenced element — the
// containment rule is the *implicit* binding and only applies when no
// `for` is present. When `for` is present, it wins.
//
// So `redundantFor` should only fire when the `for` target is the same
// element that would have been the implicit control — i.e. the FIRST
// labelable descendant (HTML uses "first labelable element in tree order
// that is a descendant of the label element", excluding hidden inputs).
// A label with multiple labelable descendants and `for=` pointing at a
// non-first one is expressing an explicit choice and must not be flagged.
function findFirstLabelableDescendant(node, sourceCode, isStrictMode) {
  if (!node.children) {
    return null;
  }
  for (const child of node.children) {
    if (!child || child.type !== 'GlimmerElementNode') {
      continue;
    }
    if (isLabelable(child, sourceCode, isStrictMode)) {
      return child;
    }
    const nested = findFirstLabelableDescendant(child, sourceCode, isStrictMode);
    if (nested) {
      return nested;
    }
  }
  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require `<label for>` to point at a labelable form control',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-valid-label-for.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      notLabelable:
        '`<label for="{{id}}">` must reference a labelable form control (`<input>`, `<select>`, `<textarea>`, `<button>`, `<meter>`, `<output>`, `<progress>`, or Ember `<Input>` / `<Textarea>`)',
      redundantFor:
        '`for="{{id}}"` is redundant: `<label>` already contains the referenced element',
    },
  },

  create(context) {
    // Per-<template>-block state: multi-template .gjs files compose
    // independent DOM subtrees (e.g. `const Foo = <template>…</template>;
    // <template>…</template>` in one file). Each block's <label for> must
    // bind to ids declared in the same block — ids from sibling templates
    // aren't present in the composed DOM at runtime.
    let idToElement = new Map();
    let labels = [];

    const filename = context.filename ?? context.getFilename?.() ?? '';
    const isStrictMode = filename.endsWith('.gjs') || filename.endsWith('.gts');

    function resetTemplateState() {
      idToElement = new Map();
      labels = [];
    }

    function validateCurrentTemplate() {
      const sourceCode = context.sourceCode || context.getSourceCode();
      for (const { labelNode, forAttr, forValue } of labels) {
        const target = idToElement.get(forValue);
        if (!target) {
          continue;
        }
        if (!isLabelable(target, sourceCode, isStrictMode)) {
          context.report({
            node: forAttr,
            messageId: 'notLabelable',
            data: { id: forValue },
          });
          continue;
        }
        if (isDescendant(target, labelNode)) {
          // Only redundant when `for` resolves to the SAME element that
          // the implicit-containment rule would bind — the first
          // labelable descendant. If `for` points at a later labelable
          // descendant, the author is overriding the implicit choice,
          // which is not redundant.
          const implicit = findFirstLabelableDescendant(labelNode, sourceCode, isStrictMode);
          if (implicit && implicit === target) {
            context.report({
              node: forAttr,
              messageId: 'redundantFor',
              data: { id: forValue },
            });
          }
        }
      }
      resetTemplateState();
    }

    return {
      // Multi-template .gjs: reset state on each <template> entry so ids
      // from earlier templates don't leak into the next one's for= resolution.
      GlimmerTemplate() {
        resetTemplateState();
      },
      'GlimmerTemplate:exit'() {
        validateCurrentTemplate();
      },
      GlimmerElementNode(node) {
        const idValue = getStaticAttrString(node, 'id');
        if (idValue && !idToElement.has(idValue)) {
          idToElement.set(idValue, node);
        }
        if (node.tag === 'label') {
          const forAttr = findAttr(node, 'for');
          const forValue = getStaticAttrString(node, 'for');
          if (forAttr && forValue) {
            labels.push({ labelNode: node, forAttr, forValue });
          }
        }
      },
      'Program:exit'() {
        // Fallback for .hbs (no GlimmerTemplate wrapper) — if
        // GlimmerTemplate:exit never fired, any pending labels/ids here are
        // from the single implicit template and need validation.
        if (labels.length > 0 || idToElement.size > 0) {
          validateCurrentTemplate();
        }
      },
    };
  },
};
