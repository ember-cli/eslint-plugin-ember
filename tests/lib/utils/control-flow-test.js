'use strict';

// The AST builders below intentionally wire `.parent` back-pointers onto the
// passed-in child nodes to match ember-eslint-parser's shape — mutation is
// the point, not a bug. Per-line disables rather than a file-level pair to
// match the codebase's idiom (eslint-comments/disable-enable-pair is on).

const {
  getBranchPath,
  areMutuallyExclusive,
  createConditionalScope,
  isBranchingBlockStatement,
  isIfOrUnlessBlockStatement,
  isIfOrUnlessBlockBranch,
} = require('../../../lib/utils/control-flow');

// Tiny AST node builders — use plain objects with the same shape the Glimmer
// parser produces. Each helper wires `.parent` back-references to match
// ember-eslint-parser's behavior.
function makeElement(tag) {
  return { type: 'GlimmerElementNode', tag, parent: null };
}

function makeBlock(body) {
  const node = { type: 'GlimmerBlock', body, parent: null };
  for (const child of body) {
    child.parent = node;
  }
  return node;
}

function makeIf(program, inverse = null) {
  const node = {
    type: 'GlimmerBlockStatement',
    path: { type: 'GlimmerPathExpression', original: 'if' },
    program,
    inverse,
    parent: null,
  };
  // eslint-disable-next-line no-param-reassign
  program.parent = node;
  if (inverse) {
    // eslint-disable-next-line no-param-reassign
    inverse.parent = node;
  }
  return node;
}

function makeUnless(program, inverse = null) {
  const node = makeIf(program, inverse);
  node.path.original = 'unless';
  return node;
}

function makeEach(program, inverse = null) {
  const node = {
    type: 'GlimmerBlockStatement',
    path: { type: 'GlimmerPathExpression', original: 'each' },
    program,
    inverse,
    parent: null,
  };
  // eslint-disable-next-line no-param-reassign
  program.parent = node;
  if (inverse) {
    // eslint-disable-next-line no-param-reassign
    inverse.parent = node;
  }
  return node;
}

function makeLet(program) {
  const node = {
    type: 'GlimmerBlockStatement',
    path: { type: 'GlimmerPathExpression', original: 'let' },
    program,
    inverse: null,
    parent: null,
  };
  // eslint-disable-next-line no-param-reassign
  program.parent = node;
  return node;
}

describe('isIfOrUnlessBlockStatement', () => {
  it('recognizes {{#if}}', () => {
    expect(isIfOrUnlessBlockStatement(makeIf(makeBlock([])))).toBe(true);
  });
  it('recognizes {{#unless}}', () => {
    expect(isIfOrUnlessBlockStatement(makeUnless(makeBlock([])))).toBe(true);
  });
  it('rejects {{#each}}', () => {
    expect(isIfOrUnlessBlockStatement(makeEach(makeBlock([])))).toBe(false);
  });
  it('rejects non-block nodes', () => {
    expect(isIfOrUnlessBlockStatement(makeElement('div'))).toBe(false);
    expect(isIfOrUnlessBlockStatement(null)).toBe(false);
  });
});

describe('isBranchingBlockStatement', () => {
  it('recognizes {{#if}}', () => {
    expect(isBranchingBlockStatement(makeIf(makeBlock([])))).toBe(true);
  });
  it('recognizes {{#each}}{{else}}{{/each}} (has inverse)', () => {
    expect(isBranchingBlockStatement(makeEach(makeBlock([]), makeBlock([])))).toBe(true);
  });
  it('rejects {{#each}}{{/each}} without inverse (no mutual-exclusion branch)', () => {
    expect(isBranchingBlockStatement(makeEach(makeBlock([])))).toBe(false);
  });
  it('rejects {{#let}} (pure scoping, no exclusive inverse)', () => {
    expect(isBranchingBlockStatement(makeLet(makeBlock([])))).toBe(false);
  });
});

