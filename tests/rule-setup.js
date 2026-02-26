'use strict';

const { readdirSync, readFileSync } = require('fs');
const path = require('path');
const rules = require('../lib').rules;
const recommendedRules = require('../lib/recommended-rules');

const RULE_NAMES = Object.keys(rules);
const RECOMMENDED_RULE_NAMES = Object.keys(recommendedRules).map((name) =>
  name.replace('ember/', '')
);

describe('rules setup is correct', function () {
  it('should have a list of exported rules and rules directory that match', function () {
    const filePath = path.join(__dirname, '..', 'lib', 'rules');
    const files = readdirSync(filePath);

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

    expect(RULE_NAMES).toEqual(
      files.filter((file) => !file.startsWith('.')).map((file) => file.replace('.js', ''))
    );
  });

  describe('rule files', function () {
    for (const ruleName of RULE_NAMES) {
      const filePath = path.join(__dirname, '..', 'lib', 'rules', `${ruleName}.js`);
      const file = readFileSync(filePath, 'utf8');

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

    expect(RULE_NAMES).toEqual(
      files
        .filter((file) => !file.startsWith('.') && file !== '_TEMPLATE_.md')
        .map((file) => file.replace('.md', ''))
    );
  });

  it('should mention all rules in the README', function () {
    const filePath = path.join(__dirname, '..', 'README.md');
    const file = readFileSync(filePath, 'utf8');

    for (const ruleName of RULE_NAMES) {
      expect(file).toContain(ruleName);
    }
  });
});
