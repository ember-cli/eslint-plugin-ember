module.exports = {
  addPrefix,
  addComputedImport,
};

function addPrefix(testCase, prefix) {
  if (typeof testCase === 'string') {
    return `${prefix}${testCase}`;
  }

  const updated = {
    ...testCase,
    code: `${prefix}${testCase.code}`,
  };

  if (testCase.output) {
    updated.output = `${prefix}${testCase.output}`;
  }

  return updated;
}

function addComputedImport(testCase) {
  const importStatement = "import { computed } from '@ember/object';\n";
  return addPrefix(testCase, importStatement);
}
