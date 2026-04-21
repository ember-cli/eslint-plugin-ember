'use strict';

const { isNativeInteractive } = require('../../../lib/utils/native-interactive-elements');

function makeNode(tag, attrs = {}) {
  return {
    tag,
    attributes: Object.entries(attrs).map(([name, value]) => {
      if (value === true) {
        // boolean-style attribute, no value
        return { name, value: { type: 'GlimmerTextNode', chars: '' } };
      }
      return { name, value: { type: 'GlimmerTextNode', chars: String(value) } };
    }),
  };
}

function getTextAttrValue(node, name) {
  const attr = node.attributes && node.attributes.find((a) => a.name === name);
  if (attr && attr.value && attr.value.type === 'GlimmerTextNode') {
    return attr.value.chars;
  }
  return undefined;
}

describe('isNativeInteractive', () => {
  describe('unconditionally interactive widgets', () => {
    for (const tag of ['button', 'select', 'textarea', 'iframe', 'embed', 'summary', 'details']) {
      it(`<${tag}> is interactive`, () => {
        expect(isNativeInteractive(makeNode(tag), getTextAttrValue)).toBe(true);
      });
    }
  });

  describe('<input>', () => {
    it('is interactive without type attribute', () => {
      expect(isNativeInteractive(makeNode('input'), getTextAttrValue)).toBe(true);
    });

    it('is interactive when type="text"', () => {
      expect(isNativeInteractive(makeNode('input', { type: 'text' }), getTextAttrValue)).toBe(true);
    });

    it('is NOT interactive when type="hidden"', () => {
      expect(isNativeInteractive(makeNode('input', { type: 'hidden' }), getTextAttrValue)).toBe(
        false
      );
    });
  });

  describe('<option> and <datalist>', () => {
    it('<option> is interactive (aria option role)', () => {
      expect(isNativeInteractive(makeNode('option'), getTextAttrValue)).toBe(true);
    });

    it('<datalist> is interactive (aria listbox role)', () => {
      expect(isNativeInteractive(makeNode('datalist'), getTextAttrValue)).toBe(true);
    });
  });

  describe('<a>', () => {
    it('is interactive when href is present', () => {
      expect(isNativeInteractive(makeNode('a', { href: '/about' }), getTextAttrValue)).toBe(true);
    });

    it('is NOT interactive without href', () => {
      expect(isNativeInteractive(makeNode('a'), getTextAttrValue)).toBe(false);
    });
  });

  describe('<area>', () => {
    it('is interactive when href is present', () => {
      expect(isNativeInteractive(makeNode('area', { href: '/map' }), getTextAttrValue)).toBe(true);
    });

    it('is NOT interactive without href', () => {
      expect(isNativeInteractive(makeNode('area'), getTextAttrValue)).toBe(false);
    });
  });

  describe('<audio> / <video>', () => {
    it('<audio controls> is interactive', () => {
      expect(isNativeInteractive(makeNode('audio', { controls: true }), getTextAttrValue)).toBe(
        true
      );
    });

    it('<video controls> is interactive', () => {
      expect(isNativeInteractive(makeNode('video', { controls: true }), getTextAttrValue)).toBe(
        true
      );
    });

    it('<audio> without controls is NOT interactive', () => {
      expect(isNativeInteractive(makeNode('audio'), getTextAttrValue)).toBe(false);
    });

    it('<video> without controls is NOT interactive', () => {
      expect(isNativeInteractive(makeNode('video'), getTextAttrValue)).toBe(false);
    });
  });

  describe('<object>', () => {
    it('is NOT interactive (axobject-query has no entry for <object>)', () => {
      expect(isNativeInteractive(makeNode('object'), getTextAttrValue)).toBe(false);
    });
  });

  describe('<canvas>', () => {
    it('is interactive (axobject CanvasRole widget; no-FP bias)', () => {
      expect(isNativeInteractive(makeNode('canvas'), getTextAttrValue)).toBe(true);
    });
  });

  describe('excluded elements (documented NOT-interactive)', () => {
    it('<label> is NOT interactive (structure role, not widget)', () => {
      expect(isNativeInteractive(makeNode('label'), getTextAttrValue)).toBe(false);
    });

    it('<menuitem> is NOT interactive (deprecated, dropped across browsers)', () => {
      expect(isNativeInteractive(makeNode('menuitem'), getTextAttrValue)).toBe(false);
    });
  });

  describe('non-interactive tags', () => {
    for (const tag of ['div', 'span', 'p', 'section', 'article', 'header', 'footer', 'img']) {
      it(`<${tag}> is not interactive`, () => {
        expect(isNativeInteractive(makeNode(tag), getTextAttrValue)).toBe(false);
      });
    }
  });

  describe('tag normalization', () => {
    it('lowercases tag names before classification', () => {
      expect(isNativeInteractive(makeNode('BUTTON'), getTextAttrValue)).toBe(true);
      expect(isNativeInteractive(makeNode('Input', { type: 'hidden' }), getTextAttrValue)).toBe(
        false
      );
      expect(isNativeInteractive(makeNode('A', { href: '/x' }), getTextAttrValue)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('returns false for missing tag', () => {
      expect(isNativeInteractive({}, getTextAttrValue)).toBe(false);
    });

    it('returns false for non-string tag', () => {
      expect(isNativeInteractive({ tag: null }, getTextAttrValue)).toBe(false);
      expect(isNativeInteractive({ tag: 123 }, getTextAttrValue)).toBe(false);
    });

    it('returns false for empty-string tag', () => {
      expect(isNativeInteractive({ tag: '' }, getTextAttrValue)).toBe(false);
    });

    it('handles nodes without attributes array (a/area without href)', () => {
      expect(isNativeInteractive({ tag: 'a' }, getTextAttrValue)).toBe(false);
      expect(isNativeInteractive({ tag: 'area' }, getTextAttrValue)).toBe(false);
    });

    it('handles nodes without attributes array (audio/video without controls)', () => {
      expect(isNativeInteractive({ tag: 'audio' }, getTextAttrValue)).toBe(false);
      expect(isNativeInteractive({ tag: 'video' }, getTextAttrValue)).toBe(false);
    });
  });
});
