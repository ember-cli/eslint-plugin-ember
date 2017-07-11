'use strict';

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

    expect(literals).toHaveLength(3);
    expect(identifiers).toHaveLength(2);
    expect(objects).toHaveLength(2);
    expect(functions).toHaveLength(1);
    expect(news).toHaveLength(1);
    expect(arrays).toHaveLength(2);
  });
});

describe('isIdentifier', () => {
  const node = parse('test');

  it('should check if node is identifier', () => {
    expect(utils.isIdentifier(node)).toBeTruthy();
  });
});

describe('isLiteral', () => {
  const node = parse('"test"');

  it('should check if node is identifier', () => {
    expect(utils.isLiteral(node)).toBeTruthy();
  });
});

describe('isUnaryExpression', () => {
  const node = parse('-1');

  it('should check if node is identifier', () => {
    expect(utils.isUnaryExpression(node)).toBeTruthy();
  });
});

describe('isMemberExpression', () => {
  const node = parse('test.value');

  it('should check if node is member expression', () => {
    expect(utils.isMemberExpression(node)).toBeTruthy();
  });
});

describe('isCallExpression', () => {
  const node = parse('test()');

  it('should check if node is call expression', () => {
    expect(utils.isCallExpression(node)).toBeTruthy();
  });
});

describe('isObjectExpression', () => {
  const node = parse('test = {}').right;

  it('should check if node is identifier', () => {
    expect(utils.isObjectExpression(node)).toBeTruthy();
  });
});

describe('isArrayExpression', () => {
  const node = parse('test = []').right;

  it('should check if node is array expression', () => {
    expect(utils.isArrayExpression(node)).toBeTruthy();
  });
});

describe('isFunctionExpression', () => {
  const node = parse('test = function () {}').right;

  it('should check if node is function expression', () => {
    expect(utils.isFunctionExpression(node)).toBeTruthy();
  });
});

describe('isArrowFunctionExpression', () => {
  const node = parse('test = () => {}').right;

  it('should check if node is arrow function expression', () => {
    expect(utils.isArrowFunctionExpression(node)).toBeTruthy();
  });
});

describe('isConciseArrowFunctionExpressionWithCall', () => {
  const node = parse('test = () => foo()').right;
  const blockNode = parse('test = () => { foo() }').right;

  it('should check if node is concise arrow function expression with call expression body', () => {
    expect(utils.isConciseArrowFunctionWithCallExpression(node)).toBeTruthy();
  });

  it('should check if node does not have block body', () => {
    expect(!utils.isConciseArrowFunctionWithCallExpression(blockNode)).toBeTruthy();
  });
});

describe('isNewExpression', () => {
  const node = parse('new Date()');

  it('should check if node is new expression', () => {
    expect(utils.isNewExpression(node)).toBeTruthy();
  });
});

describe('isCallWithFunctionExpression', () => {
  const node = parse('mysteriousFnc(function(){})');

  it('should check if node is call with function expression', () => {
    expect(utils.isCallWithFunctionExpression(node)).toBeTruthy();
  });
});

describe('isThisExpression', () => {
  const node = parse('this');

  it('should check if node is "this" expression', () => {
    expect(utils.isThisExpression(node)).toBeTruthy();
  });
});

describe('isConditionalExpression', () => {
  const node = parse('test = true ? \'asd\' : \'qwe\'').right;

  it('should check if node is a conditional expression', () => {
    expect(utils.isConditionalExpression(node)).toBeTruthy();
  });
});

describe('isTaggedTemplateExpression', () => {
  const node = parse('test = hbs`lorem ipsum`;').right;

  it('should check if node is a tagged template expression', () => {
    expect(utils.isTaggedTemplateExpression(node)).toBeTruthy();
  });
});

describe('getSize', () => {
  const node = parse('some = {\nfew: "line",\nheight: "statement",\nthat: "should",\nhave: "6 lines",\n};');

  it('should check size of given expression', () => {
    expect(utils.getSize(node)).toEqual(6);
  });
});

describe('parseCallee', () => {
  it('should parse calleeExpression', () => {
    const node = parse('Ember.computed.or("asd", "qwe")');
    const parsedCallee = utils.parseCallee(node);
    expect(parsedCallee).toHaveLength(3, 'it has 3 elements in array');
    expect(parsedCallee).toEqual(['Ember', 'computed', 'or']);
  });

  it('should parse newExpression', () => {
    const node = parse('new Ember.A()');
    const parsedCallee = utils.parseCallee(node);
    expect(parsedCallee).toHaveLength(2, 'it has 2 elements in array');
    expect(parsedCallee).toEqual(['Ember', 'A']);
  });
});

describe('parseArgs', () => {
  it('should parse arguments', () => {
    const node = parse('Ember.computed("asd", "qwe", "zxc", function() {})');
    const parsedArgs = utils.parseArgs(node);
    expect(parsedArgs).toHaveLength(3);
    expect(parsedArgs).toEqual(['asd', 'qwe', 'zxc']);
  });
});
