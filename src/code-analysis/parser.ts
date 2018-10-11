import { Lexer } from "./lexer";
import { SyntaxKind } from "./syntax-kind";
import { SyntaxToken } from "./syntax-token";
import { SyntaxTree } from "./syntax-tree";
import { ExpressionSyntax } from "./syntax/expression-syntax";
import { BinaryExpressionSyntax } from "./syntax/expression-syntax-binary";
import { LiteralExpressionSyntax } from "./syntax/expression-syntax-literal";
import { ParenthesizedExpressionSyntax } from "./syntax/expression-syntax-parenthesis";
import { UnaryExpressionSyntax } from "./syntax/expression-syntax-unary";
import { binaryOperatorPrecedenceOf, unaryOperatorPrecedenceOf } from "./syntax/syntax";

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
    const endOfFileToken = this.matchToken("EndOfFileToken");
    return new SyntaxTree(expression, endOfFileToken, this.diagnostics);
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

  private matchToken(kind: SyntaxKind) {
    if (this.current.kind === kind) {
      return this.nextToken();
    }
    this.diagnostics.push(
      `ERROR: Unexpected token <${this.current.kind}>, expected: <${kind}>`,
    );
    return new SyntaxToken(kind, this.current.position);
  }

  private parseExpression(parentPrecedence: number = 0): ExpressionSyntax {
    let left: ExpressionSyntax;
    const unaryOperatorPrecedence = unaryOperatorPrecedenceOf(this.current.kind);
    if (unaryOperatorPrecedence !== 0 && unaryOperatorPrecedence >= parentPrecedence) {
      const operatorToken = this.nextToken();
      const operand = this.parseExpression(unaryOperatorPrecedence);
      left = new UnaryExpressionSyntax(operatorToken, operand);

    } else {
      left = this.parsePrimaryExpression();
    }

    while (true) {
      const precedence = binaryOperatorPrecedenceOf(this.current.kind);
      if (precedence === 0 || precedence <= parentPrecedence) {
        break;
      }
      const operatorToken = this.nextToken();
      const right = this.parseExpression(precedence);
      left = new BinaryExpressionSyntax(left, operatorToken, right);
    }

    return left;
  }

  private parsePrimaryExpression(): ExpressionSyntax {
    if (this.current.kind === "OpenParenthesesToken") {
      const left = this.nextToken();
      const expression = this.parseExpression();
      const right = this.matchToken("CloseParenthesesToken");
      return new ParenthesizedExpressionSyntax(left, expression, right);
    }

    const numberToken = this.matchToken("NumberToken");
    return new LiteralExpressionSyntax(numberToken);
  }
}
