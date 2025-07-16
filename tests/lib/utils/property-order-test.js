'use-strict';

const propertyOrder = require('../../../lib/utils/property-order');
const { FauxContext } = require('../../helpers/faux-context');

describe('addBackwardsPosition', () => {
  it('should not change the order if the desired position is already included in the order', () => {
    const newOrder = propertyOrder.addBackwardsPosition(
      ['method', 'empty-method'],
      'empty-method',
      'method'
    );
    expect(newOrder).toStrictEqual(['method', 'empty-method']);
  });

  it('should not change the order if the desired position is already included as part of another position group', () => {
    const newOrder = propertyOrder.addBackwardsPosition(
      [['method', 'empty-method'], 'foo'],
      'empty-method',
      'method'
    );
    expect(newOrder).toStrictEqual([['method', 'empty-method'], 'foo']);
  });

  it('should not add the position, if the target position is not present', () => {
    const newOrder = propertyOrder.addBackwardsPosition(['foo'], 'empty-method', 'bar');
    expect(newOrder).toStrictEqual(['foo']);
  });

  it('should add the desired position to the existing target position when the target position is on its own position', () => {
    const newOrder = propertyOrder.addBackwardsPosition(
      ['method', 'foo'],
      'empty-method',
      'method'
    );
    expect(newOrder).toStrictEqual([['method', 'empty-method'], 'foo']);
  });

  it('should add the desired position to the existing target position when the target position is part of a group', () => {
    const newOrder = propertyOrder.addBackwardsPosition(
      [['method', 'bar'], 'foo'],
      'empty-method',
      'method'
    );
    expect(newOrder).toStrictEqual([['method', 'bar', 'empty-method'], 'foo']);
  });
});