describe('isIfOrUnlessBlockBranch', () => {
  it('recognizes program branch of an if', () => {
    const program = makeBlock([]);
    makeIf(program);
    expect(isIfOrUnlessBlockBranch(program)).toBe(true);
  });
  it('recognizes inverse branch of an if', () => {
    const inverse = makeBlock([]);
    makeIf(makeBlock([]), inverse);
    expect(isIfOrUnlessBlockBranch(inverse)).toBe(true);
  });
  it('rejects body of an each', () => {
    const body = makeBlock([]);
    makeEach(body);
    expect(isIfOrUnlessBlockBranch(body)).toBe(false);
  });
  it('rejects unrooted Block', () => {
    expect(isIfOrUnlessBlockBranch(makeBlock([]))).toBe(false);
  });
});

describe('getBranchPath', () => {
  it('returns [] for an element outside any if/unless', () => {
    const el = makeElement('div');
    expect(getBranchPath(el)).toEqual([]);
  });

  it('records program branch of an if', () => {
    // {{#if}}<div/>{{/if}}
    const el = makeElement('div');
    const program = makeBlock([el]);
    const ifBlock = makeIf(program);
    const path = getBranchPath(el);
    expect(path).toHaveLength(1);
    expect(path[0]).toEqual({ block: ifBlock, branch: 'program' });
  });

  it('records inverse branch of an if', () => {
    // {{#if}}{{else}}<div/>{{/if}}
    const el = makeElement('div');
    const inverse = makeBlock([el]);
    const ifBlock = makeIf(makeBlock([]), inverse);
    const path = getBranchPath(el);
    expect(path).toHaveLength(1);
    expect(path[0].branch).toBe('inverse');
    expect(path[0].block).toBe(ifBlock);
  });

  it('does NOT add entries for #each bodies WITHOUT {{else}} (no exclusion)', () => {
    const el = makeElement('div');
    const body = makeBlock([el]);
    makeEach(body);
    expect(getBranchPath(el)).toEqual([]);
  });

  it('records #each bodies WITH {{else}} (inverse creates exclusion)', () => {
    // {{#each}}<a/>{{else}}<b/>{{/each}}
    const a = makeElement('a');
    const b = makeElement('b');
    const eachBlock = makeEach(makeBlock([a]), makeBlock([b]));
    expect(getBranchPath(a)).toEqual([{ block: eachBlock, branch: 'program' }]);
    expect(getBranchPath(b)).toEqual([{ block: eachBlock, branch: 'inverse' }]);
    expect(areMutuallyExclusive(getBranchPath(a), getBranchPath(b))).toBe(true);
  });

  it('does NOT add entries for #let bodies (pure scoping)', () => {
    const el = makeElement('div');
    const body = makeBlock([el]);
    makeLet(body);
    expect(getBranchPath(el)).toEqual([]);
  });

  it('records nested if/unless ancestors outermost-first', () => {
    // {{#if outer}}{{#unless inner}}<div/>{{/unless}}{{/if}}
    const el = makeElement('div');
    const innerProgram = makeBlock([el]);
    const innerUnless = makeUnless(innerProgram);
    const outerProgram = makeBlock([innerUnless]);
    const outerIf = makeIf(outerProgram);
    const path = getBranchPath(el);
    expect(path).toHaveLength(2);
    expect(path[0].block).toBe(outerIf);
    expect(path[0].branch).toBe('program');
    expect(path[1].block).toBe(innerUnless);
    expect(path[1].branch).toBe('program');
  });
});

