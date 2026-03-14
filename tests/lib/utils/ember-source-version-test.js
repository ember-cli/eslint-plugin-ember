'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { isEmberSourceVersionAtLeast } = require('../../../lib/utils/ember-source-version');

describe('ember-source-version', () => {
  describe('isEmberSourceVersionAtLeast', () => {
    let tmpDir;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eslint-plugin-ember-'));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true });
    });

    it('returns true when installed version meets the requirement', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(
        path.join(emberSourceDir, 'package.json'),
        JSON.stringify({ name: 'ember-source', version: '6.8.0' })
      );

      expect(isEmberSourceVersionAtLeast(6, 8, tmpDir)).toBe(true);
    });

    it('returns true when installed version exceeds the requirement', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(
        path.join(emberSourceDir, 'package.json'),
        JSON.stringify({ name: 'ember-source', version: '7.0.0' })
      );

      expect(isEmberSourceVersionAtLeast(6, 8, tmpDir)).toBe(true);
    });

    it('returns true when major version is greater', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(
        path.join(emberSourceDir, 'package.json'),
        JSON.stringify({ name: 'ember-source', version: '7.0.0' })
      );

      expect(isEmberSourceVersionAtLeast(6, 8, tmpDir)).toBe(true);
    });

    it('returns true when major matches and minor is greater', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(
        path.join(emberSourceDir, 'package.json'),
        JSON.stringify({ name: 'ember-source', version: '6.10.0' })
      );

      expect(isEmberSourceVersionAtLeast(6, 8, tmpDir)).toBe(true);
    });

    it('returns true with patch version', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(
        path.join(emberSourceDir, 'package.json'),
        JSON.stringify({ name: 'ember-source', version: '6.8.3' })
      );

      expect(isEmberSourceVersionAtLeast(6, 8, tmpDir)).toBe(true);
    });

    it('returns true with pre-release version that meets requirement', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(
        path.join(emberSourceDir, 'package.json'),
        JSON.stringify({ name: 'ember-source', version: '6.8.0-beta.1' })
      );

      expect(isEmberSourceVersionAtLeast(6, 8, tmpDir)).toBe(true);
    });

    it('returns false when installed version is below the requirement', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(
        path.join(emberSourceDir, 'package.json'),
        JSON.stringify({ name: 'ember-source', version: '6.7.0' })
      );

      expect(isEmberSourceVersionAtLeast(6, 8, tmpDir)).toBe(false);
    });

    it('returns false when major is less', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(
        path.join(emberSourceDir, 'package.json'),
        JSON.stringify({ name: 'ember-source', version: '5.12.0' })
      );

      expect(isEmberSourceVersionAtLeast(6, 8, tmpDir)).toBe(false);
    });

    it('returns false when ember-source is not installed', () => {
      expect(isEmberSourceVersionAtLeast(6, 8, tmpDir)).toBe(false);
    });

    it('returns false when package.json has no version field', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(
        path.join(emberSourceDir, 'package.json'),
        JSON.stringify({ name: 'ember-source' })
      );

      expect(isEmberSourceVersionAtLeast(6, 8, tmpDir)).toBe(false);
    });

    it('returns false when package.json is malformed', () => {
      const emberSourceDir = path.join(tmpDir, 'node_modules', 'ember-source');
      fs.mkdirSync(emberSourceDir, { recursive: true });
      fs.writeFileSync(path.join(emberSourceDir, 'package.json'), 'not json');

      expect(isEmberSourceVersionAtLeast(6, 8, tmpDir)).toBe(false);
    });
  });
});
