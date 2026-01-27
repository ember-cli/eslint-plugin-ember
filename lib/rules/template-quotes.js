function attrValueHasChar(node, ch) {
  if (node.type === 'GlimmerTextNode') {
    return node.chars.includes(ch);
  }
  if (node.type === 'GlimmerConcatStatement') {
    return (node.parts || []).some((n) => n.type === 'GlimmerTextNode' && n.chars.includes(ch));
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent quote style in templates',
      category: 'Stylistic Issues',
      strictGjs: false,
      strictGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-quotes.md',
    },
    fixable: 'code',
    schema: [
      {
        oneOf: [
          { enum: ['double', 'single'] },
          {
            type: 'object',
            properties: {
              curlies: { enum: ['double', 'single', false] },
              html: { enum: ['double', 'single', false] },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      wrongQuotes: '{{message}}',
    },
  },

  create(context) {
    const rawOption = context.options[0] || 'double';
    const config =
      typeof rawOption === 'string'
        ? { curlies: rawOption, html: rawOption }
        : { curlies: rawOption.curlies || false, html: rawOption.html || false };

    const chars = { single: "'", double: '"' };
    const goodChars = {
      curlies: config.curlies ? chars[config.curlies] : null,
      html: config.html ? chars[config.html] : null,
    };
    const badChars = {
      curlies: goodChars.curlies
        ? goodChars.curlies === chars.single
          ? chars.double
          : chars.single
        : null,
      html: goodChars.html ? (goodChars.html === chars.single ? chars.double : chars.single) : null,
    };

    let message;
    if (goodChars.curlies === goodChars.html && goodChars.curlies) {
      message = `you must use ${config.curlies} quotes in templates`;
    } else if (!goodChars.curlies || !goodChars.html) {
      const active = goodChars.curlies || goodChars.html;
      const activeType = active === chars.single ? 'single' : 'double';
      const context_ = goodChars.curlies ? 'Handlebars syntax' : 'HTML attributes';
      message = `you must use ${activeType} quotes in ${context_}`;
    } else {
      const doubleCtx =
        goodChars.curlies === chars.double ? 'Handlebars syntax' : 'HTML attributes';
      const singleCtx =
        goodChars.curlies === chars.single ? 'Handlebars syntax' : 'HTML attributes';
      message = `you must use double quotes for ${doubleCtx} and single quotes for ${singleCtx} in templates`;
    }

    const sourceCode = context.getSourceCode();

    return {
      GlimmerAttrNode(node) {
        if (!goodChars.html || !badChars.html) {
          return;
        }
        // Skip valueless attributes
        if (!node.value || node.isValueless) {
          return;
        }
        const raw = sourceCode.getText(node);
        // Extract quote char used: attr="..." or attr='...'
        const eqIndex = raw.indexOf('=');
        if (eqIndex === -1) {
          return;
        }
        const afterEq = raw[eqIndex + 1];
        if (afterEq !== badChars.html) {
          return;
        }
        // If the value contains the desired quote char, we can't autofix
        if (attrValueHasChar(node.value, goodChars.html)) {
          context.report({ node, messageId: 'wrongQuotes', data: { message } });
          return;
        }
        context.report({
          node,
          messageId: 'wrongQuotes',
          data: { message },
          fix(fixer) {
            const nodeText = sourceCode.getText(node);
            const eqIdx = nodeText.indexOf('=');
            const valuePart = nodeText.slice(eqIdx + 1);
            // Replace outer quotes
            const newValuePart = goodChars.html + valuePart.slice(1, -1) + goodChars.html;
            const newText = nodeText.slice(0, eqIdx + 1) + newValuePart;
            return fixer.replaceText(node, newText);
          },
        });
      },

      GlimmerStringLiteral(node) {
        if (!goodChars.curlies || !badChars.curlies) {
          return;
        }
        const raw = sourceCode.getText(node);
        if (!raw || raw.length < 2) {
          return;
        }
        const usedQuote = raw[0];
        if (usedQuote !== badChars.curlies) {
          return;
        }
        // If the value contains the desired quote char, we can't autofix
        if (node.value && node.value.includes(goodChars.curlies)) {
          context.report({ node, messageId: 'wrongQuotes', data: { message } });
          return;
        }
        context.report({
          node,
          messageId: 'wrongQuotes',
          data: { message },
          fix(fixer) {
            const newText = goodChars.curlies + raw.slice(1, -1) + goodChars.curlies;
            return fixer.replaceText(node, newText);
          },
        });
      },
    };
  },
};
