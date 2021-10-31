'use strict';

const { readdirSync, readFileSync } = require('fs');
const path = require('path');
const rules = require('../lib').rules;
const recommendedRules = require('../lib/recommended-rules');

const RULE_NAMES = Object.keys(rules);
const RECOMMENDED_RULE_NAMES = Object.keys(recommendedRules).map((name) =>
  name.replace('ember/', '')
);

function getAllNamedOptions(jsonSchema) {
  if (!jsonSchema) {
    return [];
  }

  if (Array.isArray(jsonSchema)) {
    return jsonSchema.map(getAllNamedOptions).flat();
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
    const filePath = path.join(__dirname, '..', 'lib', 'rules');
    const files = readdirSync(filePath);

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

  it('should have tests for all rules', function () {
    const filePath = path.join(__dirname, '..', 'tests', 'lib', 'rules');
    const files = readdirSync(filePath);

    // eslint-disable-next-line jest/prefer-strict-equal
    expect(RULE_NAMES).toEqual(
      files.filter((file) => !file.startsWith('.')).map((file) => file.replace('.js', ''))
    );
  });

  describe('rule files', function () {
    for (const ruleName of RULE_NAMES) {
      const filePath = path.join(__dirname, '..', 'lib', 'rules', `${ruleName}.js`);
      const file = readFileSync(filePath, 'utf8');

      // eslint-disable-next-line jest/valid-title
      describe(ruleName, function () {
        it('should have the jsdoc comment for rule type', function () {
          expect(file).toContain("/** @type {import('eslint').Rule.RuleModule} */");
        });
      });
    }
  });

  describe('test files', function () {
    for (const ruleName of RULE_NAMES) {
      const filePath = path.join(__dirname, '..', 'tests', 'lib', 'rules', `${ruleName}.js`);
      const file = readFileSync(filePath, 'utf8');

      // eslint-disable-next-line jest/valid-title
      describe(ruleName, function () {
        it('should have the right test suite name', function () {
          expect(file).toContain(`.run('${ruleName}'`);
        });
      });
    }
  });

  it('should have documentation for all rules', function () {
    const filePath = path.join(__dirname, '..', 'docs', 'rules');
    const files = readdirSync(filePath);

    // eslint-disable-next-line jest/prefer-strict-equal
    expect(RULE_NAMES).toEqual(
      files
        .filter((file) => !file.startsWith('.') && file !== '_TEMPLATE_.md')
        .map((file) => file.replace('.md', ''))
    );
  });

  describe('rule documentation files', function () {
    const MESSAGES = {
      fixable:
        '🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.',
      configRecommended:
        '✅ The `"extends": "plugin:ember/recommended"` property in a configuration file enables this rule.',
      hasSuggestions:
        '💡 Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).',
    };

    for (const ruleName of RULE_NAMES) {
      const rule = rules[ruleName];
      const filePath = path.join(__dirname, '..', 'docs', 'rules', `${ruleName}.md`);
      const file = readFileSync(filePath, 'utf8');
      const lines = file.split('\n');

      /* eslint-disable jest/no-conditional-expect */
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
            for (const namedOption of getAllNamedOptions(rule.meta.schema)) {
              expect(file).toContain(namedOption);
            }
          } else {
            expect(file).not.toContain('## Configuration');
          }

          // Decide which notices should be shown at the top of the doc.
          const expectedNotices = [];
          const unexpectedNotices = [];
          if (rule.meta.docs.recommended) {
            expectedNotices.push('configRecommended');
          } else {
            unexpectedNotices.push('configRecommended');
          }
          if (rule.meta.fixable) {
            expectedNotices.push('fixable');
          } else {
            unexpectedNotices.push('fixable');
          }
          if (rules[ruleName].meta.hasSuggestions) {
            expectedNotices.push('hasSuggestions');
          } else {
            unexpectedNotices.push('hasSuggestions');
          }

          // Ensure that expected notices are present in the correct order.
          let currentLineNumber = 1;
          for (const expectedNotice of expectedNotices) {
            expect(lines[currentLineNumber]).toBe('');
            expect(lines[currentLineNumber + 1]).toStrictEqual(MESSAGES[expectedNotice]);
            currentLineNumber += 2;
          }

          // Ensure that unexpected notices are not present.
          for (const unexpectedNotice of unexpectedNotices) {
            expect(file).not.toContain(MESSAGES[unexpectedNotice]);
          }
        });
      });
      /* eslint-enable jest/no-conditional-expect */
    }
  });

  it('should mention all rules in the README', function () {
    const filePath = path.join(__dirname, '..', 'README.md');
    const file = readFileSync(filePath, 'utf8');

    for (const ruleName of RULE_NAMES) {
      expect(file).toContain(ruleName);
    }
  });
});
