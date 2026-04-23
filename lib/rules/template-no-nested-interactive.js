const { isHtmlInteractiveContent } = require('../utils/html-interactive-content');
const { INTERACTIVE_ROLES, COMPOSITE_WIDGET_CHILDREN } = require('../utils/interactive-roles');

function hasAttr(node, name) {
  return node.attributes?.some((a) => a.name === name);
}

function getTextAttr(node, name) {
  const attr = node.attributes?.find((a) => a.name === name);
  if (attr?.value?.type === 'GlimmerTextNode') {
    return attr.value.chars;
  }
  return undefined;
}

function getRole(node) {
  return getTextAttr(node, 'role');
}

// Menu submenu pattern — per WAI-ARIA APG, a `menuitem` with `aria-haspopup`
// may own a nested `menu`. aria-query's `requiredOwnedElements` does not
// express this "menu-inside-menuitem" direction, so it is handled explicitly.
const MENUITEM_ROLES = new Set(['menuitem', 'menuitemcheckbox', 'menuitemradio']);

function isCompositeWidgetPattern(parentRole, childRole) {
  if (!parentRole || !childRole) {
    return false;
  }
  const allowedChildren = COMPOSITE_WIDGET_CHILDREN.get(parentRole);
  if (allowedChildren && allowedChildren.has(childRole)) {
    return true;
  }
  // Submenu: <… role="menuitem"><… role="menu"> …
  if (MENUITEM_ROLES.has(parentRole) && childRole === 'menu') {
    return true;
  }
  return false;
}

function isMenuItemNode(node) {
  return getTextAttr(node, 'role') === 'menuitem';
}