describe('areMutuallyExclusive', () => {
  it('returns false for empty paths', () => {
    expect(areMutuallyExclusive([], [])).toBe(false);
  });
  it("returns false when one path is empty and the other isn't", () => {
    // {{#if}}<a/>{{/if}}<b/> — both render when if is true.
    const a = makeElement('a');
    const aProgram = makeBlock([a]);
    makeIf(aProgram);
    expect(areMutuallyExclusive(getBranchPath(a), [])).toBe(false);
  });
  it('detects program-vs-inverse of the same if as exclusive', () => {
    // {{#if}}<a/>{{else}}<b/>{{/if}}
    const a = makeElement('a');
    const b = makeElement('b');
    const ifBlock = makeIf(makeBlock([a]), makeBlock([b]));
    expect(ifBlock).toBeTruthy();
    expect(areMutuallyExclusive(getBranchPath(a), getBranchPath(b))).toBe(true);
  });
  it('returns false when both elements are in the same branch', () => {
    const a = makeElement('a');
    const b = makeElement('b');
    makeIf(makeBlock([a, b]));
    expect(areMutuallyExclusive(getBranchPath(a), getBranchPath(b))).toBe(false);
  });
  it('returns false when two ifs are siblings (different blocks)', () => {
    // {{#if a}}<x/>{{/if}}{{#if b}}<y/>{{/if}}
    const x = makeElement('x');
    const y = makeElement('y');
    makeIf(makeBlock([x]));
    makeIf(makeBlock([y]));
    expect(areMutuallyExclusive(getBranchPath(x), getBranchPath(y))).toBe(false);
  });
  it('handles nested conditionals: exclusive when any shared ancestor differs', () => {
    // {{#if outer}}{{#if inner}}<a/>{{/if}}{{else}}<b/>{{/if}}
    // a is in outer.program, inner.program. b is in outer.inverse.
    // They diverge at outer → mutually exclusive.
    const a = makeElement('a');
    const b = makeElement('b');
    const inner = makeIf(makeBlock([a]));
    makeIf(makeBlock([inner]), makeBlock([b]));
    expect(areMutuallyExclusive(getBranchPath(a), getBranchPath(b))).toBe(true);
  });
  it('is symmetric', () => {
    const a = makeElement('a');
    const b = makeElement('b');
    makeIf(makeBlock([a]), makeBlock([b]));
    const pa = getBranchPath(a);
    const pb = getBranchPath(b);
    expect(areMutuallyExclusive(pa, pb)).toBe(areMutuallyExclusive(pb, pa));
  });
});

describe('createConditionalScope', () => {
  it('tracks keys at the root scope', () => {
    const scope = createConditionalScope();
    expect(scope.has('x')).toBe(false);
    scope.add('x');
    expect(scope.has('x')).toBe(true);
  });

  it('hides keys added inside a conditional branch when the branch exits', () => {
    // {{#if}}<x/>{{else}}<y/>{{/if}} — after the if closes, BOTH branches'
    // keys are promoted to "always seen" (conservative upper bound), so
    // siblings after the if see both.
    const scope = createConditionalScope();
    scope.enterConditional();
    scope.enterConditionalBranch();
    scope.add('x');
    expect(scope.has('x')).toBe(true);
    scope.exitConditionalBranch();
    // Program branch just exited — x is not visible right now.
    expect(scope.has('x')).toBe(false);
    scope.enterConditionalBranch();
    scope.add('y');
    expect(scope.has('y')).toBe(true);
    // In the inverse branch, x is NOT visible (branches are exclusive).
    expect(scope.has('x')).toBe(false);
    scope.exitConditionalBranch();
    scope.exitConditional();
    // After the conditional closes, both x and y are treated as "seen"
    // at the outer scope (one or the other rendered at runtime).
    expect(scope.has('x')).toBe(true);
    expect(scope.has('y')).toBe(true);
  });

  it('handles nested conditionals', () => {
    const scope = createConditionalScope();
    scope.enterConditional();
    scope.enterConditionalBranch();
    scope.enterConditional();
    scope.enterConditionalBranch();
    scope.add('deep');
    expect(scope.has('deep')).toBe(true);
    scope.exitConditionalBranch();
    scope.exitConditional();
    scope.exitConditionalBranch();
    scope.exitConditional();
    // deep was seen somewhere in the nested conditional — surfaces outside.
    expect(scope.has('deep')).toBe(true);
  });
});
