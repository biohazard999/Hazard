import { keywordKindOf } from "./syntax";
import { SyntaxToken } from "./syntax-token";

export class Lexer {
  public get current(): string {
    return this.peek(0);
  }

  public get lookahead(): string {
    return this.peek(1);
  }

  public diagnostics: string[] = [];

  private position: number = 0;

  constructor(private readonly text: string) {}

  public lex(): SyntaxToken {
    if (this.position >= this.text.length) {
      return new SyntaxToken("EndOfFileToken", this.position, "\0");
    }

    if (isDigit(this.current)) {
      const start = this.position;
      while (isDigit(this.current)) {
        this.next();
      }
      const length = this.position - start;
      const text = this.text.substr(start, length);

      const value = parseInt(text, 10);
      if (!value) {
        this.diagnostics.push(`The number ${text} isn't a valid number`);
      }
      return new SyntaxToken("NumberToken", start, text, value);
    }

    if (isWhiteSpace(this.current)) {
      const start = this.position;
      while (isWhiteSpace(this.current)) {
        this.next();
      }
      const length = this.position - start;
      const text = this.text.substr(start, length);
      return new SyntaxToken("WhitespaceToken", start, text);
    }

    if (isLetter(this.current)) {
      const start = this.position;

      while (isLetter(this.current)) {
        this.next();
      }

      const length = this.position - start;
      const text = this.text.substr(start, length);
      const kind = keywordKindOf(text);
      return new SyntaxToken(kind, start, text, null);
    }

    switch (this.current) {
      case "+":
        return new SyntaxToken("PlusToken", this.position++, "+");
      case "-":
        return new SyntaxToken("MinusToken", this.position++, "-");
      case "/":
        return new SyntaxToken("SlashToken", this.position++, "/");
      case "*":
        return new SyntaxToken("StarToken", this.position++, "*");
      case "%":
        return new SyntaxToken("PercentToken", this.position++, "%");
      case "(":
        return new SyntaxToken("OpenParenthesesToken", this.position++, "(");
      case ")":
        return new SyntaxToken("CloseParenthesesToken", this.position++, ")");
      case "&":
        if (this.lookahead === "&") {
          return new SyntaxToken("AmpersandAmpersandToken", this.position += 2, "&&");
        }
        break;
      case "|":
        if (this.lookahead === "|") {
          return new SyntaxToken("PipePipeToken", this.position += 2, "||");
        }
        break;
      case "=":
        if (this.lookahead === "=") {
          return new SyntaxToken("EqualsEqualsToken", this.position += 2, "==");
        }
        break;
      case "!":
        if (this.lookahead === "=") {
          return new SyntaxToken("BangEqualsToken", this.position += 2, "!=");
        }
        return new SyntaxToken("BangToken", this.position++, "!", null);
    }

    this.diagnostics.push(`ERROR: bad character in input: '${this.current}'`);
    return new SyntaxToken(
      "BadToken",
      this.position++,
      this.text.substr(this.position - 1, 1),
    );
  }

  private peek(offset: number) {
    const index = this.position + offset;

    if (index >= this.text.length) {
      return "\0";
    }

    return this.text[index];
  }

  private next() {
    this.position++;
  }
}

export function isDigit(c: string) {
  if (c.length > 1) {
    return false;
  }

  const n = c.charCodeAt(0);
  const charCodeZero = "0".charCodeAt(0);
  const charCodeNine = "9".charCodeAt(0);

  return n >= charCodeZero && n <= charCodeNine;
}

export function isWhiteSpace(c: string) {
  return c === " ";
}

export function isLetter(c: string) {
  return c.toUpperCase() !== c.toLowerCase();
}
