//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/decorator-position');
const RuleTester = require('eslint').RuleTester;

// const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const code = `
import { tracked } from '@glimmer/tracking';
import { computed, action } from '@ember/object';
import { reads } from '@ember/object/computed';

export default class extends Component {
  @tracked tracked1;

  @tracked
  tracked2;

  @tracked
  tracked3 = '3';

  @computed
  get computed1() {}

  @computed get computed2() {}

  @computed('key') get computed3() {}

  @computed('key')
  get computed4() {}

  @reads('key') read1;

  @reads('key')
  read2;

  @dependentKeyCompat
  get dep1() { return 1; }

  @dependentKeyCompat get dep2() { return 1; }

  @action action1() {}

  @action
  action2() {}
}
`;

const defaultOptions = {
  trackedOnSameLine: true,
  computedWithArgumentsOnSameLine: false,
  emberDataOnSameLine: true,

  computedWithoutArgumentsOnSameLine: true,
  actionOnSameLine: true,
  dependentKeyCompatOnSameLine: false,
};

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
});

ruleTester.run('decorator-position', rule, {
  valid: [
    {
      code: `
        import { tracked } from '@glimmer/tracking';
        export default class extends Component {
          @tracked foo;
        }
      `,
      options: [{ trackedOnSameLine: true }],
    },
    {
      code: `
        import { tracked } from '@glimmer/tracking';
        export default class extends Component {
          @tracked
          foo;
        }
      `,
      options: [{ trackedOnSameLine: false }],
    },
    {
      code: `
        import { tracked as t } from '@glimmer/tracking';
        export default class extends Component {
          @t foo;
        }
      `,
      options: [{ trackedOnSameLine: true }],
    },
  ],
  invalid: [
    {
      code: `
        import { tracked } from '@glimmer/tracking';
        export default class extends Component {
          @tracked foo;
        }
      `,
      options: [{ trackedOnSameLine: false }],
    },
    {
      code: `
        import { tracked } from '@glimmer/tracking';
        export default class extends Component {
          @tracked
          foo;
        }
      `,
      options: [{ trackedOnSameLine: true }],
    },
    {
      code: `
        import { tracked as t } from '@glimmer/tracking';
        export default class extends Component {
          @t foo;
        }
      `,
      options: [{ trackedOnSameLine: false }],
    },
  ],
});
