/**
 * @typedef {{ line: number; character: number }} Position
 */

// Helper class to convert line/column from and to offset
// taken and adapt from https://github.com/typed-ember/glint/blob/main/packages/core/src/language-server/util/position.ts
class DocumentLines {
  /**
   * @param {string} contents
   */
  constructor(contents) {
    this.lineStarts = computeLineStarts(contents);
  }

  /**
   * @param {Position} position
   * @return {number}
   */
  positionToOffset(position) {
    const { line, character } = position;
    return this.lineStarts[line] + character;
  }

  /**
   *
   * @param {number} position
   * @return {Position}
   */
  offsetToPosition(position) {
    const lineStarts = this.lineStarts;
    let line = 0;
    while (line + 1 < lineStarts.length && lineStarts[line + 1] <= position) {
      line++;
    }
    const character = position - lineStarts[line];
    return { line, character };
  }
}

/**
 * @returns {number[]}
 * @param {string} text
 */
function computeLineStarts(text) {
  const result = [];
  let pos = 0;
  let lineStart = 0;
  while (pos < text.length) {
    const ch = text.codePointAt(pos);
    pos++;
    switch (ch) {
      case 13 /* carriageReturn */: {
        if (text.codePointAt(pos) === 10 /* lineFeed */) {
          pos++;
        }
      }
      // falls through
      case 10 /* lineFeed */: {
        result.push(lineStart);
        lineStart = pos;
        break;
      }
      default: {
        if (ch > 127 /* maxAsciiCharacter */ && isLineBreak(ch)) {
          result.push(lineStart);
          lineStart = pos;
        }
        break;
      }
    }
  }
  result.push(lineStart);
  return result;
}

/* istanbul ignore next */
/**
 * @param {number} ch
 * @return {boolean}
 */
function isLineBreak(ch) {
  // ES5 7.3:
  // The ECMAScript line terminator characters are listed in Table 3.
  //     Table 3: Line Terminator Characters
  //     Code Unit Value     Name                    Formal Name
  //     \u000A              Line Feed               <LF>
  //     \u000D              Carriage Return         <CR>
  //     \u2028              Line separator          <LS>
  //     \u2029              Paragraph separator     <PS>
  // Only the characters in Table 3 are treated as line terminators. Other new line or line
  // breaking characters are treated as white space but not as line terminators.
  return (
    ch === 10 /* lineFeed */ ||
    ch === 13 /* carriageReturn */ ||
    ch === 8232 /* lineSeparator */ ||
    ch === 8233 /* paragraphSeparator */
  );
}

module.exports = DocumentLines;