function isAllowedDetailsChild(childNode, parentEntry) {
  if (parentEntry.tag !== 'details') {
    return false;
  }
  // Non-<summary> children are flow content in the disclosed panel — allowed.
  // <summary> is only allowed as the first non-whitespace child of <details>.
  if (childNode.tag !== 'summary') {
    return true;
  }
  const children = parentEntry.node.children || [];
  const firstNonWhitespace = children.find((child) => {
    if (child.type === 'GlimmerTextNode') {
      return child.chars.trim().length > 0;
    }
    return true;
  });
  return firstNonWhitespace === childNode;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow nested interactive elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-nested-interactive.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          additionalInteractiveTags: { type: 'array', items: { type: 'string' } },
          ignoredTags: { type: 'array', items: { type: 'string' } },
          ignoreTabindex: { type: 'boolean' },
          ignoreUsemap: { type: 'boolean' },
          ignoreUsemapAttribute: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      nested: 'Do not nest interactive element <{{child}}> inside <{{parent}}>.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-nested-interactive.js',
      docs: 'docs/rule/no-nested-interactive.md',
      tests: 'test/unit/rules/no-nested-interactive-test.js',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const additionalInteractiveTags = new Set(options.additionalInteractiveTags || []);
    const ignoredTags = new Set(options.ignoredTags || []);
    const ignoreTabindex = options.ignoreTabindex || false;
    const ignoreUsemap = options.ignoreUsemap || options.ignoreUsemapAttribute || false;

    const interactiveStack = [];
    // Stack for saving/restoring label interactiveChildCount across GlimmerBlock boundaries
    const blockCountStack = [];

    function isInteractive(node) {
      const tag = node.tag?.toLowerCase();
      if (!tag) {
        return false;
      }
      if (ignoredTags.has(tag)) {
        return false;
      }
      if (additionalInteractiveTags.has(tag)) {
        return true;
      }

      // HTML §3.2.5.2.7 interactive content (authoritative for content-model
      // nesting — handles a[href], audio/video[controls], input[!hidden],
      // img[usemap], plus label/button/select/textarea/iframe/etc. unconditional).
      if (isHtmlInteractiveContent(node, getTextAttr, { ignoreUsemap })) {
        return true;
      }

      // <canvas> — not in §3.2.5.2.7 but upstream ember-template-lint treats
      // it as interactive. Preserved for parity.
      if (tag === 'canvas') {
        return true;
      }

      // ARIA widget roles (author-declared interactivity — separate authority
      // from HTML content-model: `html-interactive-content.js` speaks to the
      // HTML §3.2.5.2.7 content model, while `interactive-roles.js` speaks to
      // the WAI-ARIA 1.2 widget taxonomy).
      const role = getTextAttr(node, 'role');
      if (role && INTERACTIVE_ROLES.has(role)) {
        return true;
      }

      // Check tabindex
      if (!ignoreTabindex && hasAttr(node, 'tabindex')) {
        return true;
      }

      // Check contenteditable. Per HTML spec, valid keywords are "true",
      // "false", "plaintext-only", and the empty string (which is the default
      // state, equivalent to "true"). So the attribute enables editing unless
      // its value is "false".
      if (hasAttr(node, 'contenteditable')) {
        const ce = getTextAttr(node, 'contenteditable');
        if (ce === undefined || ce === null || ce.trim().toLowerCase() !== 'false') {
          return true;
        }
      }

      // <object usemap> — not in HTML §3.2.5.2.7 but upstream ember-template-lint
      // treats object+usemap as interactive (image-map behavior). Rule-level
      // special case for upstream parity; revisit if/when HTML-AAM clarifies.
      if (!ignoreUsemap && tag === 'object' && hasAttr(node, 'usemap')) {
        return true;
      }

      return false;
    }

    /**
     * Returns true if the element is interactive ONLY because of tabindex
     * (not because of tag name, role, contenteditable, usemap, etc.)
     * Called only after isInteractive() already returned true.
     */
    function isInteractiveOnlyFromTabindex(node) {
      const tag = node.tag?.toLowerCase();
      if (!tag) {
        return false;
      }
      if (additionalInteractiveTags.has(tag)) {
        return false;
      }
      if (isHtmlInteractiveContent(node, getTextAttr, { ignoreUsemap })) {
        return false;
      }
      const role = getTextAttr(node, 'role');
      if (role && INTERACTIVE_ROLES.has(role)) {
        return false;
      }
      if (hasAttr(node, 'contenteditable')) {
        const ce = getTextAttr(node, 'contenteditable');
        if (ce === undefined || ce === null || ce.trim().toLowerCase() !== 'false') {
          return false;
        }
      }
      if ((tag === 'img' || tag === 'object') && hasAttr(node, 'usemap')) {
        return false;
      }
      return hasAttr(node, 'tabindex');
    }

    return {
      GlimmerElementNode(node) {
        const currentIsInteractive = isInteractive(node);

        if (currentIsInteractive && interactiveStack.length > 0) {
          const parentEntry = interactiveStack.at(-1);

          if (parentEntry.tag === 'label') {
            // Label can contain ONE interactive child — track and flag additional ones
            if (parentEntry.interactiveChildCount >= 1) {
              context.report({
                node,
                messageId: 'nested',
                data: { parent: parentEntry.tag, child: node.tag },
              });
            }
            parentEntry.interactiveChildCount++;
          } else if (isAllowedDetailsChild(node, parentEntry)) {
            // flow content in the disclosed panel, or <summary> as first child
          } else if (isCompositeWidgetPattern(getRole(parentEntry.node), getRole(node))) {
            // Canonical ARIA composite-widget hierarchies — e.g. option inside
            // listbox, tab inside tablist, treeitem inside tree, row inside
            // grid/treegrid, gridcell/columnheader/rowheader inside row,
            // radio inside radiogroup, menu inside menuitem (submenu).
            // Derived from aria-query's requiredOwnedElements with superClass
            // inheritance — see lib/utils/interactive-roles.js.
          } else if (isMenuItemNode(parentEntry.node) && isMenuItemNode(node)) {
            // Nested menuitem nodes are valid (menu/sub-menu pattern) — kept
            // for historical compat since aria-query doesn't encode this via
            // requiredOwnedElements.
          } else {
            context.report({
              node,
              messageId: 'nested',
              data: { parent: parentEntry.tag, child: node.tag },
            });
          }
        }

        // Push interactive elements to the stack, but tabindex-only elements
        // should not become parent interactive nodes
        if (currentIsInteractive && !isInteractiveOnlyFromTabindex(node)) {
          interactiveStack.push({ tag: node.tag, node, interactiveChildCount: 0 });
        }
      },

      'GlimmerElementNode:exit'(node) {
        if (interactiveStack.length > 0 && interactiveStack.at(-1).node === node) {
          interactiveStack.pop();
        }
      },

      // Save/restore label interactive child count at block boundaries
      // so that conditional branches ({{#if}}/{{else}}) are tracked independently
      GlimmerBlock() {
        const labelEntry = interactiveStack.length > 0 ? interactiveStack.at(-1) : null;
        if (labelEntry && labelEntry.tag === 'label') {
          blockCountStack.push(labelEntry.interactiveChildCount);
        } else {
          blockCountStack.push(null);
        }
      },

      'GlimmerBlock:exit'() {
        const saved = blockCountStack.pop();
        if (saved !== null && saved !== undefined) {
          const labelEntry = interactiveStack.length > 0 ? interactiveStack.at(-1) : null;
          if (labelEntry && labelEntry.tag === 'label') {
            labelEntry.interactiveChildCount = saved;
          }
        }
      },
    };
  },
};
