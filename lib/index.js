'use strict';

const resolve = require('path').resolve;
const requireFolderTree = require('require-folder-tree');

const rules = requireFolderTree(resolve(__dirname, 'rules'));
const configs = requireFolderTree(resolve(__dirname, 'config'));

/* eslint-disable import/no-dynamic-require */
const ember = require(resolve(__dirname, 'utils/ember'));
const utils = require(resolve(__dirname, 'utils/utils'));

module.exports = {
  rules,
  configs,
  utils: {
    ember,
    utils,
  },
};
