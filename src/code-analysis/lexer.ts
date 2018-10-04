import { SyntaxToken } from "./syntax-token";

export class Lexer {
  public get current(): string {
    if (this.position >= this.text.length) {
      return "\0";
    }
    return this.text[this.position];
  }

  public diagnostics: string[] = [];

  private position: number = 0;

  constructor(private readonly text: string) {}

  public nextToken(): SyntaxToken {
    if (this.position >= this.text.length) {
      return new SyntaxToken("EndOfFileToken", this.position, "\0");
    }

    if (isDigit(this.current)) {
      const start = this.position;
      while (isDigit(this.current)) {
        this.Next();
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
        this.Next();
      }
      const length = this.position - start;
      const text = this.text.substr(start, length);
      return new SyntaxToken("WhitespaceToken", start, text);
    }

    if (this.current === "+") {
      return new SyntaxToken("PlusToken", this.position++, "+");
    }

    if (this.current === "-") {
      return new SyntaxToken("MinusToken", this.position++, "-");
    }

    if (this.current === "/") {
      return new SyntaxToken("SlashToken", this.position++, "/");
    }

    if (this.current === "*") {
      return new SyntaxToken("StarToken", this.position++, "*");
    }

    if (this.current === "%") {
      return new SyntaxToken("PercentToken", this.position++, "%");
    }

    if (this.current === "(") {
      return new SyntaxToken("OpenParenthesesToken", this.position++, "(");
    }

    if (this.current === ")") {
      return new SyntaxToken("CloseParenthesesToken", this.position++, ")");
    }

    this.diagnostics.push(`ERROR: bad character in input: '${this.current}'`);
    return new SyntaxToken(
      "BadToken",
      this.position++,
      this.text.substr(this.position - 1, 1),
    );
  }

  private Next() {
    this.position++;
  }
}

export function isDigit(c: string) {
  const n = c.charCodeAt(0);
  const charCodeZero = "0".charCodeAt(0);
  const charCodeNine = "9".charCodeAt(0);

  return n >= charCodeZero && n <= charCodeNine;
}

export function isWhiteSpace(c: string) {
  return c === " ";
}
