# Future Work: `@arg` Deprecation in Templates

This document tracks the unimplemented case for `ember/template-no-deprecated`:
detecting `@deprecated` on component arguments passed in template syntax.

## The Problem

`<MyComponent @deprecatedArg={{x}}>` — `@deprecatedArg` appears as a `GlimmerAttrNode`.
It is never scope-registered (the parser skips args, see `ember-eslint-parser/src/parser/transforms.js`
around line 504). The scope-based approach used in `template-no-deprecated` does not apply here.

## The Analogous Solved Problem

`@typescript-eslint/no-deprecated` handles JSX attributes via `getJSXAttributeDeprecation`
(`no-deprecated.js:266–271`):

```js
function getJSXAttributeDeprecation(openingElement, propertyName) {
  const tsNode = services.esTreeNodeToTSNodeMap.get(openingElement.name);
  const contextualType = checker.getContextualType(tsNode);
  const symbol = contextualType.getProperty(propertyName);
  return getJsDocDeprecation(symbol);
}
```

This works because `JSXOpeningElement.name` is a standard TS AST node, so
`esTreeNodeToTSNodeMap` has it, and TypeScript's JSX support provides `getContextualType`
for JSX element names (which gives the props type directly).

## Why This Doesn't Directly Apply to Glimmer

`GlimmerElementNode.parts[0]` (`GlimmerElementNodePart`) is a **synthetic node** invented by
`ember-eslint-parser`. It is not in `esTreeNodeToTSNodeMap`. Therefore:

- `services.esTreeNodeToTSNodeMap.get(parts[0])` → `undefined`
- `checker.getContextualType(undefined)` → crash

## Options

### Option A: Navigate the Type Manually (no Glint required)

1. Visit `GlimmerAttrNode` where `node.name.startsWith('@')`
2. Get parent `GlimmerElementNode`, resolve its import binding (same as `template-no-deprecated`)
3. `services.esTreeNodeToTSNodeMap.get(importDefNode)` → TS import node
4. `checker.getTypeAtLocation(tsImportNode)` → component's constructor type
5. Navigate type parameters to extract the `Args` type:
   - Get base type `Component<{Args: A}>` → extract first type argument → get `A`
   - Requires walking `type.typeArguments` and the `Args` property
6. `argsType.getProperty(argName.slice(1))` → property symbol
7. `getJsDocDeprecation(symbol)` → check for `@deprecated`

Self-contained (no Glint needed) but TypeScript type navigation is brittle —
it depends on the specific generic signature of `@glimmer/component`.

### Option B: Register `@arg` Nodes in Scope (requires ember-eslint-parser change)

Modify `ember-eslint-parser/src/parser/transforms.js` to register `GlimmerAttrNode` names
starting with `@` as references, using a virtual identifier that IS in `esTreeNodeToTSNodeMap`.
Then the JSX-attribute pattern would work directly.

This is an upstream change to `ember-eslint-parser`, not this plugin.

### Option C: Use Glint v2 Virtual TypeScript Files (future)

Glint v2 (Volar) operates as a tsserver TS plugin. ESLint's `@typescript-eslint/parser`
creates a separate TypeScript program that does **not** load tsserver plugins by default,
so Glint's template type information is not available in `parserServices.program`.

To bridge this: either (1) `ember-eslint-parser` would need to integrate with Glint's
virtual file infrastructure and re-expose the resulting program, or (2) Glint v2 would need
to provide a TypeScript compiler transform (not just a language server plugin) that
`@typescript-eslint/parser` picks up automatically. Neither exists today. File this as a
Glint project concern.

## Recommended Path

Option A is the most tractable near-term approach — no upstream changes required.
The main risk is brittleness against non-standard component base classes.
Option B is architecturally cleaner but requires coordination with `ember-eslint-parser` maintainers.
