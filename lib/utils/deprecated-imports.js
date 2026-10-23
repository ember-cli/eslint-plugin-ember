'use strict';

/**
 * Import-based deprecations from ember-source, used by `ember/no-deprecated-imports`.
 *
 * Each entry describes one deprecation id for one import path:
 *
 * - `source`: the module path being imported
 * - `exports`: the deprecated export names (`'default'` for the default export),
 *   or `null` when the whole module is deprecated
 * - `id`: the deprecation id as registered in ember-source
 *   (packages/@ember/-internals/deprecations/index.ts)
 * - `since.available` / `since.enabled`: ember-source versions from the registry.
 *   The rule reports from `enabled` when set, otherwise from `available`.
 * - `until`: the version the API is removed in
 * - `replacement`: a short migration hint shown in the lint message
 * - `url`: the deprecation guide, or the RFC when no guide is published yet
 * - `status`: where the implementation stands in ember-source:
 *   `released` (published to npm, prereleases included), `merged` (on main, not yet
 *   published), `pr` (open PR), or `draft` (draft PR)
 *
 * When an implementation PR lands or changes, update the versions and status here.
 */

const RFC_1003 = 'https://github.com/emberjs/rfcs/pull/1003';
const RFC_1111 = 'https://github.com/emberjs/rfcs/pull/1111';
const RFC_1112 = 'https://github.com/emberjs/rfcs/pull/1112';
const RFC_1114 = 'https://github.com/emberjs/rfcs/pull/1114';
const RFC_1116 = 'https://github.com/emberjs/rfcs/pull/1116';
const RFC_1216 = 'https://github.com/emberjs/rfcs/pull/1216';
const RFC_1234 = 'https://github.com/emberjs/rfcs/pull/1234';
const RFC_334 = 'https://github.com/emberjs/rfcs/pull/334';

const REPLACE_ARRAY = 'Use native arrays, or `trackedArray` from `@ember/reactive/collections`.';
const REPLACE_GETTER = 'Use a native getter instead.';

