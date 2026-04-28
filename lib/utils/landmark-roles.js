'use strict';

const { roles } = require('aria-query');

// Non-abstract landmark roles derived from aria-query's role taxonomy: any
// role whose superClass chain includes 'landmark', minus DPub-ARIA `doc-*`
// (which share that superClass but are outside this plugin's rules' scope —
// downstream callers can extend if needed). The exact size is intentionally
// not hard-coded: the derivation is what matters, so if aria-query adds a
// new non-abstract landmark upstream it will be picked up automatically.
const ALL_LANDMARK_ROLES = buildLandmarkRoleSet();

// The subset that's safe for static-linting rules to treat as landmarks
// without further verification. `region` is EXCLUDED because a static linter
// cannot determine at lint time whether the element has an accessible name
// (via aria-label / aria-labelledby / title), which is required for the
// `region` role to actually apply to a `<section>` per HTML-AAM.
//
// See PR #2694 for the full rationale and spec citation
// (https://www.w3.org/TR/html-aam-1.0/#el-section):
// `<section>` without an accessible name has role `generic`, not `region`.
//
// Most a11y rules that enumerate landmarks should use this subset.
// Rules that DO verify accessible names (e.g. template-no-duplicate-
// landmark-elements, which inspects aria-label / aria-labelledby before
// classifying a node as a landmark) should import ALL_LANDMARK_ROLES.
const LANDMARK_ROLES = new Set([...ALL_LANDMARK_ROLES].filter((role) => role !== 'region'));

function buildLandmarkRoleSet() {
  const result = new Set();
  for (const [role, def] of roles) {
    if (def.abstract) {
      continue;
    }
    if (role.startsWith('doc-')) {
      continue;
    }
    const descendsFromLandmark = (def.superClass || []).some((chain) => chain.includes('landmark'));
    if (descendsFromLandmark) {
      result.add(role);
    }
  }
  return result;
}

module.exports = { LANDMARK_ROLES, ALL_LANDMARK_ROLES };
