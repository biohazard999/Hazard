import { ExpressionSyntax } from "./expression-syntax";
import { SyntaxKind } from "./syntax-kind";
import { SyntaxNode } from "./syntax-node";
import { SyntaxToken } from "./syntax-token";

export class LiteralExpressionSyntax extends ExpressionSyntax {
  public kind: SyntaxKind = "LiteralExpression";
  public get children(): SyntaxNode[] {
    return [this.literalToken];
  }

  constructor(public readonly literalToken: SyntaxToken) {
    super();
  }
}
