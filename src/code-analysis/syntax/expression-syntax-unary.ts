import { ExpressionSyntax } from "./expression-syntax";
import { SyntaxKind } from "./syntax-kind";
import { SyntaxNode } from "./syntax-node";
import { SyntaxToken } from "./syntax-token";

export class UnaryExpressionSyntax extends ExpressionSyntax {
  public kind: SyntaxKind = "UnaryExpression";
  public get children(): SyntaxNode[] {
    return [this.operatorToken, this.operand];
  }

  constructor(
    public readonly operatorToken: SyntaxToken,
    public readonly operand: SyntaxToken,
  ) {
    super();
  }
}
