const cache = new Map();

const synckit = require("synckit");

const hbs = {
  cache,
  preprocess: (text, filename) => {
    cache[filename] = text;
    return [{
      filename,
      text: ''
    }]
  },
  postprocess: (messages, filename) => {
    return messages.flat().map((msg) => {
      msg.message = msg.message.replace('(ember/ember-template-lint)', '')
      return msg;
    });
  },
  supportsAutofix: true,
}

module.exports = hbs;
