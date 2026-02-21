const { Linter } = require('eslint');
const fs = require('fs');
const path = require('path');

const ROOT = '/Users/psego/Development/NullVoxPopuli/eslint-plugin-ember-2';

const rules = [
  'template-no-autofocus-attribute',
  'template-no-accesskey-attribute',
  'template-no-unnecessary-curly-parens',
  'template-require-button-type',
  'template-no-html-comments',
  'template-no-unnecessary-component-helper',
  'template-no-aria-hidden-body',
  'template-modifier-name-case',
];

for (const ruleName of rules) {
  const testPath = path.join(ROOT, 'tests/lib/rules', ruleName + '.js');
  let testContent = fs.readFileSync(testPath, 'utf8');

  const regex = /code:\s*(['`])((?:(?!\1).|\n)*?)\1,\s*\n\s*output:\s*null/g;
  let match;
  const replacements = [];

  while ((match = regex.exec(testContent)) !== null) {
    replacements.push({
      fullMatch: match[0],
      quote: match[1],
      code: match[2],
    });
  }

  if (replacements.length === 0) {
    console.log('[' + ruleName + '] No output:null cases found');
    continue;
  }

  console.log('[' + ruleName + '] Found ' + replacements.length + ' cases');

  const ruleModule = require(path.join(ROOT, 'lib/rules', ruleName + '.js'));

  const linter = new Linter();
  linter.defineParser('ember-eslint-parser', require('ember-eslint-parser'));
  linter.defineRule(ruleName, ruleModule);

  let changed = 0;
  for (const rep of replacements) {
    const code = rep.code;
    const config = {
      parser: 'ember-eslint-parser',
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      rules: { [ruleName]: 'error' },
    };

    try {
      const result = linter.verifyAndFix(code, config, { filename: 'test.gjs' });

      if (result.output !== code) {
        const fixedOutput = result.output;
        const escaped = fixedOutput.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
        const oldStr = rep.fullMatch;
        const newStr = oldStr.replace('output: null', 'output: `' + escaped + '`');
        testContent = testContent.replace(oldStr, newStr);
        changed++;
        console.log('  OK: ' + code.substring(0, 50));
      } else {
        console.log('  NOFIX: ' + code.substring(0, 50));
      }
    } catch (e) {
      console.log('  ERR: ' + e.message.substring(0, 80));
    }
  }

  fs.writeFileSync(testPath, testContent);
  console.log('  Changed ' + changed + '/' + replacements.length);
}
