// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-callback-leaks-in-ember-objects');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------


const message = "Event listeners and interval timers must be unregistered or ensure that the context they're registered with is destroyed, when no longer needed.";

const eslintTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
});
eslintTester.run('no-callback-leaks-in-ember-objects', rule, {
  valid: [
    {
      code: `
export default Ember.Component.extend({
  didInsertElement() {
    if (this.get('onScroll')) {
      this._onScrollHandler = (...args) => this.get('onScroll')(...args);
      window.addEventListener('scroll', this._onScrollHandler);
    }
  },

  willDestroyElement() {
    window.removeEventListener("scroll", this._onScrollHandler);
    this._super(...arguments);
  }
});`,
    },
    {
      code: `
import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    if (this.get('onScroll')) {
      this._onScrollHandler = (...args) => this.get('onScroll')(...args);
      window.addEventListener('scroll', this._onScrollHandler);
    }
  },

  willDestroyElement() {
    window.removeEventListener("scroll", this._onScrollHandler);
    this._super(...arguments);
  }
});
      `,
    },
    {
      code: `
import Component from '@ember/component';

export default Component.extend({});`,
    },
    {
      code: `
export default Ember.Service.extend({
  init() {
    if (this.get('onScroll')) {
      this._onScrollHandler = (...args) => this.get('onScroll')(...args);
      window.addEventListener('scroll', this._onScrollHandler);
    }
  },

  willDestroy() {
    window.removeEventListener("scroll", this._onScrollHandler);
    this._super(...arguments);
  }
});`,
    },
  ],
  invalid: [
    {
      code: `
      export default Ember.Component.extend({ 
        didInsertElement() { 
          if (this.get("onScroll")) { 
            window.addEventListener("scroll", (...args) => this.get("onScroll")(...args)); 
          } 
        } 
      });`,
      output: null,
      errors: [{
        message,
      }],
    },
    {
      code: `
import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    if (this.get('onScroll')) {
      window.addEventListener('scroll', (...args) => this.get('onScroll')(...args));
    }
  }
});`,
      output: null,
      errors: [{
        message,
      }],
    },
    {
      code: `
export default Ember.Service.extend({
  init() {
    if (this.get('onScroll')) {
      window.addEventListener('scroll', (...args) => this.get('onScroll')(...args));
    }
  }
});
      `,
      output: null,
      errors: [{
        message,
      }],
    },
    {
      code: `
import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    if (this.get('onScroll')) {
      window.addEventListener('scroll', (...args) => this.get('onScroll')(...args));
    }
  },

  willDestroyElement() {
    this._super(...arguments);
  }

});
      `,
      output: null,
      errors: [{
        message,
      }],
    },


  ],
});