/** @type {Array<{ source: string, exports: string[] | null, id: string, since: { available: string, enabled?: string }, until: string, replacement: string, url: string, status: 'released' | 'merged' | 'pr' | 'draft' }>} */
const DEPRECATED_IMPORTS = [
  // ---------------------------------------------------------------------------
  // 6.x
  // ---------------------------------------------------------------------------
  {
    source: '@ember/service',
    exports: ['inject'],
    id: 'importing-inject-from-ember-service',
    since: { available: '6.2.0', enabled: '6.3.0' },
    until: '7.0.0',
    replacement: 'Use `service` from `@ember/service` instead.',
    url: 'https://deprecations.emberjs.com/id/importing-inject-from-ember-service',
    status: 'released',
  },
  {
    // ember-source registers one id per member (`deprecate-import-<name>-from-ember`).
    source: 'ember',
    exports: null,
    id: 'deprecate-import-ember-from-ember',
    since: { available: '5.10.0', enabled: '6.5.0' },
    until: '7.0.0',
    replacement: 'Import from the specific `@ember/*` module instead.',
    url: RFC_1003,
    status: 'released',
  },

  // ---------------------------------------------------------------------------
  // 7.4
  // ---------------------------------------------------------------------------
  {
    source: '@ember/object/mixin',
    exports: ['default'],
    id: 'deprecate-mixins',
    since: { available: '7.4.0' },
    until: '8.0.0',
    replacement: 'Use native classes, services, or plain functions instead.',
    url: 'https://deprecations.emberjs.com/id/deprecate-mixins',
    status: 'released',
  },
  {
    // The registry says available 7.3.0, but it first shipped in 7.4.0-alpha.2.
    source: '@ember/object/evented',
    exports: ['default', 'on'],
    id: 'deprecate-evented',
    since: { available: '7.4.0' },
    until: '8.0.0',
    replacement: 'Use derived tracked state, direct method calls, or a native `EventTarget`.',
    url: RFC_1111,
    status: 'released',
  },
  {
    source: '@ember/object/events',
    exports: ['addListener', 'removeListener', 'sendEvent'],
    id: 'deprecate-evented',
    since: { available: '7.4.0' },
    until: '8.0.0',
    replacement: 'Use derived tracked state, direct method calls, or a native `EventTarget`.',
    url: RFC_1111,
    status: 'released',
  },
  {
    source: '@ember/object/promise-proxy-mixin',
    exports: ['default'],
    id: 'deprecate-promise-proxy-mixin',
    since: { available: '7.4.0' },
    until: '8.0.0',
    replacement: 'Use `async`/`await` and track the loading state yourself.',
    url: 'https://deprecations.emberjs.com/id/deprecate-promise-proxy-mixin',
    status: 'released',
  },
  {
    source: '@ember/array/proxy',
    exports: ['default'],
    id: 'deprecate-array-proxy',
    since: { available: '7.4.0' },
    until: '8.0.0',
    replacement: 'Use `trackedArray` from `@ember/reactive/collections`, or a native `Proxy`.',
    url: RFC_1112,
    status: 'released',
  },
  {
    source: '@ember/object/proxy',
    exports: ['default'],
    id: 'deprecate-object-proxy',
    since: { available: '7.4.0' },
    until: '8.0.0',
    replacement: 'Use tracked properties, or a native `Proxy`.',
    url: RFC_1112,
    status: 'released',
  },

  // ---------------------------------------------------------------------------
  // 7.5
  // ---------------------------------------------------------------------------
  {
    source: '@ember/utils',
    exports: null,
    id: 'deprecate-ember-utils',
    since: { available: '7.5.0' },
    until: '8.0.0',
    replacement: 'Use native JavaScript checks instead.',
    url: RFC_334,
    status: 'released',
  },
  {
    source: '@ember/object/computed',
    exports: ['empty', 'notEmpty', 'none'],
    id: 'deprecate-ember-utils',
    since: { available: '7.5.0' },
    until: '8.0.0',
    replacement: REPLACE_GETTER,
    url: RFC_334,
    status: 'released',
  },
  {
    source: '@ember/object/computed',
    exports: [
      'alias',
      'and',
      'bool',
      'deprecatingAlias',
      'equal',
      'gt',
      'gte',
      'lt',
      'lte',
      'match',
      'not',
      'oneWay',
      'or',
      'readOnly',
      'reads',
    ],
    id: 'deprecate-computed-macros',
    since: { available: '7.5.0' },
    until: '9.0.0',
    replacement: REPLACE_GETTER,
    url: RFC_1234,
    status: 'released',
  },
  {
    // https://github.com/emberjs/ember.js/pull/21687
    source: '@ember/object/computed',
    exports: [
      'collect',
      'filter',
      'filterBy',
      'intersect',
      'map',
      'mapBy',
      'max',
      'min',
      'setDiff',
      'sort',
      'sum',
      'union',
      'uniq',
      'uniqBy',
    ],
    id: 'deprecate-array-computed-macros',
    since: { available: '7.5.0' },
    until: '8.0.0',
    replacement: 'Use a native getter with native array methods instead.',
    url: RFC_1114,
    status: 'released',
  },
  {
    // https://github.com/emberjs/ember.js/pull/21687
    source: '@ember/array',
    exports: ['A'],
    id: 'deprecate-ember-array-a',
    since: { available: '7.5.0' },
    until: '8.0.0',
    replacement: REPLACE_ARRAY,
    url: RFC_1114,
    status: 'released',
  },
  {
    // https://github.com/emberjs/ember.js/pull/21588
    source: '@ember/array',
    exports: ['default'],
    id: 'deprecate-ember-array-mixin',
    since: { available: '7.5.0' },
    until: '8.0.0',
    replacement: REPLACE_ARRAY,
    url: RFC_1116,
    status: 'released',
  },
  {
    // https://github.com/emberjs/ember.js/pull/21588
    source: '@ember/array',
    exports: ['MutableArray'],
    id: 'deprecate-mutable-array-mixin',
    since: { available: '7.5.0' },
    until: '8.0.0',
    replacement: REPLACE_ARRAY,
    url: RFC_1116,
    status: 'released',
  },
  {
    // https://github.com/emberjs/ember.js/pull/21588
    source: '@ember/array/mutable',
    exports: ['default'],
    id: 'deprecate-mutable-array-mixin',
    since: { available: '7.5.0' },
    until: '8.0.0',
    replacement: REPLACE_ARRAY,
    url: RFC_1116,
    status: 'released',
  },
  {
    // https://github.com/emberjs/ember.js/pull/21588
    source: '@ember/array',
    exports: ['NativeArray'],
    id: 'deprecate-native-array-mixin',
    since: { available: '7.5.0' },
    until: '8.0.0',
    replacement: REPLACE_ARRAY,
    url: RFC_1116,
    status: 'released',
  },
  {
    // https://github.com/emberjs/ember.js/pull/21588
    source: '@ember/object/observable',
    exports: ['default'],
    id: 'deprecate-observable-mixin',
    since: { available: '7.5.0' },
    until: '8.0.0',
    replacement: 'Use native classes with tracked properties instead.',
    url: RFC_1116,
    status: 'released',
  },
  {
    // https://github.com/emberjs/ember.js/pull/21588 (sets until 7.9.0)
    source: '@ember/enumerable',
    exports: ['default'],
    id: 'deprecate-enumerable-mixin',
    since: { available: '7.5.0' },
    until: '7.9.0',
    replacement: 'Use `Array.isArray` or check for an iterable instead.',
    url: RFC_1116,
    status: 'released',
  },
  {
    // https://github.com/emberjs/ember.js/pull/21588 (sets until 7.9.0)
    source: '@ember/enumerable/mutable',
    exports: ['default'],
    id: 'deprecate-mutable-enumerable-mixin',
    since: { available: '7.5.0' },
    until: '7.9.0',
    replacement: 'Use `Array.isArray` or check for an iterable instead.',
    url: RFC_1116,
    status: 'released',
  },
  {
    // https://github.com/emberjs/ember.js/pull/21588 (sets until 7.9.0)
    source: '@ember/controller',
    exports: ['ControllerMixin'],
    id: 'deprecate-controller-mixin',
    since: { available: '7.5.0' },
    until: '7.9.0',
    replacement: 'Extend `Controller` from `@ember/controller` instead.',
    url: RFC_1116,
    status: 'released',
  },
  {
    // https://github.com/emberjs/ember.js/pull/21630
    source: '@ember/component',
    exports: ['default'],
    id: 'ember-component',
    since: { available: '7.5.0' },
    until: '8.0.0',
    replacement: 'Use `@glimmer/component` instead.',
    url: RFC_1216,
    status: 'draft',
  },
  {
    // https://github.com/emberjs/ember.js/pull/21674
    // Whether named exports like `computed`, `get` and `set` are also deprecated is not settled.
    source: '@ember/object',
    exports: ['default'],
    id: 'deprecate-ember-object',
    since: { available: '7.5.0' },
    until: '9.0.0',
    replacement: 'Use native classes instead.',
    url: RFC_1234,
    status: 'draft',
  },
];

/**
 * The version a deprecation starts being reported at by default.
 *
 * @param {{ since: { available: string, enabled?: string } }} deprecation
 * @returns {string}
 */
function getReportVersion(deprecation) {
  return deprecation.since.enabled || deprecation.since.available;
}

module.exports = {
  DEPRECATED_IMPORTS,
  getReportVersion,
};
