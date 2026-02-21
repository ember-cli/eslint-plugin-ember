// Script to fix autofix test failures by running each rule and capturing fix output
const { Linter } = require('eslint');
const fs = require('fs');
const path = require('path');

const ROOT = '/Users/psego/Development/NullVoxPopuli/eslint-plugin-ember-2';

// Rules with autofix failures
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
  const testPath = path.join(ROOT, 'tests/lib/rules', `${ruleName}.js`);
  let testContent = fs.readFileSync(testPath, 'utf8');
  
  // Find all invalid test cases with output: null
  // Pattern: code: `...`, followed by output: null
  const regex = /code:\s*`([^`]+)`[^}]*?output:\s*null/g;
  let match;
  const replacements = [];
  
  while ((match = regex.exec(testContent)) !== null) {
    const code = match[1];
    replacements.push({
      fullMatch: match[0],
      code,
    });
  }
  
  if (replacements.length === 0) continue;
  
  // Load the rule
  const ruleModule = require(path.join(ROOT, 'lib/rules', `${ruleName}.js`));
  
  const linter = new Linter();
  linter.defineParser('ember-eslint-parser', require(path.join(ROOT, 'node_modules/ember-eslint-parser')));
  linter.defineRule(ruleName, ruleModule);
  
  for (const rep of replacements) {
    const code = rep.code;
    // Wrap in gjs format for the parser
    const config = {
      parser: 'ember-eslint-parser',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      rules: {
        [ruleName]: 'error',
      },
    };
    
    try {
      const messages = linter.verify(code, config, { filename: 'test.gjs' });
      const result = linter.verifyAndFix(code, config, { filename: 'test.gjs' });
      
      if (result.output !== code) {
        // Rule provided a fix
        const fixedOutput = result.output;
        console.log(`[${ruleName}] Code: ${code}`);
        console.log(`  Fixed: ${fixedOutput}`);
        
        // Replace output: null with the fixed output
        const escaped = fixedOutput.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
        testContent = testContent.replace(
          `code: \`${code}\`,\n        output: null`,
          `code: \`${code}\`,\n        output: \`${escaped}\``
        );
        // Also try with different indentation
        testContent = testContent.replace(
          `code: \`${code}\`,\n      output: null`,
          `code: \`${code}\`,\n      output: \`${escaped}\``
        );
      } else {
        console.log(`[${ruleName}] No fix for: ${code}`);
      }
    } catch (e) {
      console.log(`[${ruleName}] Error for: ${code} - ${e.message}`);
    }
  }
  
  fs.writeFileSync(testPath, testContent);
  console.log(`Updated ${testPath}`);
}
