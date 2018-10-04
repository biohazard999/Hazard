import { ExpressionSyntax } from "./expression-syntax";
import { SyntaxKind } from "./syntax-kind";
import { SyntaxNode } from "./syntax-node";
import { SyntaxToken } from "./syntax-token";

export class NumberExpressionSyntax extends ExpressionSyntax {
  public kind: SyntaxKind = "NumberExpression";
  public get children(): SyntaxNode[] {
    return [this.numberToken];
  }

  constructor(public readonly numberToken: SyntaxToken) {
    super();
  }
}
