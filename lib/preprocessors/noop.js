const parsedFiles = new Set();

module.exports = {
  registerParsedFile(f) {
    parsedFiles.add(f);
  },
  preprocess: null,
  postprocess: (messages, fileName) => {
    const msgs = messages.flat();
    if (
      msgs.length === 1 &&
      msgs[0].ruleId === null &&
      msgs[0].message.startsWith('Parsing error: ')
    ) {
      if (!parsedFiles.has(fileName)) {
        msgs[0].message += '\n';
        msgs[0].message +=
          'To lint Gjs/Gts files please follow the setup guide at https://github.com/ember-cli/eslint-plugin-ember#gtsgjs';
      }
    }
    parsedFiles.delete(fileName); // required for tests
    return msgs;
  },
  supportsAutofix: true,
};
