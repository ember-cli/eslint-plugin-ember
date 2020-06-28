'use strict';

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const rules = require('../lib').rules;
const recommendedRules = require('../lib/recommended-rules.js');
const octaneRules = require('../lib/octane-rules.js');
const { flat } = require('../lib/utils/javascript');

const RULE_NAMES = Object.keys(rules);
const RECOMMENDED_RULE_NAMES = Object.keys(recommendedRules).map((name) =>
  name.replace('ember/', '')
);
const OCTANE_RULE_NAMES = Object.keys(octaneRules).map((name) => name.replace('ember/', ''));

function getAllNamedOptions(jsonSchema) {
  if (!jsonSchema) {
    return [];
  }

  if (Array.isArray(jsonSchema)) {
    return flat(jsonSchema.map(getAllNamedOptions));
  }

  if (jsonSchema.items) {
    return getAllNamedOptions(jsonSchema.items);
  }

  if (jsonSchema.properties) {
    return Object.keys(jsonSchema.properties);
  }

  return [];
}

describe('rules setup is correct', function () {
  it('should have a list of exported rules and rules directory that match', function () {
    const path = join(__dirname, '..', 'lib', 'rules');
    const files = readdirSync(path);

    // eslint-disable-next-line jest/prefer-strict-equal
    expect(RULE_NAMES).toEqual(
      files.filter((file) => !file.startsWith('.')).map((file) => file.replace('.js', ''))
    );
  });

  it('should list all recommended rules in the recommended rules file', function () {
    const recommendedRuleNamesFromMeta = RULE_NAMES.filter(
      (key) => rules[key].meta.docs.recommended
    );
    expect(RECOMMENDED_RULE_NAMES).toStrictEqual(recommendedRuleNamesFromMeta);
  });

  it('should list all octane rules in the octane rules file', function () {
    const octaneRuleNamesFromMeta = RULE_NAMES.filter((key) => rules[key].meta.docs.octane);
    expect(OCTANE_RULE_NAMES).toStrictEqual(octaneRuleNamesFromMeta);
  });

  it('should have tests for all rules', function () {
    const path = join(__dirname, '..', 'tests', 'lib', 'rules');
    const files = readdirSync(path);

    // eslint-disable-next-line jest/prefer-strict-equal
    expect(RULE_NAMES).toEqual(
      files.filter((file) => !file.startsWith('.')).map((file) => file.replace('.js', ''))
    );
  });

  it('should have documentation for all rules', function () {
    const path = join(__dirname, '..', 'docs', 'rules');
    const files = readdirSync(path);

    // eslint-disable-next-line jest/prefer-strict-equal
    expect(RULE_NAMES).toEqual(
      files
        .filter((file) => !file.startsWith('.') && file !== '_TEMPLATE_.md')
        .map((file) => file.replace('.md', ''))
    );
  });

  describe('rule documentation files', function () {
    const CONFIG_MSG_RECOMMENDED =
      ':white_check_mark: The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.';
    const CONFIG_MSG_OCTANE =
      ':car: The `"extends": "plugin:ember/octane"` property in a configuration file enables this rule.';

    const FIXABLE_MSG =
      ':wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.';

    RULE_NAMES.forEach((ruleName) => {
      const rule = rules[ruleName];
      const path = join(__dirname, '..', 'docs', 'rules', `${ruleName}.md`);
      const file = readFileSync(path, 'utf8');

      // eslint-disable-next-line jest/valid-title
      describe(ruleName, function () {
        it('should have the right contents (title, examples, notices)', function () {
          expect(file).toContain(`# ${ruleName}`); // Title header.
          expect(file).toContain('## Examples'); // Examples section header.

          // Check if the rule has configuration options.
          if (
            (Array.isArray(rule.meta.schema) && rule.meta.schema.length > 0) ||
            (typeof rule.meta.schema === 'object' && Object.keys(rule.meta.schema).length > 0)
          ) {
            // Should have a configuration section header:
            expect(file).toContain('## Configuration');

            // Ensure all configuration options are mentioned.
            getAllNamedOptions(rule.meta.schema).forEach((namedOption) =>
              expect(file).toContain(namedOption)
            );
          } else {
            expect(file).not.toContain('## Configuration');
          }

          if (rule.meta.fixable === 'code') {
            expect(file).toContain(FIXABLE_MSG);
          } else {
            expect(file).not.toContain(FIXABLE_MSG);
          }

          if (rule.meta.docs.recommended) {
            expect(file).toContain(CONFIG_MSG_RECOMMENDED);
          } else {
            expect(file).not.toContain(CONFIG_MSG_RECOMMENDED);
          }

          if (rule.meta.docs.octane) {
            expect(file).toContain(CONFIG_MSG_OCTANE);
          } else {
            expect(file).not.toContain(CONFIG_MSG_OCTANE);
          }
        });
      });
    });
  });

  it('should mention all rules in the README', function () {
    const path = join(__dirname, '..', 'README.md');
    const file = readFileSync(path, 'utf8');

    RULE_NAMES.forEach((ruleName) => expect(file).toContain(ruleName));
  });
});
