'use strict';

const babelEslint = require('babel-eslint');
const propertyGetterUtils = require('../../../lib/utils/property-getter');

function parse(code) {
  return babelEslint.parse(code).body[0].expression;
}

describe('isSimpleThisExpression', () => {
  it('behaves correctly', () => {
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x'))).toBeTruthy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x.y'))).toBeTruthy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x().y'))).toBeFalsy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x()'))).toBeFalsy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x.y()'))).toBeFalsy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.get("property")'))).toBeFalsy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x[1]'))).toBeFalsy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x[i]'))).toBeFalsy();
    expect(propertyGetterUtils.isSimpleThisExpression(parse('this.x.y[i]'))).toBeFalsy();
  });
});
