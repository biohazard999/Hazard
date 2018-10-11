import { ExpressionSyntax } from "./expression-syntax";
import { SyntaxKind } from "./syntax-kind";
import { SyntaxNode } from "./syntax-node";
import { SyntaxToken } from "./syntax-token";

export class BinaryExpressionSyntax extends ExpressionSyntax {
  public kind: SyntaxKind = "BinaryExpression";
  public get children(): SyntaxNode[] {
    return [this.left, this.operatorToken, this.right];
  }

  constructor(
    public readonly left: SyntaxToken,
    public readonly operatorToken: SyntaxToken,
    public readonly right: SyntaxToken,
  ) {
    super();
  }
}
