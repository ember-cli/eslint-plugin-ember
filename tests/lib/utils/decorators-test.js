const babelEslint = require('babel-eslint');
const decoratorUtils = require('../../../lib/utils/decorators');

describe('findDecorator', () => {
  it('should not find anything with non-decorator', () => {
    const node = babelEslint.parse('const x = 123').body[0];
    expect(decoratorUtils.findDecorator(node, 'random')).toBeUndefined();
  });

  it('should not find anything with wrong decorator name', () => {
    const node = babelEslint.parse('class Test { @computed get prop() {} }').body[0].body.body[0];
    expect(decoratorUtils.findDecorator(node, 'random')).toBeUndefined();
  });

  it('should find something with Identifier decorator', () => {
    const node = babelEslint.parse('class Test { @computed get prop() {} }').body[0].body.body[0];
    expect(decoratorUtils.findDecorator(node, 'computed')).toBeTruthy();
  });

  it('should find something with CallExpression decorator', () => {
    const node = babelEslint.parse('class Test { @computed() get prop() {} }').body[0].body.body[0];
    expect(decoratorUtils.findDecorator(node, 'computed')).toBeTruthy();
  });
});

describe('hasDecorator', () => {
  const expressionlessParse = (code) => babelEslint.parse(code).body[0];
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
      expected: true,
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
  testCases.forEach(({ code, decoratorName, expected }) => {
    it(`('${code}', '${decoratorName}') => ${expected}`, () => {
      const node = expressionlessParse(code);
      expect(decoratorUtils.hasDecorator(node, decoratorName)).toStrictEqual(expected);
    });
  });
});

describe('isClassPropertyWithDecorator', () => {
  it('should not find anything with non-decorator', () => {
    const node = babelEslint.parse('const x = 123').body[0];
    expect(decoratorUtils.isClassPropertyWithDecorator(node, 'random')).toStrictEqual(false);
  });

  it('should not find anything with wrong decorator name', () => {
    const node = babelEslint.parse('class Test { @tracked x }').body[0].body.body[0];
    expect(decoratorUtils.isClassPropertyWithDecorator(node, 'random')).toStrictEqual(false);
  });

  it('should find something with Identifier decorator', () => {
    const node = babelEslint.parse('class Test { @tracked x }').body[0].body.body[0];
    expect(decoratorUtils.isClassPropertyWithDecorator(node, 'tracked')).toStrictEqual(true);
  });

  it('should find something with CallExpression decorator', () => {
    const node = babelEslint.parse('class Test { @tracked x }').body[0].body.body[0];
    expect(decoratorUtils.isClassPropertyWithDecorator(node, 'tracked')).toStrictEqual(true);
  });
});
