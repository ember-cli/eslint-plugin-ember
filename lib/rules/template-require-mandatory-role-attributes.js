'use strict';

const { roles } = require('aria-query');
const { AXObjectRoles, elementAXObjects } = require('axobject-query');
const { classifyAttribute } = require('../utils/glimmer-attr-presence');

// ARIA role values are whitespace-separated tokens compared ASCII-case-insensitively.
// Returns the list of normalised tokens, or undefined when the attribute is
// missing or dynamic.
//
// `role` is a plain string attribute (no boolean coercion — see
// docs/glimmer-attribute-behavior.md cross-attribute observations).
// Recognise every source form that renders a statically-known role string:
//   - GlimmerTextNode (i1): `role="button"`
//   - bare-mustache string literal (i2 analog): `role={{"button"}}`
//   - concat with all-literal parts (i3 analog): `role="{{'button'}}"`
// classifyAttribute resolves all three to the same string value.
function getStaticRolesFromElement(node) {
  const roleAttr = node.attributes?.find((attr) => attr.name === 'role');
  const { presence, value } = classifyAttribute(roleAttr);
  if (presence === 'present' && value !== null) {
    return splitRoleTokens(value);
  }

  return undefined;
}

function getStaticRolesFromMustache(node) {
  const rolePair = node.hash?.pairs?.find((pair) => pair.key === 'role');

  if (rolePair?.value?.type === 'GlimmerStringLiteral') {
    return splitRoleTokens(rolePair.value.value);
  }

  return undefined;
}

function splitRoleTokens(value) {
  if (!value) {
    return undefined;
  }
  const tokens = value.trim().toLowerCase().split(/\s+/u).filter(Boolean);
  return tokens.length > 0 ? tokens : undefined;
}

// Reads the static lowercase value of `name` from either a GlimmerElementNode
// (angle-bracket attributes) or a GlimmerMustacheStatement (hash pairs).
// Returns undefined for dynamic values or missing attributes.
function getStaticAttrValue(node, name) {
  if (node?.type === 'GlimmerElementNode') {
    const attr = node.attributes?.find((a) => a.name === name);
    if (attr?.value?.type === 'GlimmerTextNode') {
      return attr.value.chars?.toLowerCase();
    }
    return undefined;
  }
  if (node?.type === 'GlimmerMustacheStatement') {
    const pair = node.hash?.pairs?.find((p) => p.key === name);
    if (pair?.value?.type === 'GlimmerStringLiteral') {
      return pair.value.value?.toLowerCase();
    }
    return undefined;
  }
  return undefined;
}

// In classic Handlebars (.hbs) `{{input}}` globally resolves to Ember's
// built-in input helper, which renders a native <input>. In strict-mode
// GJS/GTS there is no corresponding lowercase `input` export from
// `@ember/component` (only the PascalCase `<Input>` component), so
// `{{input}}` in strict mode is always a user-bound identifier and cannot
// be assumed to render a native <input>. Treating it as native there
// would silently skip required-ARIA checks on arbitrary components.
function isClassicHbsFilename(context) {
  const filename = context.filename || context.getFilename?.() || '';
  return !filename.endsWith('.gjs') && !filename.endsWith('.gts');
}

function getTagName(node, context) {
  if (node?.type === 'GlimmerElementNode') {
    // HTML tag names are case-insensitive; normalize so <INPUT>/<Input> match
    // the lowercase keys in AX_CONCEPTS_BY_TAG and the semantic-role maps.
    return node.tag?.toLowerCase();
  }
  if (node?.type === 'GlimmerMustacheStatement' && node.path?.original === 'input') {
    if (!context || isClassicHbsFilename(context)) {
      return 'input';
    }
    // Strict-mode {{input}} — not the classic helper, can't claim native.
    return null;
  }
  return null;
}

// Does this {element, role} pair match one of axobject-query's elementAXObjects
// concepts? If so, the native element exposes the role's required ARIA state
// automatically (e.g., <input type=checkbox> exposes aria-checked via the
// `checked` attribute for both role=checkbox and role=switch).
//
// Mirrors jsx-a11y's `isSemanticRoleElement` util
// (https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/src/util/isSemanticRoleElement.js).
//
// Pre-indexed at module load: elementAXObjects is static data, so we resolve
// each concept's exposed-role set once (walking axObjectNames → AXObjectRoles
// → role names) and bucket concepts by tag. That turns the per-call hot path
// into O(concepts-for-this-tag × attrs-on-that-concept), which in practice
// is a handful of entries. Benchmarked at ~12.5× faster than the naive full-
// map walk on a realistic 200k-call workload.
const AX_CONCEPTS_BY_TAG = buildAxConceptsByTag();

function buildAxConceptsByTag() {
  const index = new Map();
  for (const [concept, axObjectNames] of elementAXObjects) {
    const conceptRoles = new Set();
    for (const axName of axObjectNames) {
      const axRoles = AXObjectRoles.get(axName);
      if (!axRoles) {
        continue;
      }
      for (const axRole of axRoles) {
        conceptRoles.add(axRole.name);
      }
    }
    const entry = { attributes: concept.attributes || [], roles: conceptRoles };
    if (!index.has(concept.name)) {
      index.set(concept.name, []);
    }
    index.get(concept.name).push(entry);
  }
  return index;
}

