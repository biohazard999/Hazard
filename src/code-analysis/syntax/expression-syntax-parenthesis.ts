import { SyntaxKind } from "../syntax-kind";
import { SyntaxNode } from "../syntax-node";
import { SyntaxToken } from "../syntax-token";
import { ExpressionSyntax } from "./expression-syntax";

export class ParenthesizedExpressionSyntax extends ExpressionSyntax {
  public kind: SyntaxKind = "ParenthesizedExpression";
  public get children(): SyntaxNode[] {
    return [
      this.openParenthesisToken,
      this.expression,
      this.closeParenthesisToken,
    ];
  }

  constructor(
    public readonly openParenthesisToken: SyntaxToken,
    public readonly expression: ExpressionSyntax,
    public readonly closeParenthesisToken: SyntaxToken,
  ) { super(); }
}
