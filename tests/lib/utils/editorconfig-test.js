'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { resolveEditorConfig } = require('../../../lib/utils/editorconfig');

describe('resolveEditorConfig', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'editorconfig-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns empty object when no .editorconfig exists', () => {
    const filePath = path.join(tmpDir, 'test.hbs');
    const result = resolveEditorConfig(filePath);
    expect(result).toEqual({});
  });

  it('reads indent_size from .editorconfig', () => {
    fs.writeFileSync(
      path.join(tmpDir, '.editorconfig'),
      ['root = true', '', '[*]', 'indent_size = 4'].join('\n')
    );
    const filePath = path.join(tmpDir, 'test.hbs');
    const result = resolveEditorConfig(filePath);
    expect(result.indent_size).toBe(4);
  });

  it('matches *.hbs sections', () => {
    fs.writeFileSync(
      path.join(tmpDir, '.editorconfig'),
      ['root = true', '', '[*.hbs]', 'indent_size = 3'].join('\n')
    );
    const filePath = path.join(tmpDir, 'test.hbs');
    const result = resolveEditorConfig(filePath);
    expect(result.indent_size).toBe(3);
  });

  it('does not match non-matching glob', () => {
    fs.writeFileSync(
      path.join(tmpDir, '.editorconfig'),
      ['root = true', '', '[*.js]', 'indent_size = 4'].join('\n')
    );
    const filePath = path.join(tmpDir, 'test.hbs');
    const result = resolveEditorConfig(filePath);
    expect(result.indent_size).toBeUndefined();
  });

  it('handles brace expansion *.{hbs,gjs}', () => {
    fs.writeFileSync(
      path.join(tmpDir, '.editorconfig'),
      ['root = true', '', '[*.{hbs,gjs}]', 'indent_size = 6'].join('\n')
    );
    expect(resolveEditorConfig(path.join(tmpDir, 'test.hbs')).indent_size).toBe(6);
    expect(resolveEditorConfig(path.join(tmpDir, 'test.gjs')).indent_size).toBe(6);
    expect(resolveEditorConfig(path.join(tmpDir, 'test.js')).indent_size).toBeUndefined();
  });

  it('later sections override earlier ones', () => {
    fs.writeFileSync(
      path.join(tmpDir, '.editorconfig'),
      ['root = true', '', '[*]', 'indent_size = 2', '', '[*.hbs]', 'indent_size = 4'].join('\n')
    );
    const filePath = path.join(tmpDir, 'test.hbs');
    const result = resolveEditorConfig(filePath);
    expect(result.indent_size).toBe(4);
  });

  it('inner .editorconfig overrides outer', () => {
    // outer
    fs.writeFileSync(
      path.join(tmpDir, '.editorconfig'),
      ['root = true', '', '[*]', 'indent_size = 2'].join('\n')
    );
    // inner dir
    const innerDir = path.join(tmpDir, 'app');
    fs.mkdirSync(innerDir);
    fs.writeFileSync(path.join(innerDir, '.editorconfig'), ['[*]', 'indent_size = 4'].join('\n'));
    const filePath = path.join(innerDir, 'test.hbs');
    const result = resolveEditorConfig(filePath);
    expect(result.indent_size).toBe(4);
  });

  it('sets indent_size to tab when indent_style is tab and indent_size unset', () => {
    fs.writeFileSync(
      path.join(tmpDir, '.editorconfig'),
      ['root = true', '', '[*]', 'indent_style = tab'].join('\n')
    );
    const filePath = path.join(tmpDir, 'test.hbs');
    const result = resolveEditorConfig(filePath);
    expect(result.indent_style).toBe('tab');
    expect(result.indent_size).toBe('tab');
  });

  it('ignores comments', () => {
    fs.writeFileSync(
      path.join(tmpDir, '.editorconfig'),
      ['root = true', '# a comment', '; another comment', '[*]', 'indent_size = 5'].join('\n')
    );
    const filePath = path.join(tmpDir, 'test.hbs');
    const result = resolveEditorConfig(filePath);
    expect(result.indent_size).toBe(5);
  });
});
