import { BoundBinaryExpression } from "./binding/bound-binary-expression";
import { BoundExpression } from "./binding/bound-expression";
import { BoundLiteralExpression } from "./binding/bound-literal-expression";
import { BoundUnaryExpression } from "./binding/bound-unary-expression";

export class Evaluator {
  constructor(private root: BoundExpression) {}

  public evaluate() {
    return this.evaluateExpression(this.root);
  }

  private evaluateExpression(node: BoundExpression): any {
    if (node instanceof BoundLiteralExpression) {
      return node.value;
    }

    if (node instanceof BoundUnaryExpression) {
      const operand = this.evaluateExpression(node.operand);

      switch (node.operator.kind) {
        case "Identity":
          return operand;
        case "Negation":
          return -operand;
        case "LogicalNegation":
          return !operand;
        default:
          throw new Error(`Unexpected unary operator ${node.operand}`);
      }
    }

    if (node instanceof BoundBinaryExpression) {
      const left = this.evaluateExpression(node.left);
      const right = this.evaluateExpression(node.right);

      switch (node.operator.kind) {
        case "Addition":
          const l: number = left;
          const r: number = right;
          return l + r;
        case "Subtraction":
          return left - right;
        case "Multiplication":
          return left * right;
        case "Division":
          return left / right;
        case "LogicalAnd":
          return left && right;
        case "LogicalOr":
          return left || right;
        case "Equals":
          return left === right;
        case "NotEquals":
          return !(left === right);
        default:
          throw new Error(`Unexpected binary operator ${node.operator}`);
      }
    }

    throw new Error(`Unexpected node ${node.kind}`);
  }
}
