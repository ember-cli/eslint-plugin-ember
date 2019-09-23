'use strict';

const babelEslint = require('babel-eslint');
const { isDestructuring } = require('../../../lib/utils/new-module');

describe('isDestructuring', () => {
  it('should check a destructuring import', () => {
    const node = babelEslint.parse(`const { destructured } = someVar;`).body[0].declarations[0];
    expect(isDestructuring(node)).toBeTruthy();
  });

  it('should check a non-destructuring import', () => {
    const node = babelEslint.parse(`const destructured = someVar;`).body[0].declarations[0];
    expect(isDestructuring(node)).toBeFalsy();
  });

  it('should check a ForInStatement', () => {
    const node = babelEslint.parse(`for (const item in list) {};`).body[0].left.declarations[0];
    expect(isDestructuring(node)).toBeFalsy();
  });
});
