import { ExpressionSyntax } from "./expression-syntax";
import { BinaryExpressionSyntax } from "./expression-syntax-binary";
import { LiteralExpressionSyntax } from "./expression-syntax-literal";
import { ParenthesizedExpressionSyntax } from "./expression-syntax-parenthesis";

export class Evaluator {
  constructor(private root: ExpressionSyntax) {}

  public evaluate() {
    return this.evaluateExpression(this.root);
  }

  private evaluateExpression(node: ExpressionSyntax): number {
    if (node instanceof LiteralExpressionSyntax) {
      return node.literalToken.value as number;
    }

    if (node instanceof BinaryExpressionSyntax) {
      const left = this.evaluateExpression(node.left);
      const right = this.evaluateExpression(node.right);

      switch (node.operatorToken.kind) {
        case "PlusToken":
          return left + right;
        case "MinusToken":
          return left - right;
        case "SlashToken":
          return left / right;
        case "StarToken":
          return left * right;
        case "PercentToken":
          return left % right;
        default:
          throw new Error(
            `Unexpected binary operator: ${node.operatorToken.kind}`,
          );
      }
    }

    if (node instanceof ParenthesizedExpressionSyntax) {
      return this.evaluateExpression(node.expression);
    }

    throw new Error(`Unexpected node: ${node}`);
  }
}