describe('determinePropertyType', () => {
  describe('classic classes', () => {
    it('should determine service-type props', () => {
      const context = new FauxContext(
        `import {inject as service} from '@ember/service';
        export default Controller.extend({
          currentUser: service(),
        });`
      );
      const importInjectName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(
        propertyOrder.determinePropertyType(node, 'controller', [], undefined, importInjectName)
      ).toBe('service');
    });

    it('should determine controller-type props with full import', () => {
      const context = new FauxContext(
        `import Ember from 'ember';
        export default Controller.extend({
          application: Ember.inject.controller(),
        });`
      );
      const importEmberName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'controller', [], importEmberName)).toBe(
        'controller'
      );
    });

    it('should determine controller-type props', () => {
      const context = new FauxContext(
        `import {inject as controller} from '@ember/controller';
        export default Controller.extend({
          application: controller(),
        });`
      );
      const importControllerName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(
        propertyOrder.determinePropertyType(
          node,
          'controller',
          [],
          undefined,
          undefined,
          undefined,
          importControllerName
        )
      ).toBe('controller');
    });

    it('should determine init-type props', () => {
      const context = new FauxContext(
        `export default Controller.extend({
          init() {}
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toBe('init');
    });

    it('should determine component lifecycle hooks', () => {
      const context = new FauxContext(
        `export default Component.extend({
          didInsertElement() {}
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toBe('didInsertElement');
    });

    it('should determine query-params', () => {
      const context = new FauxContext(
        `export default Controller.extend({
          queryParams: []
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toBe('query-params');
    });

    it('should determine inherited properties', () => {
      const context = new FauxContext(
        `export default Controller.extend({
          isDestroyed: false
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toBe('inherited-property');
    });

    it('should determine attributes', () => {
      const context = new FauxContext(
        `export default Model.extend({
          someAttr: DS.attr()
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'model')).toBe('attribute');
    });

    it('should determine relationships', () => {
      const context = new FauxContext(
        `export default Model.extend({
          someRelationship: hasMany('otherModel')
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'model')).toBe('relationship');
    });

    it('should determine observer-type props with full import', () => {
      const context = new FauxContext(
        `import Ember from 'ember';
        export default Controller.extend({
          someObvs: Ember.observer(),
        });`
      );
      const importEmberName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'controller', [], importEmberName)).toBe(
        'observer'
      );
    });

    it('should determine observer-type props', () => {
      const context = new FauxContext(
        `import {observer} from '@ember/object';
        export default Controller.extend({
          someObvs: observer(),
        });`
      );
      const importObserverName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(
        propertyOrder.determinePropertyType(
          node,
          'controller',
          [],
          undefined,
          undefined,
          importObserverName
        )
      ).toBe('observer');
    });

    it('should determine actions', () => {
      const context = new FauxContext(
        `export default Component.extend({
          actions: {}
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toBe('actions');
    });

    it('should determine single-line functions', () => {
      const context = new FauxContext(
        `export default Component.extend({
          foo: boo()
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toBe('single-line-function');
    });

    it('should determine multi-line functions', () => {
      const context = new FauxContext(
        `export default Component.extend({
          foo: boo(bar, baz, () => {
            console.log('boop')
          })
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toBe('multi-line-function');
    });

    it('should determine properties', () => {
      const context = new FauxContext(
        `export default Component.extend({
          foo: "boo"
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component', [])).toBe('property');
    });

    it('should determine template literals as properties', () => {
      const context = new FauxContext(
        `export default Component.extend({
          foo: ${`foo${'bar'}`}
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component', [])).toBe('property');
    });

    it('should determine spread syntax as a spread property', () => {
      const context = new FauxContext(
        `export default Component.extend({
          ...foo
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component', [])).toBe('spread');
    });

    it('should determine empty methods', () => {
      const context = new FauxContext(
        `export default Component.extend({
          foo() {}
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component', [])).toBe('empty-method');
    });

    it('should determine methods', () => {
      const context = new FauxContext(
        `export default Component.extend({
          foo() { console.log("hello") }
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component', [])).toBe('method');
    });

    it('should determine custom properties when given order with custom property', () => {
      const context = new FauxContext(
        `export default Component.extend({
          myFooProperty: null
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(
        propertyOrder.determinePropertyType(node, 'component', [
          'custom:myBarProperty',
          'custom:myFooProperty',
        ])
      ).toBe('custom:myFooProperty');
    });

    it('should determine custom properties as normal properties when given order without custom property', () => {
      const context = new FauxContext(
        `export default Component.extend({
          myFooProperty: null
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component', ['custom:myBarProperty'])).toBe(
        'property'
      );
    });
  });
});

describe('determinePropertyTypeInNativeClass', () => {
  it('should determine service-type props', () => {
    const context = new FauxContext(
      `import {inject as service} from '@ember/service';
      class MyController extends Controller {
        @service currentUser;
      }`
    );
    const importInjectName = context.ast.body[0].specifiers[0].local.name;
    const node = context.ast.body[1].body.body[0];
    expect(
      propertyOrder.determinePropertyTypeInNativeClass(
        node,
        'controller',
        [],
        undefined,
        importInjectName
      )
    ).toBe('service');
  });
  it('should determine controller-type props', () => {
    const context = new FauxContext(
      `import {inject as controller} from '@ember/controller';
      class MyController extends Controller {
        @controller application;
      }`
    );
    const importControllerName = context.ast.body[0].specifiers[0].local.name;
    const node = context.ast.body[1].body.body[0];
    expect(
      propertyOrder.determinePropertyTypeInNativeClass(
        node,
        'controller',
        [],
        undefined,
        undefined,
        undefined,
        importControllerName
      )
    ).toBe('controller');
  });

  it('should determine constructor-type props', () => {
    const context = new FauxContext(
      `class MyController extends Controller {
          constructor() {}
        }`
    );
    const node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'controller')).toBe(
      'constructor'
    );
  });

  it('should determine component lifecycle hooks', () => {
    const context = new FauxContext(
      `class MyComponent extends Component {
          willDestroy() {}
        }`
    );
    const node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'component', [])).toBe(
      'willDestroy'
    );
  });

  it('should determine query-params', () => {
    const context = new FauxContext(
      `class MyController extends Controller {
        queryParams = [];
      }`
    );
    const node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'controller')).toBe(
      'query-params'
    );
  });
  it('should determine attributes', () => {
    const context = new FauxContext(
      `class MyModel extends Model {
        @attr someAttr;
      }`
    );
    const node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'model')).toBe('attribute');
  });
  it('should determine relationships', () => {
    const context = new FauxContext(
      `class MyModel extends Model {
        @hasMany('otherModel') someRelationship;
      }`
    );
    const node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'model')).toBe('relationship');
  });

  it('should determine single-line accessor', () => {
    const context = new FauxContext(
      `class MyComponent extends Component {
            get myProp() {};
          }`
    );
    const node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'component', [])).toBe(
      'single-line-accessor'
    );
  });

  it('should determine multi-line accessor', () => {
    const context = new FauxContext(
      `class MyComponent extends Component {
          get myProp() {
              console.log('bar');
          };
        }`
    );
    const node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'component', [])).toBe(
      'multi-line-accessor'
    );
  });

  it('should determine single-line functions', () => {
    const context = new FauxContext(
      `class MyComponent extends Component {
        @computed get myProp() {};
      }`
    );
    const node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'component', [])).toBe(
      'single-line-accessor'
    );
  });

  it('should determine multi-line functions', () => {
    const context = new FauxContext(
      `class MyComponent extends Component {
        @computed
        get myProp() {
            console.log('bar');
        };
      }`
    );
    const node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'component', [])).toBe(
      'multi-line-accessor'
    );
  });

  it('should determine actions', () => {
    const context = new FauxContext(
      `import {action} from '@ember/object';
      class MyComponent extends Component {
        @action fooAction() {};
      }`
    );
    const node = context.ast.body[1].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'component')).toBe('action');
  });

  it('should determine empty methods', () => {
    const context = new FauxContext(
      `class MyComponent extends Component {
        foo() {}
      }`
    );
    const node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'component', [])).toBe(
      'empty-method'
    );
  });

  it('should determine methods', () => {
    let context = new FauxContext(
      `class MyComponent extends Component {
        foo(bar) {
          console.log(bar)
        }
      }`
    );
    let node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'component', [])).toBe('method');

    context = new FauxContext(
      `class MyComponent extends Component {
        fooTask = task(async () => {
          console.log('foo');
        })
      }`
    );
    node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'component', [])).toBe('method');

    context = new FauxContext(
      `class trackedMyComponent extends Component {
        @task
        fooTask2() {
          console.log('foo');
        }
      }`
    );
    node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'component', [])).toBe('method');
  });

  it('should determine properties', () => {
    let context = new FauxContext(
      `class MyComponent extends Component {
        foo = "boo";
      }`
    );
    let node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'component', [])).toBe(
      'property'
    );

    context = new FauxContext(
      `class MyComponent extends Component {
        foo;
      }`
    );
    node = context.ast.body[0].body.body[0];
    expect(propertyOrder.determinePropertyTypeInNativeClass(node, 'component', [])).toBe(
      'property'
    );
  });
});

