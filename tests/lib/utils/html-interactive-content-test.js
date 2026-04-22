'use strict';

const { isHtmlInteractiveContent } = require('../../../lib/utils/html-interactive-content');

function makeNode(tag, attrs = {}) {
  return {
    tag,
    attributes: Object.entries(attrs).map(([name, value]) => {
      if (value === true) {
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

describe('isHtmlInteractiveContent', () => {
  describe('§3.2.5.2.7 unconditional interactive content', () => {
    for (const tag of ['button', 'details', 'embed', 'iframe', 'label', 'select', 'textarea']) {
      it(`<${tag}> is interactive`, () => {
        expect(isHtmlInteractiveContent(makeNode(tag), getTextAttrValue)).toBe(true);
      });
    }
  });

  describe('<summary> (§4.11.2 — keyboard-activatable)', () => {
    it('<summary> is interactive', () => {
      expect(isHtmlInteractiveContent(makeNode('summary'), getTextAttrValue)).toBe(true);
    });
  });

  describe('<input>', () => {
    it('is interactive without type attribute (defaults to text)', () => {
      expect(isHtmlInteractiveContent(makeNode('input'), getTextAttrValue)).toBe(true);
    });

    it('is interactive when type="text"', () => {
      expect(isHtmlInteractiveContent(makeNode('input', { type: 'text' }), getTextAttrValue)).toBe(
        true
      );
    });

    it('is NOT interactive when type="hidden"', () => {
      expect(
        isHtmlInteractiveContent(makeNode('input', { type: 'hidden' }), getTextAttrValue)
      ).toBe(false);
    });

    it('is NOT interactive when type="HIDDEN" (case-insensitive)', () => {
      expect(
        isHtmlInteractiveContent(makeNode('input', { type: 'HIDDEN' }), getTextAttrValue)
      ).toBe(false);
    });

    it('is NOT interactive when type=" hidden " (whitespace-trimmed)', () => {
      expect(
        isHtmlInteractiveContent(makeNode('input', { type: ' hidden ' }), getTextAttrValue)
      ).toBe(false);
    });
  });

  describe('<a>', () => {
    it('is interactive when href is present', () => {
      expect(isHtmlInteractiveContent(makeNode('a', { href: '/about' }), getTextAttrValue)).toBe(
        true
      );
    });

    it('is NOT interactive without href', () => {
      expect(isHtmlInteractiveContent(makeNode('a'), getTextAttrValue)).toBe(false);
    });
  });

  describe('<img>', () => {
    it('is interactive when usemap is present', () => {
      expect(isHtmlInteractiveContent(makeNode('img', { usemap: '#m' }), getTextAttrValue)).toBe(
        true
      );
    });

    it('is NOT interactive without usemap', () => {
      expect(isHtmlInteractiveContent(makeNode('img'), getTextAttrValue)).toBe(false);
    });
  });

  describe('<audio> / <video>', () => {
    it('<audio controls> is interactive', () => {
      expect(
        isHtmlInteractiveContent(makeNode('audio', { controls: true }), getTextAttrValue)
      ).toBe(true);
    });

    it('<video controls> is interactive', () => {
      expect(
        isHtmlInteractiveContent(makeNode('video', { controls: true }), getTextAttrValue)
      ).toBe(true);
    });

    it('<audio> without controls is NOT interactive', () => {
      expect(isHtmlInteractiveContent(makeNode('audio'), getTextAttrValue)).toBe(false);
    });

    it('<video> without controls is NOT interactive', () => {
      expect(isHtmlInteractiveContent(makeNode('video'), getTextAttrValue)).toBe(false);
    });
  });

  describe('elements NOT in §3.2.5.2.7', () => {
    // <object> is notably absent from §3.2.5.2.7 — rules that want to flag
    // <object usemap> nesting (e.g. for upstream ember-template-lint parity)
    // must do so as a rule-level special case, not via this util.
    it('<object> is NOT interactive (not in §3.2.5.2.7, even with usemap)', () => {
      expect(isHtmlInteractiveContent(makeNode('object'), getTextAttrValue)).toBe(false);
      expect(isHtmlInteractiveContent(makeNode('object', { usemap: '#m' }), getTextAttrValue)).toBe(
        false
      );
    });

    // <area> is not in §3.2.5.2.7 either — rules caring about area[href]
    // should check via the ARIA widget-role authority (area[href] has
    // implicit role=link per HTML-AAM).
    it('<area> is NOT interactive (not in §3.2.5.2.7)', () => {
      expect(isHtmlInteractiveContent(makeNode('area', { href: '/map' }), getTextAttrValue)).toBe(
        false
      );
    });

    // <canvas>, <option>, <datalist> — ARIA widgets per axobject-query, but
    // not HTML interactive content. Rules wanting these should consult the
    // ARIA widget-role authority, not this util.
    for (const tag of ['canvas', 'option', 'datalist']) {
      it(`<${tag}> is NOT interactive per HTML §3.2.5.2.7`, () => {
        expect(isHtmlInteractiveContent(makeNode(tag), getTextAttrValue)).toBe(false);
      });
    }

    // Deprecated HTML elements.
    for (const tag of ['menuitem', 'keygen']) {
      it(`<${tag}> is NOT interactive (deprecated)`, () => {
        expect(isHtmlInteractiveContent(makeNode(tag), getTextAttrValue)).toBe(false);
      });
    }
  });

  describe('non-interactive tags', () => {
    for (const tag of ['div', 'span', 'p', 'section', 'article', 'header', 'footer', 'img']) {
      it(`<${tag}> is not interactive (no relevant attribute)`, () => {
        expect(isHtmlInteractiveContent(makeNode(tag), getTextAttrValue)).toBe(false);
      });
    }
  });

  describe('tag normalization', () => {
    it('lowercases tag names before classification', () => {
      expect(isHtmlInteractiveContent(makeNode('BUTTON'), getTextAttrValue)).toBe(true);
      expect(
        isHtmlInteractiveContent(makeNode('Input', { type: 'hidden' }), getTextAttrValue)
      ).toBe(false);
      expect(isHtmlInteractiveContent(makeNode('A', { href: '/x' }), getTextAttrValue)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('returns false for missing tag', () => {
      expect(isHtmlInteractiveContent({}, getTextAttrValue)).toBe(false);
    });

    it('returns false for non-string tag', () => {
      expect(isHtmlInteractiveContent({ tag: null }, getTextAttrValue)).toBe(false);
      expect(isHtmlInteractiveContent({ tag: 123 }, getTextAttrValue)).toBe(false);
    });

    it('returns false for empty-string tag', () => {
      expect(isHtmlInteractiveContent({ tag: '' }, getTextAttrValue)).toBe(false);
    });

    it('handles nodes without attributes array (a without href)', () => {
      expect(isHtmlInteractiveContent({ tag: 'a' }, getTextAttrValue)).toBe(false);
    });

    it('handles nodes without attributes array (audio/video without controls)', () => {
      expect(isHtmlInteractiveContent({ tag: 'audio' }, getTextAttrValue)).toBe(false);
      expect(isHtmlInteractiveContent({ tag: 'video' }, getTextAttrValue)).toBe(false);
    });

    it('handles nodes without attributes array (img without usemap)', () => {
      expect(isHtmlInteractiveContent({ tag: 'img' }, getTextAttrValue)).toBe(false);
    });
  });
});
