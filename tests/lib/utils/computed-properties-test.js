const { parse: babelESLintParse } = require('../../helpers/babel-eslint-parser');
const computedPropertyUtils = require('../../../lib/utils/computed-properties');

function parse(code) {
  return babelESLintParse(code).body[0].expression;
}

describe('getComputedPropertyFunctionBody', () => {
  it('gets the result with no dependent keys and no function', () => {
    const node = parse('computed()');
    expect(computedPropertyUtils.getComputedPropertyFunctionBody(node)).toBeUndefined();
  });

  it('gets the result with one dependent key and no function', () => {
    const node = parse('computed("dep")');
    expect(computedPropertyUtils.getComputedPropertyFunctionBody(node)).toBeUndefined();
  });

  it('gets the result when using FunctionExpression and no dependent keys', () => {
    const node = parse('computed(function() {})');
    expect(computedPropertyUtils.getComputedPropertyFunctionBody(node).type).toStrictEqual(
      'BlockStatement'
    );
  });

  it('gets the result when using FunctionExpression and one dependent key', () => {
    const node = parse('computed("dep1", function() {})');
    expect(computedPropertyUtils.getComputedPropertyFunctionBody(node).type).toStrictEqual(
      'BlockStatement'
    );
  });

  it('gets the result when using explicit getter', () => {
    const node = parse('computed("dep1", { get() {}})');
    expect(computedPropertyUtils.getComputedPropertyFunctionBody(node).type).toStrictEqual(
      'BlockStatement'
    );
  });
});