describe('reportUnorderedProperties', () => {
  describe('classic classes', () => {
    it('should not report nodes if the order is correct', () => {
      const order = ['controller', 'service', 'query-params'];
      const context = new FauxContext(
        `import {inject as service} from '@ember/service';
        import {inject as controller} from '@ember/controller';
        export default Controller.extend({
          application: controller(),
          currentUser: service(),
          queryParams: [],
        });`,
        '',
        vi.fn()
      );
      const importInjectName = context.ast.body[0].specifiers[0].local.name;
      const importControllerName = context.ast.body[1].specifiers[0].local.name;
      const node = context.ast.body[2].declaration;

      propertyOrder.reportUnorderedProperties(
        node,
        context,
        'controller',
        order,
        undefined,
        importInjectName,
        undefined,
        importControllerName
      );
      expect(context.report).not.toHaveBeenCalled();
    });

    it('should report nodes if the order is incorrect', () => {
      const order = ['controller', 'service', 'query-params'];
      const context = new FauxContext(
        `import {inject as service} from '@ember/service';
        import {inject as controller} from '@ember/controller';
        export default Controller.extend({
            currentUser: service(),
            application: controller(),
            queryParams: [],
          });`,
        '',
        vi.fn()
      );
      const importInjectName = context.ast.body[0].specifiers[0].local.name;
      const importControllerName = context.ast.body[1].specifiers[0].local.name;
      const node = context.ast.body[2].declaration;

      propertyOrder.reportUnorderedProperties(
        node,
        context,
        'controller',
        order,
        undefined,
        importInjectName,
        undefined,
        importControllerName
      );
      expect(context.report).toHaveBeenCalled();
    });
  });

  describe('native classes', () => {
    it('should not report nodes if the order is correct', () => {
      const order = ['controller', 'service', 'query-params'];
      const context = new FauxContext(
        `import {inject as service} from '@ember/service';
        import {inject as controller} from '@ember/controller';
        export default class MyController extends Controller {
            @controller application;
            @service currentUser;
            queryParams = [];
          }`,
        '',
        vi.fn()
      );
      const importInjectName = context.ast.body[0].specifiers[0].local.name;
      const importControllerName = context.ast.body[1].specifiers[0].local.name;
      const node = context.ast.body[2].declaration;

      propertyOrder.reportUnorderedProperties(
        node,
        context,
        'controller',
        order,
        undefined,
        importInjectName,
        undefined,
        importControllerName
      );
      expect(context.report).not.toHaveBeenCalled();
    });

    it('should report nodes if the order is incorrect', () => {
      const order = ['controller', 'service', 'query-params'];
      const context = new FauxContext(
        `import {inject as service} from '@ember/service';
        import {inject as controller} from '@ember/controller';
        export default class MyController extends Controller {
            @service currentUser;
            @controller application;
            queryParams = [];
          }`,
        '',
        vi.fn()
      );
      const importInjectName = context.ast.body[0].specifiers[0].local.name;
      const importControllerName = context.ast.body[1].specifiers[0].local.name;
      const node = context.ast.body[2].declaration;

      propertyOrder.reportUnorderedProperties(
        node,
        context,
        'controller',
        order,
        undefined,
        importInjectName,
        undefined,
        importControllerName
      );
      expect(context.report).toHaveBeenCalled();
    });
  });
});
