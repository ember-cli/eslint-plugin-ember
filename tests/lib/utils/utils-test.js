const assert = require('chai').assert;
const babelEslint = require('babel-eslint');
const utils = require('../../../lib/utils/utils');

function parse(code) {
  return babelEslint.parse(code).body[0].expression;
}

describe('findNodes', function() {
  const node = parse(`test = [
    {test: "a"}, b, "c", [d, e], "f", "g", h, {test: "i"}, function() {}, [], new Date()
  ]`).right.elements;

  it('should find nodes based on their name', function() {
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

describe('isIdentifier', function() {
  const node = parse('test');

  it('should check if node is identifier', function() {
    assert.ok(utils.isIdentifier(node));
  });
});

describe('isLiteral', function() {
  const node = parse('"test"');

  it('should check if node is identifier', function() {
    assert.ok(utils.isLiteral(node));
  });
});

describe('isMemberExpression', function() {
  const node = parse('test.value');

  it('should check if node is member expression', function() {
    assert.ok(utils.isMemberExpression(node));
  });
});

describe('isCallExpression', function() {
  const node = parse('test()');

  it('should check if node is call expression', function() {
    assert.ok(utils.isCallExpression(node));
  });
});

describe('isObjectExpression', function() {
  const node = parse('test = {}').right;

  it('should check if node is identifier', function() {
    assert.ok(utils.isObjectExpression(node));
  });
});

describe('isArrayExpression', function() {
  const node = parse('test = []').right;

  it('should check if node is array expression', function() {
    assert.ok(utils.isArrayExpression(node));
  });
});

describe('isFunctionExpression', function() {
  const node = parse('test = function () {}').right;

  it('should check if node is function expression', function() {
    assert.ok(utils.isFunctionExpression(node));
  });
});

describe('isArrowFunctionExpression', function() {
  const node = parse('test = () => {}').right;

  it('should check if node is arrow function expression', function() {
    assert.ok(utils.isArrowFunctionExpression(node));
  });
});

describe('isNewExpression', function() {
  const node = parse('new Date()');

  it('should check if node is new expression', function() {
    assert.ok(utils.isNewExpression(node));
  });
});

describe('isCallWithFunctionExpression', function() {
  const node = parse('mysteriousFnc(function(){})');

  it('should check if node is call with function expression', function() {
    assert.ok(utils.isCallWithFunctionExpression(node));
  });
});

describe('isThisExpression', function() {
  const node = parse('this');

  it('should check if node is "this" expression', function() {
    assert.ok(utils.isThisExpression(node));
  });
});

describe('isConditionalExpression', function() {
  const node = parse(`test = true ? 'asd' : 'qwe'`).right;

  it('should check if node is a conditional expression', function() {
    assert.ok(utils.isConditionalExpression(node));
  });
});

describe('getSize', function() {
  const node = parse('some = {\nfew: "line",\nheight: "statement",\nthat: "should",\nhave: "6 lines",\n};');

  it('should check size of given expression', function() {
    assert.equal(utils.getSize(node), 6);
  });
});

describe('parseCallee', function() {
  it('should parse calleeExpression', function() {
    const node = parse('Ember.computed.or("asd", "qwe")');
    const parsedCallee = utils.parseCallee(node);
    assert.equal(parsedCallee.length, 3, 'it has 3 elements in array');
    assert.deepEqual(parsedCallee, ['Ember', 'computed', 'or']);
  });

  it('should parse newExpression', function() {
    const node = parse('new Ember.A()');
    const parsedCallee = utils.parseCallee(node);
    assert.equal(parsedCallee.length, 2, 'it has 2 elements in array');
    assert.deepEqual(parsedCallee, ['Ember', 'A']);
  });
});

describe('parseArgs', function() {
  it('should parse arguments', function() {
      const node = parse('Ember.computed("asd", "qwe", "zxc", function() {})');
      const parsedArgs = utils.parseArgs(node);
      assert.equal(parsedArgs.length, 3);
      assert.deepEqual(parsedArgs, ['asd', 'qwe', 'zxc']);
  });
});
