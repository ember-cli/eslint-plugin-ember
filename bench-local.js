'use strict';

const { AXObjectRoles, elementAXObjects } = require('axobject-query');

// Stand-in for the rule's getStaticAttrValue — just reads the attr map directly.
function getStaticAttrValue(node, name) {
  return node.attrs[name];
}

function getTagName(node) {
  return node.tag;
}

// ─────────────────────────────────────────────────────────────────
// Impl A: CURRENT (walk elementAXObjects every call).
// ─────────────────────────────────────────────────────────────────
function isSemanticRoleElement_current(node, role) {
  const tag = getTagName(node);
  if (!tag || typeof role !== 'string') return false;
  const targetRole = role.toLowerCase();

  for (const [concept, axObjectNames] of elementAXObjects) {
    if (concept.name !== tag) continue;
    const conceptAttrs = concept.attributes || [];
    const allMatch = conceptAttrs.every((cAttr) => {
      const nodeVal = getStaticAttrValue(node, cAttr.name);
      if (nodeVal === undefined) return false;
      if (cAttr.value === undefined) return true;
      return nodeVal === String(cAttr.value).toLowerCase();
    });
    if (!allMatch) continue;

    for (const axName of axObjectNames) {
      const axRoles = AXObjectRoles.get(axName);
      if (!axRoles) continue;
      for (const axRole of axRoles) {
        if (axRole.name === targetRole) return true;
      }
    }
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────
// Impl B: PRE-INDEXED (build tag → [{attrs, roles}] map once).
// ─────────────────────────────────────────────────────────────────
const TAG_INDEX = buildTagIndex();

function buildTagIndex() {
  const index = new Map();
  for (const [concept, axObjectNames] of elementAXObjects) {
    // Collect the set of roles the concept can expose.
    const roles = new Set();
    for (const axName of axObjectNames) {
      const axRoles = AXObjectRoles.get(axName);
      if (!axRoles) continue;
      for (const axRole of axRoles) {
        roles.add(axRole.name);
      }
    }
    const entry = {
      attributes: concept.attributes || [],
      roles,
    };
    if (!index.has(concept.name)) {
      index.set(concept.name, []);
    }
    index.get(concept.name).push(entry);
  }
  return index;
}

function isSemanticRoleElement_indexed(node, role) {
  const tag = getTagName(node);
  if (!tag || typeof role !== 'string') return false;
  const entries = TAG_INDEX.get(tag);
  if (!entries) return false;
  const targetRole = role.toLowerCase();

  for (const { attributes, roles } of entries) {
    if (!roles.has(targetRole)) continue;
    const allMatch = attributes.every((cAttr) => {
      const nodeVal = getStaticAttrValue(node, cAttr.name);
      if (nodeVal === undefined) return false;
      if (cAttr.value === undefined) return true;
      return nodeVal === String(cAttr.value).toLowerCase();
    });
    if (allMatch) return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────
// Sanity-check: both impls produce identical results across a
// realistic set of (tag, attrs, role) triples.
// ─────────────────────────────────────────────────────────────────
const TEST_NODES = [
  { tag: 'input', attrs: { type: 'checkbox' } },
  { tag: 'input', attrs: { type: 'radio' } },
  { tag: 'input', attrs: { type: 'text' } },
  { tag: 'input', attrs: { type: 'submit' } },
  { tag: 'input', attrs: { type: 'search' } },
  { tag: 'button', attrs: {} },
  { tag: 'a', attrs: { href: '/x' } },
  { tag: 'a', attrs: {} },
  { tag: 'select', attrs: {} },
  { tag: 'textarea', attrs: {} },
  { tag: 'div', attrs: {} },
  { tag: 'h1', attrs: {} },
  { tag: 'img', attrs: { alt: 'x' } },
  { tag: 'nav', attrs: {} },
];
const TEST_ROLES = [
  'button',
  'checkbox',
  'switch',
  'radio',
  'link',
  'heading',
  'textbox',
  'searchbox',
  'img',
  'navigation',
];

let mismatches = 0;
for (const node of TEST_NODES) {
  for (const role of TEST_ROLES) {
    const a = isSemanticRoleElement_current(node, role);
    const b = isSemanticRoleElement_indexed(node, role);
    if (a !== b) {
      mismatches++;
      console.log(`MISMATCH: tag=${node.tag} attrs=${JSON.stringify(node.attrs)} role=${role} current=${a} indexed=${b}`);
    }
  }
}
console.log(`Parity check: ${mismatches === 0 ? 'OK' : 'FAIL'} (${TEST_NODES.length * TEST_ROLES.length} combos)`);

// ─────────────────────────────────────────────────────────────────
// Benchmark: realistic call volume for a large template.
// Scenario: a template with ~200 elements carrying roles (generous
// upper bound — most real files have far fewer), rule runs the full
// file. Each visit calls isSemanticRoleElement once.
// ─────────────────────────────────────────────────────────────────
const CALL_VOLUME = 200; // elements with roles per lint run
const ITERATIONS = 1000; // how many times we re-run the full-file scan
                          // (simulating `eslint .` over a medium project
                          // where this rule fires hundreds of times per
                          // file × many files — 200k calls total).

function buildCallList() {
  const calls = [];
  for (let i = 0; i < CALL_VOLUME; i++) {
    const node = TEST_NODES[i % TEST_NODES.length];
    const role = TEST_ROLES[i % TEST_ROLES.length];
    calls.push({ node, role });
  }
  return calls;
}

const calls = buildCallList();

// Warmup
for (const { node, role } of calls) {
  isSemanticRoleElement_current(node, role);
  isSemanticRoleElement_indexed(node, role);
}

// Time current impl
const t1 = process.hrtime.bigint();
for (let i = 0; i < ITERATIONS; i++) {
  for (const { node, role } of calls) {
    isSemanticRoleElement_current(node, role);
  }
}
const t2 = process.hrtime.bigint();
const currentMs = Number(t2 - t1) / 1e6;

// Time indexed impl
const t3 = process.hrtime.bigint();
for (let i = 0; i < ITERATIONS; i++) {
  for (const { node, role } of calls) {
    isSemanticRoleElement_indexed(node, role);
  }
}
const t4 = process.hrtime.bigint();
const indexedMs = Number(t4 - t3) / 1e6;

const totalCalls = ITERATIONS * CALL_VOLUME;
console.log(`Total calls: ${totalCalls.toLocaleString()}`);
console.log(`Current:     ${currentMs.toFixed(1)} ms  (${(currentMs * 1000 / totalCalls).toFixed(2)} µs/call)`);
console.log(`Indexed:     ${indexedMs.toFixed(1)} ms  (${(indexedMs * 1000 / totalCalls).toFixed(2)} µs/call)`);
console.log(`Speedup:     ${(currentMs / indexedMs).toFixed(1)}x`);
console.log(`Diff:        ${(currentMs - indexedMs).toFixed(1)} ms saved over ${totalCalls.toLocaleString()} calls`);
