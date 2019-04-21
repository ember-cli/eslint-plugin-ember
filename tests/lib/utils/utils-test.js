'use strict';

const babelEslint = require('babel-eslint');
const utils = require('../../../lib/utils/utils');

function parse(code) {
  return babelEslint.parse(code).body[0].expression;
}

function parseVariableDeclarator(code) {
  return babelEslint.parse(code).body[0].declarations[0];
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

describe('isReturnStatement', () => {
  const node = babelEslint.parse('return').body[0];

  it('should check if node is a return statement', () => {
    expect(utils.isReturnStatement(node)).toBeTruthy();
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

describe('getPropertyValue', () => {
  const simpleObject = {
    foo: true,
    bar: {
      baz: 1,
      fizz: {
        buzz: 'buzz'
      }
    }
  };

  const node = babelEslint.parse(`
    export default Ember.Component({
      init() {
        this._super(...arguments);
        this._valueCache = this.value;
        this.updated = false;
      },
      didReceiveAttrs() {
        if (this._valueCache !== this.value) {
          this._valueCache = this.value;
          this.set('updated', true);
        } else {
          this.set('updated', false);
        }
      }
    });
  `).body[0].declaration;

  it('should return null when property value not found for simpleObject', () => {
    const value = utils.getPropertyValue(simpleObject, 'blah');
    expect(value).toEqual(undefined);
  });

  it('should return value when using a simple property path for simpleObject', () => {
    const value = utils.getPropertyValue(simpleObject, 'foo');
    expect(value).toEqual(true);
  });

  it('should return value when using a full property path for simpleObject', () => {
    const buzz = utils.getPropertyValue(simpleObject, 'bar.fizz.buzz');
    expect(buzz).toEqual('buzz');
  });

  it('should return null when property value not found for node', () => {
    const value = utils.getPropertyValue(node, 'blah');
    expect(value).toEqual(undefined);
  });

  it('should return value when using a simple property path for node', () => {
    const type = utils.getPropertyValue(node, 'type');
    expect(type).toEqual('CallExpression');
  });

  it('should return value when using a full property path for node', () => {
    const name = utils.getPropertyValue(node, 'callee.object.name');
    expect(name).toEqual('Ember');
  });
});

describe('collectObjectPatternBindings', () => {
  it('collects bindings correctly', () => {
    const node = parseVariableDeclarator('const { $ } = Ember');
    const collectedBindings = utils.collectObjectPatternBindings(node, {
      Ember: ['$'],
    });

    expect(collectedBindings).toEqual(['$']);
  });

  it('collects aliased bindings correctly', () => {
    const node = parseVariableDeclarator('const { $:foo } = Ember');
    const collectedBindings = utils.collectObjectPatternBindings(node, {
      Ember: ['$'],
    });

    expect(collectedBindings).toEqual(['foo']);
  });

  it('collects only relevant bindings correctly for multiple destructurings', () => {
    const node = parseVariableDeclarator('const { $, computed } = Ember');
    const collectedBindings = utils.collectObjectPatternBindings(node, {
      Ember: ['$'],
    });

    expect(collectedBindings).toEqual(['$']);
  });

  it('collects only relevant bindings correctly for multiple destructurings and aliases', () => {
    const node = parseVariableDeclarator('const { $: foo, computed } = Ember');
    const collectedBindings = utils.collectObjectPatternBindings(node, {
      Ember: ['$'],
    });

    expect(collectedBindings).toEqual(['foo']);
  });

  it('collects multiple relevant bindings', () => {
    const node = parseVariableDeclarator('const { $: foo, computed } = Ember');
    const collectedBindings = utils.collectObjectPatternBindings(node, {
      Ember: ['$', 'computed'],
    });

    expect(collectedBindings).toEqual(['foo', 'computed']);
  });
});

describe('isGlobalCallExpression', () => {
  it('recognizes when call is not global', () => {
    const node = parse("$('foo')");
    expect(utils.isGlobalCallExpression(node, '$', ['$', 'jQuery'])).not.toBeTruthy();
  });

  it('recognizes when global call', () => {
    const node = parse("$('foo')");
    expect(utils.isGlobalCallExpression(node, 'jQuery', ['$', 'jQuery'])).toBeTruthy();
  });
});

describe('isString', () => {
  it('recognizes template literals', () => {
    const node = parse('`template literal`');
    expect(utils.isString(node)).toBeTruthy();
  });

  it('recognizes template literals with interpolation', () => {
    const node = parse('`template ${123} literal`'); // eslint-disable-line no-template-curly-in-string
    expect(utils.isString(node)).toBeTruthy();
  });

  it('recognizes string literals', () => {
    const node = parse("'string literal'");
    expect(utils.isString(node)).toBeTruthy();
  });

  it('ignores identifiers', () => {
    const node = parse('MY_VARIABLE');
    expect(utils.isString(node)).not.toBeTruthy();
  });

  it('ignores number literals', () => {
    const node = parse('123');
    expect(utils.isString(node)).not.toBeTruthy();
  });
});

describe('isStringLiteral', () => {
  it('recognizes string literals', () => {
    const node = parse("'string literal'");
    expect(utils.isStringLiteral(node)).toBeTruthy();
  });

  it('ignores template literals', () => {
    const node = parse('`template literal`');
    expect(utils.isStringLiteral(node)).not.toBeTruthy();
  });

  it('ignores identifiers', () => {
    const node = parse('MY_VARIABLE');
    expect(utils.isStringLiteral(node)).not.toBeTruthy();
  });

  it('ignores number literals', () => {
    const node = parse('123');
    expect(utils.isStringLiteral(node)).not.toBeTruthy();
  });
});
