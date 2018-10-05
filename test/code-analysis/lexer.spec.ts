import { isDigit, isWhiteSpace, Lexer } from "../../src/code-analysis/lexer";

describe("the lexer", () => {
  function arrange(str: string) {
    return new Lexer(str);
  }

  it("should return a whitespace token for a whitespace", () => {
    const lexer = arrange(" ");
    const token = lexer.nextToken();
    expect(token.kind).toBe("WhitespaceToken");
  });

  it("should return a number token for a number", () => {
    const lexer = arrange("1");
    const token = lexer.nextToken();
    expect(token.kind).toBe("NumberToken");
  });

  it("should return a plus token for a +", () => {
    const lexer = arrange("+");
    const token = lexer.nextToken();
    expect(token.kind).toBe("PlusToken");
  });

  it("should return a plus token for a -", () => {
    const lexer = arrange("-");
    const token = lexer.nextToken();
    expect(token.kind).toBe("MinusToken");
  });

  it("should return a star token for a *", () => {
    const lexer = arrange("*");
    const token = lexer.nextToken();
    expect(token.kind).toBe("StarToken");
  });

  it("should return a slash token for a /", () => {
    const lexer = arrange("/");
    const token = lexer.nextToken();
    expect(token.kind).toBe("SlashToken");
  });

  it("should return a percent token for a %", () => {
    const lexer = arrange("%");
    const token = lexer.nextToken();
    expect(token.kind).toBe("PercentToken");
  });

  it("should return a open parentheses token for a (", () => {
    const lexer = arrange("(");
    const token = lexer.nextToken();
    expect(token.kind).toBe("OpenParenthesesToken");
  });

  it("should return a close parentheses token for a )", () => {
    const lexer = arrange(")");
    const token = lexer.nextToken();
    expect(token.kind).toBe("CloseParenthesesToken");
  });

  it("should return a bad token for a ~", () => {
    const lexer = arrange("~");
    const token = lexer.nextToken();
    expect(token.kind).toBe("BadToken");
  });

  it("should report diagnostics for a bad token", () => {
    const lexer = arrange("~");
    lexer.nextToken();
    expect(lexer.diagnostics).toContain("ERROR: bad character in input: '~'");
  });

  it("should end with an end of file token", () => {
    const lexer = arrange("~");
    lexer.nextToken();
    const token = lexer.nextToken();
    expect(token.kind).toBe("EndOfFileToken");
  });

  describe("'s helper function", () => {
    describe("isDigit", () => {
      it("should return true given 1", () => {
        expect(isDigit("1")).toBeTruthy();
      });

      it("should return false given 10", () => {
        expect(isDigit("10")).toBeFalsy();
      });

      it("should return true given 0", () => {
        expect(isDigit("0")).toBeTruthy();
      });

      it("should return false given a string", () => {
        expect(isDigit("f")).toBeFalsy();
      });
    });

    describe("isWhiteSpace", () => {
      it("should be true for a whitespace", () => {
        expect(isWhiteSpace(" ")).toBeTruthy();
      });

      it("should be false for an empty string", () => {
        expect(isWhiteSpace("")).toBeFalsy();
      });

      it("should be false for a number", () => {
        expect(isWhiteSpace("1")).toBeFalsy();
      });
    });
  });
});
