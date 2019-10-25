'use strict';

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const assert = require('assert');
const rules = require('../lib/index.js').rules;
const recommendedRules = require('../lib/recommended-rules.js');

const RULE_NAMES = Object.keys(rules);

describe('rules setup is correct', function() {
  it('should have a list of exported rules and rules directory that match', function() {
    const path = join(__dirname, '../lib/rules');
    const files = readdirSync(path);

    // eslint-disable-next-line node/no-deprecated-api
    assert.deepEqual(
      RULE_NAMES,
      files.filter(file => !file.startsWith('.')).map(file => file.replace('.js', ''))
    );
  });

  it('should list all rules in the recommended rules file', function() {
    assert.deepStrictEqual(
      RULE_NAMES,
      Object.keys(recommendedRules).map(file => file.replace('ember/', ''))
    );
  });

  it('should have tests for all rules', function() {
    const path = join(__dirname, '../tests/lib/rules');
    const files = readdirSync(path);

    // eslint-disable-next-line node/no-deprecated-api
    assert.deepEqual(
      RULE_NAMES,
      files.filter(file => !file.startsWith('.')).map(file => file.replace('.js', ''))
    );
  });

  it('should have documentation for all rules', function() {
    const path = join(__dirname, '../docs/rules');
    const files = readdirSync(path);

    // eslint-disable-next-line node/no-deprecated-api
    assert.deepEqual(
      RULE_NAMES,
      files
        .filter(file => !file.startsWith('.') && file !== '_TEMPLATE_.md')
        .map(file => file.replace('.md', ''))
    );
  });

  it('should mention all rules in the README', function() {
    const path = join(__dirname, '../README.md');
    const file = readFileSync(path);

    RULE_NAMES.forEach(ruleName => assert.ok(file.includes(ruleName)));
  });
});
