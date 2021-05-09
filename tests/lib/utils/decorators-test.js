const { parse: babelESLintParse } = require('../../helpers/babel-eslint-parser');
const decoratorUtils = require('../../../lib/utils/decorators');

describe('getDecoratorName', () => {
  it('should return decorator name with Identifier', () => {
    const node = babelESLintParse('class Test { @computed get prop() {} }').body[0].body.body[0];
    expect(decoratorUtils.getDecoratorName(node.decorators[0])).toStrictEqual('computed');
  });

  it('should return decorator name with CallExpression', () => {
    const node = babelESLintParse('class Test { @computed() get prop() {} }').body[0].body.body[0];
    expect(decoratorUtils.getDecoratorName(node.decorators[0])).toStrictEqual('computed');
  });

  it('should return decorator name with MemberExpression', () => {
    const node = babelESLintParse('class Test { @computed.readOnly() get prop() {} }').body[0].body
      .body[0];
    expect(decoratorUtils.getDecoratorName(node.decorators[0])).toStrictEqual('computed.readOnly');
  });
});

describe('findDecorator', () => {
  it('should not find anything with non-decorator', () => {
    const node = babelESLintParse('const x = 123').body[0];
    expect(decoratorUtils.findDecorator(node, 'random')).toBeUndefined();
  });

  it('should not find anything with wrong decorator name', () => {
    const node = babelESLintParse('class Test { @computed get prop() {} }').body[0].body.body[0];
    expect(decoratorUtils.findDecorator(node, 'random')).toBeUndefined();
  });

  it('should find something with Identifier decorator', () => {
    const node = babelESLintParse('class Test { @computed get prop() {} }').body[0].body.body[0];
    expect(decoratorUtils.findDecorator(node, 'computed')).toBeTruthy();
  });

  it('should find something with CallExpression decorator', () => {
    const node = babelESLintParse('class Test { @computed() get prop() {} }').body[0].body.body[0];
    expect(decoratorUtils.findDecorator(node, 'computed')).toBeTruthy();
  });

  it('should find something with MemberExpression decorator', () => {
    const node = babelESLintParse('class Test { @computed.readOnly() get prop() {} }').body[0].body
      .body[0];
    expect(decoratorUtils.findDecorator(node, 'computed.readOnly')).toBeTruthy();
  });
});

describe('findDecoratorByNameCallback', () => {
  it('should not find anything with callback checking for wrong name', () => {
    const node = babelESLintParse('class Test { @computed get prop() {} }').body[0].body.body[0];
    expect(
      decoratorUtils.findDecoratorByNameCallback(node, (name) => name === 'random')
    ).toBeUndefined();
  });

  it('should find decorator with callback checking for correct name', () => {
    const node = babelESLintParse('class Test { @computed get prop() {} }').body[0].body.body[0];
    expect(
      decoratorUtils.findDecoratorByNameCallback(node, (name) => name === 'computed')
    ).toStrictEqual(node.decorators[0]);
  });
});

const expressionlessParse = (code) => babelESLintParse(code).body[0];
describe('hasDecorator', () => {
  const withDecorator = '@classic class Rectangle {}';
  const withoutDecorator = 'class Rectangle {}';
  const testCases = [
    {
      code: withoutDecorator,
      decoratorName: undefined,
      expected: false,
    },
    {
      code: withoutDecorator,
      decoratorName: 'classic',
      expected: false,
    },
    {
      code: withDecorator,
      decoratorName: undefined,
      expected: false,
    },
    {
      code: withDecorator,
      decoratorName: 'classic',
      expected: true,
    },
    {
      code: withDecorator,
      decoratorName: 'someOtherDecoratorName',
      expected: false,
    },
  ];
  for (const { code, decoratorName, expected } of testCases) {
    it(`('${code}', '${decoratorName}') => ${expected}`, () => {
      const node = expressionlessParse(code);
      expect(decoratorUtils.hasDecorator(node, decoratorName)).toStrictEqual(expected);
    });
  }
});

describe('isClassPropertyWithDecorator', () => {
  it('should not find anything with non-decorator', () => {
    const node = babelESLintParse('const x = 123').body[0];
    expect(decoratorUtils.isClassPropertyWithDecorator(node, 'random')).toStrictEqual(false);
  });

  it('should not find anything with wrong decorator name', () => {
    const node = babelESLintParse('class Test { @tracked x }').body[0].body.body[0];
    expect(decoratorUtils.isClassPropertyWithDecorator(node, 'random')).toStrictEqual(false);
  });

  it('should find something with Identifier decorator', () => {
    const node = babelESLintParse('class Test { @tracked x }').body[0].body.body[0];
    expect(decoratorUtils.isClassPropertyWithDecorator(node, 'tracked')).toStrictEqual(true);
  });

  it('should find something with CallExpression decorator', () => {
    const node = babelESLintParse('class Test { @tracked x }').body[0].body.body[0];
    expect(decoratorUtils.isClassPropertyWithDecorator(node, 'tracked')).toStrictEqual(true);
  });
});
