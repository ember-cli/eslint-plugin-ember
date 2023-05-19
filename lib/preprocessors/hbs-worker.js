const { runAsWorker } = require('synckit');

runAsWorker(async (filename, text) => {
  const Lint = await import('ember-template-lint');
  const lint = new Lint.default();
  process.env.emberTemplateLintFileName = filename;
  process.env.emberTemplateLintFixMode = false;
  const messages = await lint.verify({
    source: text,
    filePath: filename,
  });
  process.env.emberTemplateLintFixMode = true;
  return {
    messages,
    withFix: await lint.verifyAndFix({
      source: text,
      filePath: filename,
    }).output,
  };
});
