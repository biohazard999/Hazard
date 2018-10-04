import { ExpressionSyntax } from "./expression-syntax";
import { BinaryExpressionSyntax } from "./expression-syntax-binary";
import { NumberExpressionSyntax } from "./expression-syntax-number";
import { ParenthesizedExpressionSyntax } from "./expression-syntax-parenthesis";

export class Evaluator {
  constructor(private root: ExpressionSyntax) {}

  public evaluate() {
    return this.evaluateExpression(this.root);
  }

  private evaluateExpression(node: ExpressionSyntax): number {
    if (node instanceof NumberExpressionSyntax) {
      return node.numberToken.value as number;
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
