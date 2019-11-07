'use strict';

const babelEslint = require('babel-eslint');
const propertyGetterUtils = require('../../../lib/utils/property-getter');

function parse(code) {
  return babelEslint.parse(code).body[0].expression;
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

    // True:
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x'))).toBeTruthy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x.y'))).toBeTruthy();
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

    // True:
    expect(propertyGetterUtils.isThisGetCall(parse('this.get("property")'))).toBeTruthy();
    expect(propertyGetterUtils.isThisGetCall(parse('this.get("x.y")'))).toBeTruthy();
  });
});
