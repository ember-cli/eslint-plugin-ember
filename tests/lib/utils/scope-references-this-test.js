'use strict';

const { parse: babelESLintParse } = require('../../helpers/babel-eslint-parser');
const scopeReferencesThis = require('../../../lib/utils/scope-references-this');

function parse(code) {
  return babelESLintParse(code).body[0];
}

describe('scopeReferencesThis', function () {
  it('recognizes simple cases`', function () {
    expect(scopeReferencesThis(parse('this'))).toBeTruthy(); // `this` uses `this`
    expect(scopeReferencesThis(parse('"this"'))).toBeFalsy(); // the string "this" does not use this
  });

  it('can find nested `this`', function () {
    expect(scopeReferencesThis(parse('if (a) { this } else { null }'))).toBeTruthy(); // if statement uses this
    expect(scopeReferencesThis(parse('() => this'))).toBeTruthy(); // arrow function uses outer this
  });

  it('does not consider `this` within non-arrow functions', function () {
    expect(scopeReferencesThis(parse('function foo() { return this; }'))).toBeFalsy(); // function uses different this
    expect(scopeReferencesThis(parse('function foo() { return () => this; }'))).toBeFalsy(); // inner arrow function uses different this'
    expect(scopeReferencesThis(parse('() => function() { return this; }'))).toBeFalsy(); // inner function uses different this
    expect(scopeReferencesThis(parse('({ a() { this } })'))).toBeFalsy(); // object method uses different this
  });
});
