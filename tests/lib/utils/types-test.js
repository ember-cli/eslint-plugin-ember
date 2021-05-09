const { parse: babelESLintParse } = require('../../helpers/babel-eslint-parser');
const types = require('../../../lib/utils/types');

function parse(code) {
  return babelESLintParse(code).body[0].expression;
}

describe('function sort order', function () {
  it('has exported functions in sorted order', function () {
    expect(Object.getOwnPropertyNames(types)).toStrictEqual(
      Object.getOwnPropertyNames(types).sort()
    );
  });
});

describe('isArrayExpression', () => {
  const node = parse('test = []').right;

  it('should check if node is array expression', () => {
    expect(types.isArrayExpression(node)).toBeTruthy();
  });
});

describe('isArrowFunctionExpression', () => {
  const node = parse('test = () => {}').right;

  it('should check if node is arrow function expression', () => {
    expect(types.isArrowFunctionExpression(node)).toBeTruthy();
  });
});

describe('isCallExpression', () => {
  const node = parse('test()');

  it('should check if node is call expression', () => {
    expect(types.isCallExpression(node)).toBeTruthy();
  });
});

describe('isCallWithFunctionExpression', () => {
  const node = parse('mysteriousFnc(function(){})');

  it('should check if node is call with function expression', () => {
    expect(types.isCallWithFunctionExpression(node)).toBeTruthy();
  });
});

describe('isConciseArrowFunctionExpressionWithCall', () => {
  const node = parse('test = () => foo()').right;
  const blockNode = parse('test = () => { foo() }').right;

  it('should check if node is concise arrow function expression with call expression body', () => {
    expect(types.isConciseArrowFunctionWithCallExpression(node)).toBeTruthy();
  });

  it('should check if node does not have block body', () => {
    expect(!types.isConciseArrowFunctionWithCallExpression(blockNode)).toBeTruthy();
  });
});

describe('isConditionalExpression', () => {
  const node = parse("test = true ? 'asd' : 'qwe'").right;

  it('should check if node is a conditional expression', () => {
    expect(types.isConditionalExpression(node)).toBeTruthy();
  });
});

describe('isFunctionExpression', () => {
  const node = parse('test = function () {}').right;

  it('should check if node is function expression', () => {
    expect(types.isFunctionExpression(node)).toBeTruthy();
  });
});

describe('isIdentifier', () => {
  const node = parse('test');

  it('should check if node is identifier', () => {
    expect(types.isIdentifier(node)).toBeTruthy();
  });
});

describe('isLiteral', () => {
  const node = parse('"test"');

  it('should check if node is identifier', () => {
    expect(types.isLiteral(node)).toBeTruthy();
  });
});

describe('isMemberExpression', () => {
  const node = parse('test.value');

  it('should check if node is member expression', () => {
    expect(types.isMemberExpression(node)).toBeTruthy();
  });
});

describe('isNewExpression', () => {
  const node = parse('new Date()');

  it('should check if node is new expression', () => {
    expect(types.isNewExpression(node)).toBeTruthy();
  });
});

describe('isObjectExpression', () => {
  const node = parse('test = {}').right;

  it('should check if node is identifier', () => {
    expect(types.isObjectExpression(node)).toBeTruthy();
  });
});

describe('isReturnStatement', () => {
  const node = babelESLintParse('return').body[0];

  it('should check if node is a return statement', () => {
    expect(types.isReturnStatement(node)).toBeTruthy();
  });
});

describe('isString', () => {
  it('recognizes template literals', () => {
    const node = parse('`template literal`');
    expect(types.isString(node)).toBeTruthy();
  });

  it('recognizes template literals with interpolation', () => {
    const node = parse('`template ${123} literal`'); // eslint-disable-line no-template-curly-in-string
    expect(types.isString(node)).toBeTruthy();
  });

  it('recognizes string literals', () => {
    const node = parse("'string literal'");
    expect(types.isString(node)).toBeTruthy();
  });

  it('ignores identifiers', () => {
    const node = parse('MY_VARIABLE');
    expect(types.isString(node)).not.toBeTruthy();
  });

  it('ignores number literals', () => {
    const node = parse('123');
    expect(types.isString(node)).not.toBeTruthy();
  });
});

describe('isStringLiteral', () => {
  it('recognizes string literals', () => {
    const node = parse("'string literal'");
    expect(types.isStringLiteral(node)).toBeTruthy();
  });

  it('ignores template literals', () => {
    const node = parse('`template literal`');
    expect(types.isStringLiteral(node)).not.toBeTruthy();
  });

  it('ignores identifiers', () => {
    const node = parse('MY_VARIABLE');
    expect(types.isStringLiteral(node)).not.toBeTruthy();
  });

  it('ignores number literals', () => {
    const node = parse('123');
    expect(types.isStringLiteral(node)).not.toBeTruthy();
  });
});

describe('isTaggedTemplateExpression', () => {
  const node = parse('test = hbs`lorem ipsum`;').right;

  it('should check if node is a tagged template expression', () => {
    expect(types.isTaggedTemplateExpression(node)).toBeTruthy();
  });
});

describe('isThisExpression', () => {
  const node = parse('this');

  it('should check if node is "this" expression', () => {
    expect(types.isThisExpression(node)).toBeTruthy();
  });
});

describe('isUnaryExpression', () => {
  const node = parse('-1');

  it('should check if node is identifier', () => {
    expect(types.isUnaryExpression(node)).toBeTruthy();
  });
});
