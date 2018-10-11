import { ExpressionSyntax } from "./expression-syntax";
import { BinaryExpressionSyntax } from "./expression-syntax-binary";
import { NumberExpressionSyntax } from "./expression-syntax-number";
import { ParenthesizedExpressionSyntax } from "./expression-syntax-parenthesis";
import { Lexer } from "./lexer";
import { SyntaxKind } from "./syntax-kind";
import { SyntaxToken } from "./syntax-token";
import { SyntaxTree } from "./syntax-tree";

export class Parser {
  public diagnostics: string[] = [];

  private get current(): SyntaxToken {
    return this.peek(0);
  }

  private tokens: SyntaxToken[] = [];

  private position: number = 0;

  constructor(text: string) {
    const lexer = new Lexer(text);

    let token: SyntaxToken;
    do {
      token = lexer.lex();
      if (token.kind !== "WhitespaceToken" && token.kind !== "BadToken") {
        this.tokens.push(token);
      }
    } while (token.kind !== "EndOfFileToken");

    this.diagnostics.push(...lexer.diagnostics);
  }

  public parse(): SyntaxTree {
    const expression = this.parseExpression();
    const endOfFileToken = this.match("EndOfFileToken");
    return new SyntaxTree(expression, endOfFileToken, this.diagnostics);
  }

  private parseTerm(): ExpressionSyntax {
    let left = this.parseFactor();

    while (
      this.current.kind === "PlusToken" ||
      this.current.kind === "MinusToken" ||
      this.current.kind === "PercentToken"
    ) {
      const operatorToken = this.nextToken();
      const right = this.parseFactor();
      left = new BinaryExpressionSyntax(left, operatorToken, right);
    }

    return left;
  }

  private parseFactor(): ExpressionSyntax {
    let left = this.parsePrimaryExpression();

    while (
      this.current.kind === "StarToken" ||
      this.current.kind === "SlashToken"
    ) {
      const operatorToken = this.nextToken();
      const right = this.parsePrimaryExpression();
      left = new BinaryExpressionSyntax(left, operatorToken, right);
    }

    return left;
  }

  private peek(offset: number) {
    const index = this.position + offset;
    if (index >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[index];
  }

  private nextToken() {
    const current = this.current;
    this.position++;
    return current;
  }

  private match(kind: SyntaxKind) {
    if (this.current.kind === kind) {
      return this.nextToken();
    }
    this.diagnostics.push(
      `ERROR: Unexpected token <${this.current.kind}>, expected: <${kind}>`,
    );
    return new SyntaxToken(kind, this.current.position);
  }

  private parseExpression(): ExpressionSyntax {
    return this.parseTerm();
  }

  private parsePrimaryExpression(): ExpressionSyntax {
    if (this.current.kind === "OpenParenthesesToken") {
      const left = this.nextToken();
      const expression = this.parseExpression();
      const right = this.match("CloseParenthesesToken");
      return new ParenthesizedExpressionSyntax(left, expression, right);
    }

    const numberToken = this.match("NumberToken");
    return new NumberExpressionSyntax(numberToken);
  }
}
