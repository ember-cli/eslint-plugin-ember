'use strict';

const assert = require('chai').assert;
const babelEslint = require('babel-eslint');
const utils = require('../../../lib/utils/utils');

function parse(code) {
  return babelEslint.parse(code).body[0].expression;
}

describe('findNodes', () => {
  const node = parse(`test = [
    {test: "a"}, b, "c", [d, e], "f", "g", h, {test: "i"}, function() {}, [], new Date()
  ]`).right.elements;

  it('should find nodes based on their name', () => {
    const literals = utils.findNodes(node, 'Literal');
    const identifiers = utils.findNodes(node, 'Identifier');
    const objects = utils.findNodes(node, 'ObjectExpression');
    const functions = utils.findNodes(node, 'FunctionExpression');
    const news = utils.findNodes(node, 'NewExpression');
    const arrays = utils.findNodes(node, 'ArrayExpression');

    assert.equal(literals.length, 3);
    assert.equal(identifiers.length, 2);
    assert.equal(objects.length, 2);
    assert.equal(functions.length, 1);
    assert.equal(news.length, 1);
    assert.equal(arrays.length, 2);
  });
});

describe('isIdentifier', () => {
  const node = parse('test');

  it('should check if node is identifier', () => {
    assert.ok(utils.isIdentifier(node));
  });
});

describe('isLiteral', () => {
  const node = parse('"test"');

  it('should check if node is identifier', () => {
    assert.ok(utils.isLiteral(node));
  });
});

describe('isMemberExpression', () => {
  const node = parse('test.value');

  it('should check if node is member expression', () => {
    assert.ok(utils.isMemberExpression(node));
  });
});

describe('isCallExpression', () => {
  const node = parse('test()');

  it('should check if node is call expression', () => {
    assert.ok(utils.isCallExpression(node));
  });
});

describe('isObjectExpression', () => {
  const node = parse('test = {}').right;

  it('should check if node is identifier', () => {
    assert.ok(utils.isObjectExpression(node));
  });
});

describe('isArrayExpression', () => {
  const node = parse('test = []').right;

  it('should check if node is array expression', () => {
    assert.ok(utils.isArrayExpression(node));
  });
});

describe('isFunctionExpression', () => {
  const node = parse('test = function () {}').right;

  it('should check if node is function expression', () => {
    assert.ok(utils.isFunctionExpression(node));
  });
});

describe('isArrowFunctionExpression', () => {
  const node = parse('test = () => {}').right;

  it('should check if node is arrow function expression', () => {
    assert.ok(utils.isArrowFunctionExpression(node));
  });
});

describe('isNewExpression', () => {
  const node = parse('new Date()');

  it('should check if node is new expression', () => {
    assert.ok(utils.isNewExpression(node));
  });
});

describe('isCallWithFunctionExpression', () => {
  const node = parse('mysteriousFnc(function(){})');

  it('should check if node is call with function expression', () => {
    assert.ok(utils.isCallWithFunctionExpression(node));
  });
});

describe('isThisExpression', () => {
  const node = parse('this');

  it('should check if node is "this" expression', () => {
    assert.ok(utils.isThisExpression(node));
  });
});

describe('isConditionalExpression', () => {
  const node = parse('test = true ? \'asd\' : \'qwe\'').right;

  it('should check if node is a conditional expression', () => {
    assert.ok(utils.isConditionalExpression(node));
  });
});

describe('getSize', () => {
  const node = parse('some = {\nfew: "line",\nheight: "statement",\nthat: "should",\nhave: "6 lines",\n};');

  it('should check size of given expression', () => {
    assert.equal(utils.getSize(node), 6);
  });
});

describe('parseCallee', () => {
  it('should parse calleeExpression', () => {
    const node = parse('Ember.computed.or("asd", "qwe")');
    const parsedCallee = utils.parseCallee(node);
    assert.equal(parsedCallee.length, 3, 'it has 3 elements in array');
    assert.deepEqual(parsedCallee, ['Ember', 'computed', 'or']);
  });

  it('should parse newExpression', () => {
    const node = parse('new Ember.A()');
    const parsedCallee = utils.parseCallee(node);
    assert.equal(parsedCallee.length, 2, 'it has 2 elements in array');
    assert.deepEqual(parsedCallee, ['Ember', 'A']);
  });
});

describe('parseArgs', () => {
  it('should parse arguments', () => {
    const node = parse('Ember.computed("asd", "qwe", "zxc", function() {})');
    const parsedArgs = utils.parseArgs(node);
    assert.equal(parsedArgs.length, 3);
    assert.deepEqual(parsedArgs, ['asd', 'qwe', 'zxc']);
  });
});
