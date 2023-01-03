/* eslint filenames/match-regex:off */
const { getPathIgnorePattern } = require('eslint-remote-tester-repositories');
const fs = require('fs');

module.exports = {
  /** Repositories to scan */
  repositories: [
    // Several dozen top Ember apps, addons, and engines.
    'DockYard/ember-composable-helpers',
    'adopted-ember-addons/ember-cli-flash',
    'adopted-ember-addons/ember-cli-sass',
    'adopted-ember-addons/ember-cp-validations',
    'adopted-ember-addons/ember-data-model-fragments',
    'adopted-ember-addons/ember-electron',
    'adopted-ember-addons/ember-moment',
    'babel/ember-cli-babel',
    'cibernox/ember-power-select',
    'ef4/ember-auto-import',
    'ember-cli/ember-cli',
    'ember-cli/ember-cli-htmlbars',
    'ember-decorators/ember-decorators',
    'emberjs/data',
    'emberjs/ember-qunit',
    'emberjs/ember.js',
    'jmurphyau/ember-truth-helpers',
    'machty/ember-concurrency',
    'miragejs/ember-cli-mirage',
    'typed-ember/ember-cli-typescript',
  ],

  /** Optional pattern used to exclude paths */
  pathIgnorePattern: getPathIgnorePattern(),

  /** Extensions of files under scanning */
  extensions: ['js', 'ts'],

  /** Optional boolean flag used to enable caching of cloned repositories. For CIs it's ideal to disable caching. Defaults to true. */
  cache: false,

  /** ESLint configuration */
  eslintrc: {
    plugins: ['ember'],
    // Enable all of our rules.
    rules: Object.fromEntries(
      fs
        .readdirSync(`${__dirname}/lib/rules`)
        .map((filename) => `ember/${filename.replace(/\.js$/, '')}`)
        .map((ruleName) => {
          let value;
          // A few rules require additional configuration.
          if (ruleName === 'ember/no-restricted-property-modifications') {
            value = ['error', { properties: ['myProp'] }];
          } else if (ruleName === 'ember/no-restricted-service-injections') {
            value = ['error', { services: ['my-service'] }];
          } else {
            value = 'error';
          }
          return [ruleName, value];
        })
    ),
  },
};