function isSemanticRoleElement(node, role, context) {
  const tag = getTagName(node, context);
  if (!tag || typeof role !== 'string') {
    return false;
  }
  const entries = AX_CONCEPTS_BY_TAG.get(tag);
  if (!entries) {
    return false;
  }
  const targetRole = role.toLowerCase();
  for (const { attributes, roles: conceptRoles } of entries) {
    if (!conceptRoles.has(targetRole)) {
      continue;
    }
    const allMatch = attributes.every((cAttr) => {
      const nodeVal = getStaticAttrValue(node, cAttr.name);
      if (nodeVal === undefined) {
        return false;
      }
      if (cAttr.value === undefined) {
        return true;
      }
      return nodeVal === String(cAttr.value).toLowerCase();
    });
    if (allMatch) {
      return true;
    }
  }
  return false;
}

// For an ARIA role-fallback list like "combobox listbox", check required
// attributes against the FIRST recognised role (the primary) per ARIA 1.2
// role-fallback semantics — a user agent picks the first role it recognises.
// Abstract roles (widget, input, command, section, … — ARIA §5.3) are
// ontology categories, not valid authoring roles, so UAs skip them too.
//
// When the primary role is a semantic-role element (axobject-query says the
// native element provides the required ARIA state natively — e.g. <input
// type=checkbox role=switch>), the element is exempt: return { role, missing: null }.
//
// Diverges from jsx-a11y, which validates every recognised token.
function getMissingRequiredAttributes(roleTokens, foundAriaAttributes, node, context) {
  for (const role of roleTokens) {
    const roleDefinition = roles.get(role);
    if (!roleDefinition || roleDefinition.abstract) {
      continue;
    }
    // Semantic-role elements expose required ARIA state natively — skip.
    if (isSemanticRoleElement(node, role, context)) {
      return { role, missing: null };
    }
    const requiredAttributes = Object.keys(roleDefinition.requiredProps);
    const missingRequiredAttributes = requiredAttributes
      .filter((requiredAttribute) => !foundAriaAttributes.includes(requiredAttribute))
      // Sort for deterministic report order (aria-query's requiredProps
      // iteration order is not guaranteed stable across versions).
      .sort();
    return {
      role,
      missing: missingRequiredAttributes.length > 0 ? missingRequiredAttributes : null,
    };
  }
  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require mandatory ARIA attributes for ARIA roles',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-mandatory-role-attributes.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      missingAttributes:
        'The {{attributeWord}} {{attributes}} {{verb}} required by the role {{role}}',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-mandatory-role-attributes.js',
      docs: 'docs/rule/require-mandatory-role-attributes.md',
      tests: 'test/unit/rules/require-mandatory-role-attributes-test.js',
    },
  },

  create(context) {
    function reportMissingAttributes(node, role, missingRequiredAttributes) {
      context.report({
        node,
        messageId: 'missingAttributes',
        data: {
          attributeWord: missingRequiredAttributes.length < 2 ? 'attribute' : 'attributes',
          attributes: missingRequiredAttributes.join(', '),
          verb: missingRequiredAttributes.length < 2 ? 'is' : 'are',
          role,
        },
      });
    }

    return {
      GlimmerElementNode(node) {
        const roleTokens = getStaticRolesFromElement(node);

        if (!roleTokens) {
          return;
        }

        // Per docs/glimmer-attribute-behavior.md cross-attribute observations,
        // bare-mustache falsy literals on aria-* attributes (rows h6, h9, h10)
        // cause Glimmer to OMIT the attribute at runtime. AST-presence is not
        // a proxy for runtime-presence here: an element written as
        // <div role="option" aria-selected={{false}}> renders without any
        // aria-selected attribute and should NOT be treated as satisfying
        // role="option"'s required ARIA state.
        const foundAriaAttributes = (node.attributes ?? [])
          .filter(
            (attribute) =>
              attribute.name?.startsWith('aria-') &&
              classifyAttribute(attribute).presence !== 'absent'
          )
          .map((attribute) => attribute.name);

        const result = getMissingRequiredAttributes(roleTokens, foundAriaAttributes, node, context);

        if (result?.missing) {
          reportMissingAttributes(node, result.role, result.missing);
        }
      },

      GlimmerMustacheStatement(node) {
        const roleTokens = getStaticRolesFromMustache(node);

        if (!roleTokens) {
          return;
        }

        const foundAriaAttributes = (node.hash?.pairs ?? [])
          .filter((pair) => pair.key.startsWith('aria-'))
          .map((pair) => pair.key);

        const result = getMissingRequiredAttributes(roleTokens, foundAriaAttributes, node, context);

        if (result?.missing) {
          reportMissingAttributes(node, result.role, result.missing);
        }
      },
    };
  },
};
