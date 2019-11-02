'use strict';

const babelEslint = require('babel-eslint');
const { buildFix, isDestructuring } = require('../../../lib/utils/new-module');

const modulesData = {
  'ember-data/model': {
    default: ['@ember-data/model'],
  },
};

describe('isDestructuring', () => {
  it('should check a destructuring import', () => {
    const node = babelEslint.parse('const { destructured } = someVar;').body[0].declarations[0];
    expect(isDestructuring(node)).toBeTruthy();
  });

  it('should check a non-destructuring import', () => {
    const node = babelEslint.parse('const destructured = someVar;').body[0].declarations[0];
    expect(isDestructuring(node)).toBeFalsy();
  });

  it('should check a ForInStatement', () => {
    const node = babelEslint.parse('for (const item in list) {};').body[0].left.declarations[0];
    expect(isDestructuring(node)).toBeFalsy();
  });
});

describe('buildFix', () => {
  it('returns a function', () => {
    const node = babelEslint.parse('import Model from "ember-data/model"').body[0];
    const fix = buildFix(node, modulesData);
    expect(typeof fix === 'function').toBeTruthy();
  });
});
