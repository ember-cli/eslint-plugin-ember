#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { Linter } = require('eslint');

const ETL_DIR = '/Users/psego/Development/OpenSource/ember-template-lint';
const ESLINT_DIR = '/Users/psego/Development/NullVoxPopuli/eslint-plugin-ember-2';
const TMP_DIR = path.join(ESLINT_DIR, '.tmp');

// Ensure .tmp exists
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

// Load parser
const parser = require('ember-eslint-parser/hbs');

// Read rules to process
const rulesText = fs.readFileSync(path.join(TMP_DIR, 'matchable-rules.txt'), 'utf8');
const rules = rulesText
  .trim()
  .split('\n')
  .map((l) => l.replace('MATCH: ', ''));

// ========== String Extraction Helpers ==========

function findMatchingBracket(text, startIdx) {
  const open = text[startIdx];
  const close = open === '[' ? ']' : open === '{' ? '}' : ')';
  let depth = 1;
  let i = startIdx + 1;

  while (i < text.length && depth > 0) {
    const ch = text[i];
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return i;
    }
    // Skip template literals
    else if (ch === '`') {
      i = skipTemplateLiteral(text, i);
      continue;
    }
    // Skip regular strings
    else if (ch === "'" || ch === '"') {
      i = skipString(text, i);
      continue;
    }
    // Skip line comments
    else if (ch === '/' && i + 1 < text.length && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i++;
      continue;
    }
    // Skip block comments
    else if (ch === '/' && i + 1 < text.length && text[i + 1] === '*') {
      i += 2;
      while (i < text.length - 1 && !(text[i] === '*' && text[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    i++;
  }
  return -1;
}

function skipString(text, startIdx) {
  const q = text[startIdx];
  let i = startIdx + 1;
  while (i < text.length && text[i] !== q) {
    if (text[i] === '\\') i++;
    i++;
  }
  return i + 1;
}

function skipTemplateLiteral(text, startIdx) {
  let i = startIdx + 1;
  while (i < text.length && text[i] !== '`') {
    if (text[i] === '\\') {
      i += 2;
      continue;
    }
    if (text[i] === '$' && i + 1 < text.length && text[i + 1] === '{') {
      i += 2;
      let d = 1;
      while (i < text.length && d > 0) {
        if (text[i] === '{') d++;
        else if (text[i] === '}') d--;
        else if (text[i] === '`') {
          i = skipTemplateLiteral(text, i);
          continue;
        } else if (text[i] === "'" || text[i] === '"') {
          i = skipString(text, i);
          continue;
        }
        i++;
      }
      continue;
    }
    i++;
  }
  return i + 1;
}

/**
 * Extract a string literal starting at startIdx.
 * Returns { value, endIdx } or null if not extractable.
 */
function extractStringAt(text, startIdx) {
  const ch = text[startIdx];

  if (ch === "'" || ch === '"') {
    let val = '';
    let i = startIdx + 1;
    while (i < text.length && text[i] !== ch) {
      if (text[i] === '\\') {
        i++;
        if (text[i] === 'n') val += '\n';
        else if (text[i] === 't') val += '\t';
        else if (text[i] === 'r') val += '\r';
        else if (text[i] === '\\') val += '\\';
        else if (text[i] === ch) val += ch;
        else val += text[i];
      } else {
        val += text[i];
      }
      i++;
    }
    return { value: val, endIdx: i };
  }

  if (ch === '`') {
    let val = '';
    let i = startIdx + 1;
    while (i < text.length && text[i] !== '`') {
      if (text[i] === '\\') {
        i++;
        if (text[i] === 'n') val += '\n';
        else if (text[i] === 't') val += '\t';
        else if (text[i] === 'r') val += '\r';
        else if (text[i] === '\\') val += '\\';
        else if (text[i] === '`') val += '`';
        else val += text[i];
      } else if (text[i] === '$' && i + 1 < text.length && text[i + 1] === '{') {
        // Template expression - can't extract statically
        return null;
      } else {
        val += text[i];
      }
      i++;
    }
    return { value: val, endIdx: i };
  }

  return null;
}

// ========== ETL Data Extraction ==========

function extractArraySection(content, propName) {
  const regex = new RegExp('\\b' + propName + '\\s*:\\s*\\[');
  const match = regex.exec(content);
  if (!match) return null;

  const bracketIdx = content.indexOf('[', match.index);
  const endIdx = findMatchingBracket(content, bracketIdx);
  if (endIdx === -1) return null;

  return content.slice(bracketIdx + 1, endIdx);
}

function extractStandaloneStrings(section) {
  const templates = [];
  let i = 0;
  let depth = 0;

  while (i < section.length) {
    const ch = section[i];

    if (ch === '{' || ch === '[' || ch === '(') {
      depth++;
      i++;
      continue;
    }
    if (ch === '}' || ch === ']' || ch === ')') {
      depth--;
      i++;
      continue;
    }

    // Skip line comments
    if (ch === '/' && i + 1 < section.length && section[i + 1] === '/') {
      while (i < section.length && section[i] !== '\n') i++;
      continue;
    }
    // Skip block comments
    if (ch === '/' && i + 1 < section.length && section[i + 1] === '*') {
      i += 2;
      while (i < section.length - 1 && !(section[i] === '*' && section[i + 1] === '/')) i++;
      i += 2;
      continue;
    }

    if (depth === 0 && (ch === "'" || ch === '"' || ch === '`')) {
      const result = extractStringAt(section, i);
      if (result) {
        templates.push(result.value);
        i = result.endIdx + 1;
        continue;
      } else {
        // Template literal with expressions, skip
        i = skipTemplateLiteral(section, i);
        continue;
      }
    }

    // Skip strings inside objects/arrays
    if (depth > 0 && (ch === "'" || ch === '"' || ch === '`')) {
      if (ch === '`') {
        i = skipTemplateLiteral(section, i);
      } else {
        i = skipString(section, i);
      }
      continue;
    }

    i++;
  }

  return templates;
}

function extractTemplateProps(section) {
  const templates = [];
  const regex = /\btemplate\s*:\s*/g;
  let m;
  while ((m = regex.exec(section)) !== null) {
    const afterColon = m.index + m[0].length;
    if (afterColon < section.length) {
      const ch = section[afterColon];
      if (ch === "'" || ch === '"' || ch === '`') {
        const result = extractStringAt(section, afterColon);
        if (result) {
          templates.push(result.value);
        }
      }
    }
  }
  return templates;
}

function extractBadEntries(section) {
  const entries = [];
  const regex = /\btemplate\s*:\s*/g;
  let m;
  while ((m = regex.exec(section)) !== null) {
    const afterColon = m.index + m[0].length;
    if (afterColon >= section.length) continue;

    const ch = section[afterColon];
    if (ch === "'" || ch === '"' || ch === '`') {
      const result = extractStringAt(section, afterColon);
      if (result) {
        const entry = { template: result.value };

        // Look for fixedTemplate near this template
        const searchAfter = section.slice(result.endIdx);
        const fixMatch = searchAfter.match(/\bfixedTemplate\s*:\s*/);
        if (fixMatch && fixMatch.index < 500) {
          const fixStartInSection = result.endIdx + fixMatch.index + fixMatch[0].length;
          const fixCh = section[fixStartInSection];
          if (fixCh === "'" || fixCh === '"' || fixCh === '`') {
            const fixResult = extractStringAt(section, fixStartInSection);
            if (fixResult) {
              entry.fixedTemplate = fixResult.value;
            }
          }
        }

        entries.push(entry);
      }
    }
  }
  return entries;
}

function extractETLData(etlContent) {
  const goodTemplates = [];
  const badEntries = [];

  const goodSection = extractArraySection(etlContent, 'good');
  if (goodSection) {
    goodTemplates.push(...extractStandaloneStrings(goodSection));
    goodTemplates.push(...extractTemplateProps(goodSection));
  }

  const badSection = extractArraySection(etlContent, 'bad');
  if (badSection) {
    badEntries.push(...extractBadEntries(badSection));
  }

  return { goodTemplates, badEntries };
}

// ========== Code Generation ==========

function formatJSString(s) {
  if (s === null || s === undefined) return 'null';

  const hasNewlines = s.includes('\n');
  const hasSingleQuotes = s.includes("'");

  if (hasNewlines || hasSingleQuotes) {
    let escaped = s;
    escaped = escaped.replace(/\\/g, '\\\\');
    escaped = escaped.replace(/`/g, '\\`');
    escaped = escaped.replace(/\$\{/g, '\\${');
    return '`' + escaped + '`';
  }

  return "'" + s.replace(/\\/g, '\\\\') + "'";
}

function generateHbsBlock(ruleName, validCases, invalidCases) {
  const lines = [];
  lines.push('');
  lines.push('const hbsRuleTester = new RuleTester({');
  lines.push("  parser: require.resolve('ember-eslint-parser/hbs'),");
  lines.push('  parserOptions: {');
  lines.push('    ecmaVersion: 2022,');
  lines.push("    sourceType: 'module',");
  lines.push('  },');
  lines.push('});');
  lines.push('');
  lines.push(`hbsRuleTester.run('${ruleName}', rule, {`);
  lines.push('  valid: [');

  for (const v of validCases) {
    const formatted = formatJSString(v);
    if (formatted.includes('\n')) {
      lines.push(`    ${formatted},`);
    } else {
      lines.push(`    ${formatted},`);
    }
  }

  lines.push('  ],');
  lines.push('  invalid: [');

  for (const inv of invalidCases) {
    lines.push('    {');
    lines.push(`      code: ${formatJSString(inv.code)},`);
    if (inv.output === null) {
      lines.push('      output: null,');
    } else {
      lines.push(`      output: ${formatJSString(inv.output)},`);
    }
    lines.push('      errors: [');
    for (const err of inv.errors) {
      lines.push(`        { message: ${formatJSString(err.message)} },`);
    }
    lines.push('      ],');
    lines.push('    },');
  }

  lines.push('  ],');
  lines.push('});');
  lines.push('');

  return lines.join('\n');
}

// ========== Main ==========

const linter = new Linter();
linter.defineParser('hbs', parser);

const stats = { ok: 0, skip: 0, error: 0, noTemplates: 0, noCases: 0 };
const details = [];

for (const ruleName of rules) {
  const etlName = ruleName.replace('template-', '');
  const etlTestPath = path.join(ETL_DIR, `test/unit/rules/${etlName}-test.js`);
  const eslintTestPath = path.join(ESLINT_DIR, `tests/lib/rules/${ruleName}.js`);

  // Check if already done
  const eslintContent = fs.readFileSync(eslintTestPath, 'utf8');
  if (eslintContent.includes('hbsRuleTester')) {
    details.push(`SKIP (done): ${ruleName}`);
    stats.skip++;
    continue;
  }

  // Read ETL test
  let etlContent;
  try {
    etlContent = fs.readFileSync(etlTestPath, 'utf8');
  } catch (e) {
    details.push(`SKIP (no ETL): ${ruleName}`);
    stats.skip++;
    continue;
  }

  // Extract templates
  const { goodTemplates, badEntries } = extractETLData(etlContent);

  if (goodTemplates.length === 0 && badEntries.length === 0) {
    details.push(`SKIP (no templates extracted): ${ruleName}`);
    stats.noTemplates++;
    continue;
  }

  // Load rule
  let ruleModule;
  try {
    ruleModule = require(path.join(ESLINT_DIR, `lib/rules/${ruleName}.js`));
  } catch (e) {
    details.push(`ERROR (rule load): ${ruleName} - ${e.message}`);
    stats.error++;
    continue;
  }

  const isFixable = !!(ruleModule.meta && ruleModule.meta.fixable);

  // Register rule with linter
  const ruleId = `rule-${ruleName}`;
  linter.defineRule(ruleId, ruleModule);

  const lintConfig = {
    parser: 'hbs',
    parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    rules: { [ruleId]: 'error' },
  };

  // Deduplicate templates
  const seenTemplates = new Set();

  // Verify good templates
  const validCases = [];
  for (const t of goodTemplates) {
    if (seenTemplates.has(t)) continue;
    seenTemplates.add(t);

    try {
      const messages = linter.verify(t, lintConfig);
      const parseErrors = messages.filter((m) => m.fatal);
      const ruleErrors = messages.filter((m) => m.ruleId === ruleId);
      if (parseErrors.length === 0 && ruleErrors.length === 0) {
        validCases.push(t);
      }
    } catch (e) {
      // Skip unparseable templates
    }
  }

  // Verify bad templates
  const invalidCases = [];
  for (const { template, fixedTemplate } of badEntries) {
    if (seenTemplates.has(template)) continue;
    seenTemplates.add(template);

    try {
      const messages = linter.verify(template, lintConfig);
      const parseErrors = messages.filter((m) => m.fatal);
      const ruleErrors = messages.filter((m) => m.ruleId === ruleId);

      if (parseErrors.length > 0) continue;
      if (ruleErrors.length === 0) continue;

      const testCase = {
        code: template,
        errors: ruleErrors.map((e) => ({ message: e.message })),
        output: null,
      };

      if (isFixable) {
        try {
          const fixResult = linter.verifyAndFix(template, lintConfig);
          if (fixResult.fixed) {
            testCase.output = fixResult.output;
          }
        } catch (e) {
          // Skip fix if it fails
        }
      }

      invalidCases.push(testCase);
    } catch (e) {
      // Skip
    }
  }

  if (validCases.length === 0 && invalidCases.length === 0) {
    details.push(
      `SKIP (no valid cases after linting): ${ruleName} [extracted ${goodTemplates.length}G/${badEntries.length}B]`
    );
    stats.noCases++;
    continue;
  }

  // Generate and append
  const block = generateHbsBlock(ruleName, validCases, invalidCases);
  fs.writeFileSync(eslintTestPath, eslintContent + block);

  details.push(`OK: ${ruleName} (${validCases.length}V/${invalidCases.length}I)`);
  stats.ok++;
}

// Print results
for (const d of details) {
  console.log(d);
}
console.log(
  `\nSummary: ${stats.ok} OK, ${stats.skip} skipped, ${stats.noTemplates} no-templates, ${stats.noCases} no-cases, ${stats.error} errors`
);
