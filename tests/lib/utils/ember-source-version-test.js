'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  getEmberSourceVersion,
  isVersionAtLeast,
} = require('../../../lib/utils/ember-source-version');

describe('ember-source-version', () => {
  describe('isVersionAtLeast', () => {
    it('returns true when major version is greater', () => {
      expect(isVersionAtLeast('7.0.0', 6, 8)).toBe(true);
    });

    it('returns true when major matches and minor is greater', () => {
      expect(isVersionAtLeast('6.10.0', 6, 8)).toBe(true);
    });

    it('returns true when major and minor match exactly', () => {
      expect(isVersionAtLeast('6.8.0', 6, 8)).toBe(true);
    });

    it('returns true when major and minor match with patch version', () => {
      expect(isVersionAtLeast('6.8.3', 6, 8)).toBe(true);
    });

    it('returns false when major matches but minor is less', () => {
      expect(isVersionAtLeast('6.7.0', 6, 8)).toBe(false);
    });

    it('returns false when major is less', () => {
      expect(isVersionAtLeast('5.12.0', 6, 8)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isVersionAtLeast(null, 6, 8)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isVersionAtLeast(undefined, 6, 8)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isVersionAtLeast('', 6, 8)).toBe(false);
    });

    it('returns false for non-string input', () => {
      expect(isVersionAtLeast(123, 6, 8)).toBe(false);
    });

    it('returns false for invalid version string', () => {
      expect(isVersionAtLeast('invalid', 6, 8)).toBe(false);
    });

    it('handles pre-release versions', () => {
      expect(isVersionAtLeast('6.8.0-beta.1', 6, 8)).toBe(true);
    });

    it('handles two-part version strings', () => {
      expect(isVersionAtLeast('6.8', 6, 8)).toBe(true);
    });

    it('checks against 0.0 minimum', () => {
      expect(isVersionAtLeast('0.0.1', 0, 0)).toBe(true);
    });
  });

  describe('getEmberSourceVersion', () => {
    let tmpDir;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eslint-plugin-ember-'));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true });
    });

    it('returns null when ember-source is not installed', () => {
      expect(getEmberSourceVersion(tmpDir)).toBeNull();
    });

    it('returns the version when ember-source is installed', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(
        path.join(emberSourceDir, 'package.json'),
        JSON.stringify({ name: 'ember-source', version: '6.8.0' })
      );

      expect(getEmberSourceVersion(tmpDir)).toBe('6.8.0');
    });

    it('returns null when package.json has no version field', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(
        path.join(emberSourceDir, 'package.json'),
        JSON.stringify({ name: 'ember-source' })
      );

      expect(getEmberSourceVersion(tmpDir)).toBeNull();
    });

    it('returns null when package.json is malformed', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(path.join(emberSourceDir, 'package.json'), 'not json');

      expect(getEmberSourceVersion(tmpDir)).toBeNull();
    });

    it('handles pre-release versions', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(
        path.join(emberSourceDir, 'package.json'),
        JSON.stringify({ name: 'ember-source', version: '7.0.0-beta.1' })
      );

      expect(getEmberSourceVersion(tmpDir)).toBe('7.0.0-beta.1');
    });
  });
});
