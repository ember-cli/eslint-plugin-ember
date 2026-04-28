'use strict';

const { LANDMARK_ROLES, ALL_LANDMARK_ROLES } = require('../../../lib/utils/landmark-roles');

// The WAI-ARIA 1.2 §5.3.4 landmark roles known at authoring time. Asserting
// set-inclusion (not an exact-equality / size match) keeps the test robust
// to future aria-query updates that add non-abstract landmark roles — the
// derivation (non-abstract + superClass contains 'landmark' + not doc-*)
// is what we actually care about.
const KNOWN_LANDMARK_ROLES = [
  'banner',
  'complementary',
  'contentinfo',
  'form',
  'main',
  'navigation',
  'region',
  'search',
];

describe('ALL_LANDMARK_ROLES', () => {
  it('includes every WAI-ARIA 1.2 §5.3.4 landmark role', () => {
    for (const role of KNOWN_LANDMARK_ROLES) {
      expect(ALL_LANDMARK_ROLES.has(role)).toBe(true);
    }
    // Floor, not ceiling — lets the set grow if aria-query adds new
    // non-abstract landmark roles upstream.
    expect(ALL_LANDMARK_ROLES.size).toBeGreaterThanOrEqual(KNOWN_LANDMARK_ROLES.length);
  });

  it('excludes DPub-ARIA doc-* roles', () => {
    for (const role of ALL_LANDMARK_ROLES) {
      expect(role.startsWith('doc-')).toBe(false);
    }
  });
});

describe('LANDMARK_ROLES (the statically-verifiable subset)', () => {
  it('includes every known landmark role except region', () => {
    for (const role of KNOWN_LANDMARK_ROLES) {
      if (role === 'region') {
        continue;
      }
      expect(LANDMARK_ROLES.has(role)).toBe(true);
    }
    // Floor, not ceiling — mirrors the ALL_LANDMARK_ROLES rationale, minus
    // the deliberate region exclusion.
    expect(LANDMARK_ROLES.size).toBeGreaterThanOrEqual(KNOWN_LANDMARK_ROLES.length - 1);
  });

  it('excludes region (cannot verify accessible-name presence statically)', () => {
    expect(LANDMARK_ROLES.has('region')).toBe(false);
    expect(ALL_LANDMARK_ROLES.has('region')).toBe(true);
  });

  it('excludes non-landmark roles (button, link, article)', () => {
    expect(LANDMARK_ROLES.has('button')).toBe(false);
    expect(LANDMARK_ROLES.has('link')).toBe(false);
    expect(LANDMARK_ROLES.has('article')).toBe(false);
  });
});
