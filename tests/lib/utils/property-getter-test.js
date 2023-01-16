'use strict';

const { parse: babelESLintParse } = require('../../helpers/babel-eslint-parser');
const propertyGetterUtils = require('../../../lib/utils/property-getter');
const { FauxContext } = require('../../helpers/faux-context');

function parse(code) {
  return babelESLintParse(code).body[0].expression;
}

describe('isSimpleThisExpression', () => {
  it('behaves correctly', () => {
    // False:
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x().y'))).toBeFalsy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x()'))).toBeFalsy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x.y()'))).toBeFalsy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x[1]'))).toBeFalsy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x[i]'))).toBeFalsy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x.y[i]'))).toBeFalsy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this?.get()'))).toBeFalsy();

    // True:
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x'))).toBeTruthy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x.y'))).toBeTruthy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x?.y'))).toBeTruthy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x?.y?.z'))).toBeTruthy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.get("property")'))).toBeTruthy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.get("x.y")'))).toBeTruthy();
  });
});

describe('isThisGetCall', () => {
  it('behaves correctly', () => {
    // False:
    expect(propertyGetterUtils.isThisGetCall(parse('this.x'))).toBeFalsy();
    expect(propertyGetterUtils.isThisGetCall(parse('this.x.y'))).toBeFalsy();
    expect(propertyGetterUtils.isThisGetCall(parse('this.x().y'))).toBeFalsy();
    expect(propertyGetterUtils.isThisGetCall(parse('this.x()'))).toBeFalsy();
    expect(propertyGetterUtils.isThisGetCall(parse('this.x.y()'))).toBeFalsy();
    expect(propertyGetterUtils.isThisGetCall(parse('this.x[1]'))).toBeFalsy();
    expect(propertyGetterUtils.isThisGetCall(parse('this.x[i]'))).toBeFalsy();
    expect(propertyGetterUtils.isThisGetCall(parse('this.x.y[i]'))).toBeFalsy();
    expect(propertyGetterUtils.isThisGetCall(parse('this.get("property").something'))).toBeFalsy();
    expect(
      propertyGetterUtils.isThisGetCall(parse('this.get("unexpected", "argument").something'))
    ).toBeFalsy();
    expect(propertyGetterUtils.isThisGetCall(parse('this?.get("property")'))).toBeFalsy();

    // True:
    expect(propertyGetterUtils.isThisGetCall(parse('this.get("property")'))).toBeTruthy();
    expect(propertyGetterUtils.isThisGetCall(parse('this.get("x.y")'))).toBeTruthy();
  });
});

describe('nodeToDependentKey', () => {
  it('behaves correctly', () => {
    let context = new FauxContext('this.x');
    let node = context.ast.body[0];
    expect(propertyGetterUtils.nodeToDependentKey(node, context)).toBe('x');

    context = new FauxContext('this.x.y');
    node = context.ast.body[0];
    expect(propertyGetterUtils.nodeToDependentKey(node, context)).toBe('x.y');

    context = new FauxContext('this.get("x")');
    node = context.ast.body[0].expression;
    expect(propertyGetterUtils.nodeToDependentKey(node, context)).toBe('x');

    context = new FauxContext('this.x()');
    node = context.ast.body[0].expression;
    expect(propertyGetterUtils.nodeToDependentKey(node, context)).toBeUndefined();
  });
});
