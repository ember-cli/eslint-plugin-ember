'use strict';

/**
 * Control-flow helpers for rules that care whether two template elements can
 * actually co-exist at runtime. The Handlebars/Glimmer constructs that
 * introduce mutual exclusion between `program` and `inverse` branches are:
 *   - `{{#if}}` / `{{#unless}}` — condition-based.
 *   - `{{#each}}` / `{{#each-in}}` with `{{else}}` — program renders N>=1
 *     iterations, inverse renders when the collection is empty. Exactly
 *     one of the two branches executes. Exposed via
 *     `BRANCHING_BLOCK_NAMES` / `isBranchingBlockStatement(node)`.
 *
 * Helpers that do NOT introduce mutual exclusion:
 *   - `{{#each}}` / `{{#each-in}}` WITHOUT `{{else}}` — body renders 0..N
 *     times, but multiple static children in the body are rendered N times
 *     each and still duplicate at runtime.
 *   - `{{#let}}` / `{{#with}}` are pure scope-binding: body renders
 *     unconditionally.
 *
 * Two APIs live in this module:
 *
 *   1. Path primitives — `getBranchPath(node)` + `areMutuallyExclusive(a, b)`.
 *      Compute once per element, pairwise-compare with arbitrary predicates.
 *      Fit for rules that need per-entry metadata (e.g. checkbox-vs-submit
 *      name-sharing in `template-no-duplicate-form-names`).
 *
 *   2. Stack wrapper — `createConditionalScope()`. Enter/exit hooks driven
 *      by the ESLint visitor. Fit for simple "have I seen this key already
 *      in any visible scope?" rules (e.g. `template-no-duplicate-id`).
 *
 * Both APIs agree on the same mutual-exclusion semantics.
 */

// Names of Glimmer block helpers that create mutually-exclusive branches
// between `program` and `inverse`:
//   - `if` / `unless`: condition-based exclusion.
//   - `each` / `each-in` with `{{else}}`: program renders N>=1 iterations,
//     inverse renders when the collection is empty. They never both render.
//
// `let` and `with` are NOT in this set — they are pure block-param binding
// with no semantic inverse branch; any `{{else}}` alongside them wouldn't
// carry mutual-exclusion semantics.
const BRANCHING_BLOCK_NAMES = new Set(['if', 'unless', 'each', 'each-in']);

function isBranchingBlockStatement(node) {
  if (!node || node.type !== 'GlimmerBlockStatement') {
    return false;
  }
  if (!node.path || node.path.type !== 'GlimmerPathExpression') {
    return false;
  }
  const name = node.path.original;
  if (!BRANCHING_BLOCK_NAMES.has(name)) {
    return false;
  }
  // `each` / `each-in` only introduce an exclusive inverse when `{{else}}`
  // is actually present. Without it, the body is the sole render path.
  if ((name === 'each' || name === 'each-in') && !node.inverse) {
    return false;
  }
  return true;
}

// Legacy alias kept for readability in call sites that only care about
// if/unless. Semantically equivalent to `isBranchingBlockStatement` for those
// two names.
function isIfOrUnlessBlockStatement(node) {
  if (!isBranchingBlockStatement(node)) {
    return false;
  }
  return node.path.original === 'if' || node.path.original === 'unless';
}

// Returns true when `node` is the `program` or `inverse` body Block of an
// enclosing branching block — i.e. a mutually-exclusive branch body.
function isConditionalBlockBranch(node) {
  if (!node || node.type !== 'GlimmerBlock') {
    return false;
  }
  const parent = node.parent;
  if (!isBranchingBlockStatement(parent)) {
    return false;
  }
  return parent.program === node || parent.inverse === node;
}

// Legacy alias.
const isIfOrUnlessBlockBranch = isConditionalBlockBranch;

/**
 * Compute the branching-block path from the root down to `node`. Each entry
 * records the enclosing BlockStatement and which branch (`program` /
 * `inverse`) the traversal passes through. Used to test whether two elements
 * live in mutually-exclusive branches.
 *
 * "Branching block" covers any BlockStatement whose `program` and `inverse`
 * subtrees are mutually exclusive at runtime — `{{#if}}`, `{{#unless}}`, and
 * `{{#each}}…{{else}}` all qualify (the `else` branch of `{{#each}}` renders
 * only when the collection is empty).
 *
 * Returns `[]` for elements not inside any branching block.
 *
 * @param {object} node - AST node with `.parent` back-references (set by
 *   ember-eslint-parser during traversal).
 * @returns {Array<{ block: object, branch: 'program' | 'inverse' }>}
 */
