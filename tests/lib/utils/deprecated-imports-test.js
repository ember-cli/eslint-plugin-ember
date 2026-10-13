'use strict';

const { DEPRECATED_IMPORTS, getReportVersion } = require('../../../lib/utils/deprecated-imports');

const VERSION = /^\d+\.\d+\.\d+$/;
const STATUSES = ['released', 'merged', 'pr', 'draft'];

describe('deprecated-imports', () => {
  it.each(DEPRECATED_IMPORTS.map((d) => [`${d.id} (${d.source})`, d]))(
    '%s is well formed',
    (_, d) => {
      expect(d.source).toEqual(expect.any(String));
      expect(d.exports === null || (Array.isArray(d.exports) && d.exports.length > 0)).toBe(true);
      expect(d.id).toEqual(expect.any(String));
      expect(d.since.available).toMatch(VERSION);
      if (d.since.enabled) {
        expect(d.since.enabled).toMatch(VERSION);
      }
      expect(d.until).toMatch(VERSION);
      expect(d.replacement).toMatch(/\.$/);
      expect(d.url).toMatch(/^https:\/\//);
      expect(STATUSES).toContain(d.status);
    }
  );

  it('does not list the same export twice for one import path', () => {
    const seen = new Set();
    for (const d of DEPRECATED_IMPORTS) {
      for (const name of d.exports || ['*']) {
        const key = `${d.source}#${name}`;
        expect(seen.has(key), key).toBe(false);
        seen.add(key);
      }
    }
  });

  it('prefers the enabled version over the available version', () => {
    expect(getReportVersion({ since: { available: '5.10.0', enabled: '6.5.0' } })).toBe('6.5.0');
    expect(getReportVersion({ since: { available: '7.4.0' } })).toBe('7.4.0');
  });
});
