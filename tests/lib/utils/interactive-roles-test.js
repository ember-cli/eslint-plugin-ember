'use strict';

const {
  INTERACTIVE_ROLES,
  COMPOSITE_WIDGET_CHILDREN,
} = require('../../../lib/utils/interactive-roles');

describe('INTERACTIVE_ROLES', () => {
  describe('canonical widget roles (ARIA 1.2 widget taxonomy)', () => {
    for (const role of [
      'button',
      'checkbox',
      'combobox',
      'link',
      'menuitem',
      'menuitemcheckbox',
      'menuitemradio',
      'option',
      'radio',
      'scrollbar',
      'searchbox',
      'slider',
      'spinbutton',
      'switch',
      'tab',
      'textbox',
      'treeitem',
    ]) {
      it(`includes "${role}"`, () => {
        expect(INTERACTIVE_ROLES.has(role)).toBe(true);
      });
    }
  });

  describe('composite widget containers (widget-descended per aria-query)', () => {
    for (const role of ['listbox', 'menu', 'menubar', 'grid', 'tablist', 'tree', 'treegrid']) {
      it(`includes "${role}"`, () => {
        expect(INTERACTIVE_ROLES.has(role)).toBe(true);
      });
    }
  });

  describe('manual override', () => {
    it('includes "toolbar" (not widget-descended per aria-query; added per APG convention)', () => {
      expect(INTERACTIVE_ROLES.has('toolbar')).toBe(true);
    });
  });

  describe('manual exclusion', () => {
    it('does NOT include "tooltip" (structure role per WAI-ARIA 1.2 §5.3.3)', () => {
      expect(INTERACTIVE_ROLES.has('tooltip')).toBe(false);
    });
  });

  describe('contested inclusions (documented divergences from peers)', () => {
    it('includes "progressbar" (widget-descended per aria-query; diverges from lit-a11y which excludes it as readonly-valued)', () => {
      expect(INTERACTIVE_ROLES.has('progressbar')).toBe(true);
    });
  });

  describe('non-widget roles excluded', () => {
    // Spot-check a handful of roles that should NOT be in the interactive set
    // because they're abstract, structural, or landmark-typed.
    for (const role of [
      'article', // document-structure
      'banner', // landmark
      'main', // landmark
      'navigation', // landmark
      'region', // landmark
      'complementary', // landmark
      'contentinfo', // landmark
      'form', // landmark
      'search', // landmark (role, not element)
      'heading', // document-structure
      'img', // document-structure
      'list', // document-structure
      'listitem', // document-structure
      'paragraph', // document-structure
      'separator', // document-structure (context-dependent; aria-query taxonomy says structure)
      'presentation', // role
      'none', // role
      'widget', // abstract — excluded by filter
      'structure', // abstract — excluded by filter
      'window', // abstract — excluded by filter
    ]) {
      it(`does NOT include "${role}"`, () => {
        expect(INTERACTIVE_ROLES.has(role)).toBe(false);
      });
    }
  });

  describe('set size (drift detection)', () => {
    // Pins the current set size to surface aria-query's taxonomy changes as
    // visible diffs rather than silent shifts. Update this number (with a
    // commit message naming which role was added/removed) when aria-query
    // is bumped.
    it('has 35 roles', () => {
      expect(INTERACTIVE_ROLES.size).toBe(35);
    });
  });
});

describe('COMPOSITE_WIDGET_CHILDREN', () => {
  it('is a Map', () => {
    expect(COMPOSITE_WIDGET_CHILDREN).toBeInstanceOf(Map);
  });

  it('maps "listbox" to include "option"', () => {
    expect(COMPOSITE_WIDGET_CHILDREN.get('listbox')?.has('option')).toBe(true);
  });

  it('maps "tablist" to include "tab"', () => {
    expect(COMPOSITE_WIDGET_CHILDREN.get('tablist')?.has('tab')).toBe(true);
  });

  it('maps "tree" to include "treeitem"', () => {
    expect(COMPOSITE_WIDGET_CHILDREN.get('tree')?.has('treeitem')).toBe(true);
  });

  it('maps "grid" to include "row" and transitively "gridcell"', () => {
    const gridChildren = COMPOSITE_WIDGET_CHILDREN.get('grid');
    expect(gridChildren?.has('row')).toBe(true);
    expect(gridChildren?.has('gridcell')).toBe(true);
  });

  it('maps "treegrid" to include both grid-row and tree-treeitem (superClass inheritance)', () => {
    const treeGridChildren = COMPOSITE_WIDGET_CHILDREN.get('treegrid');
    expect(treeGridChildren?.has('row')).toBe(true);
    expect(treeGridChildren?.has('treeitem')).toBe(true);
  });

  it('maps "radiogroup" to include "radio"', () => {
    expect(COMPOSITE_WIDGET_CHILDREN.get('radiogroup')?.has('radio')).toBe(true);
  });
});