function getBranchPath(node) {
  const path = [];
  let current = node;
  while (current && current.parent) {
    const parent = current.parent;
    const grand = parent.parent;
    if (grand && isBranchingBlockStatement(grand)) {
      if (grand.program === parent) {
        path.unshift({ block: grand, branch: 'program' });
      } else if (grand.inverse === parent) {
        path.unshift({ block: grand, branch: 'inverse' });
      }
    }
    current = parent;
  }
  return path;
}

/**
 * Two paths are mutually exclusive if they share an ancestor branching block
 * but diverge on its `program` vs `inverse` branch. Elements with mutually-
 * exclusive paths never both render at runtime.
 *
 * @returns {boolean}
 */
function areMutuallyExclusive(pathA, pathB) {
  const minLen = Math.min(pathA.length, pathB.length);
  for (let i = 0; i < minLen; i++) {
    const a = pathA[i];
    const b = pathB[i];
    if (a.block !== b.block) {
      // Paths diverge into different ancestor blocks — no shared
      // mutual-exclusion pivot remains.
      return false;
    }
    if (a.branch !== b.branch) {
      return true;
    }
  }
  // One path is a prefix of the other (or equal) — both can render together.
  return false;
}

/**
 * Visitor-hook-driven scope for rules that ask "have I seen this key in any
 * visible scope?". Traversal wires:
 *
 *   'GlimmerBlockStatement': (node) => {
 *     if (isBranchingBlockStatement(node)) scope.enterConditional();
 *   },
 *   'GlimmerBlockStatement:exit': (node) => {
 *     if (isBranchingBlockStatement(node)) scope.exitConditional();
 *   },
 *   'GlimmerBlock': (node) => {
 *     if (isConditionalBlockBranch(node)) scope.enterConditionalBranch();
 *   },
 *   'GlimmerBlock:exit': (node) => {
 *     if (isConditionalBlockBranch(node)) scope.exitConditionalBranch();
 *   },
 *
 * Two-stack design matches upstream ember-template-lint's ConditionalScope
 * (from PR #1606): `seenStack` holds nested branch-body Sets so exiting a
 * branch forgets what it saw; `conditionalStack` accumulates everything any
 * branch saw, then promotes those keys to "always visible at this level"
 * when the whole conditional ends.
 */
function createConditionalScope() {
  const seenStack = [new Set()];
  const conditionalStack = [];

  return {
    enterConditional() {
      conditionalStack.push(new Set());
    },
    exitConditional() {
      const keys = conditionalStack.pop();
      if (conditionalStack.length > 0) {
        for (const key of keys) {
          conditionalStack.at(-1).add(key);
        }
      } else {
        // Top-level conditional ended — its accumulated keys are now
        // unconditionally "seen" at this scope. Push as a separate frame
        // (rather than merging into seenStack[0]) to mirror upstream
        // ember-template-lint's ConditionalScope (PR #1606) and keep
        // per-conditional grouping for future debugging hooks. Functionally
        // equivalent to a single merged Set for `has()` purposes; growth is
        // O(top-level conditionals per template), which is bounded by source
        // size.
        seenStack.push(keys);
      }
    },
    enterConditionalBranch() {
      seenStack.push(new Set());
    },
    exitConditionalBranch() {
      seenStack.pop();
    },
    has(key) {
      for (const seen of seenStack) {
        if (seen.has(key)) {
          return true;
        }
      }
      return false;
    },
    add(key) {
      seenStack.at(-1).add(key);
      if (conditionalStack.length > 0) {
        conditionalStack.at(-1).add(key);
      }
    },
  };
}

module.exports = {
  isBranchingBlockStatement,
  isConditionalBlockBranch,
  isIfOrUnlessBlockStatement,
  isIfOrUnlessBlockBranch,
  getBranchPath,
  areMutuallyExclusive,
  createConditionalScope,
};
