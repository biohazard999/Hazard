import { ExpressionSyntax } from "../syntax/expression-syntax";
import { BinaryExpressionSyntax } from "../syntax/expression-syntax-binary";
import { LiteralExpressionSyntax } from "../syntax/expression-syntax-literal";
import { UnaryExpressionSyntax } from "../syntax/expression-syntax-unary";
import { BoundBinaryExpression } from "./bound-binary-expression";
import { BoundBinaryOperator } from "./bound-binary-operator";
import { BoundExpression } from "./bound-expression";
import { BoundLiteralExpression } from "./bound-literal-expression";
import { BoundUnaryExpression } from "./bound-unary-expression";
import { BoundUnaryOperator } from "./bound-unary-operator";

export class Binder {
  public readonly diagnostics: string[] = [];

  public bindExpression(syntax: ExpressionSyntax): BoundExpression {
    switch (syntax.kind) {
      case "LiteralExpression":
        return this.bindLiteralExpression(syntax as LiteralExpressionSyntax);
      case "UnaryExpression":
        return this.bindUnaryExpression(syntax as UnaryExpressionSyntax);
      case "BinaryExpression":
        return this.bindBinaryExpression(syntax as BinaryExpressionSyntax);
      default:
        throw new Error(`Unexpected syntax ${syntax.kind}`);
    }
  }

  private bindLiteralExpression(
    syntax: LiteralExpressionSyntax,
  ): BoundExpression {
    const value = syntax.value === undefined  ? 0 : syntax.value;
    return new BoundLiteralExpression(value);
  }

  private bindUnaryExpression(syntax: UnaryExpressionSyntax): BoundExpression {
    const boundOperand = this.bindExpression(syntax.operand);
    const boundOperator = BoundUnaryOperator.bind(
      syntax.operatorToken.kind,
      boundOperand.type,
    );

    if (boundOperator == null) {
      this.diagnostics.push(
        `Unary operator '${
          syntax.operatorToken.text
        }' is not defined for type ${boundOperand.type}.`,
      );
      return boundOperand;
    }

    return new BoundUnaryExpression(boundOperator, boundOperand);
  }

  private bindBinaryExpression(
    syntax: BinaryExpressionSyntax,
  ): BoundExpression {
    const boundLeft = this.bindExpression(syntax.left);
    const boundRight = this.bindExpression(syntax.right);
    const boundOperator = BoundBinaryOperator.bind(
      syntax.operatorToken.kind,
      boundLeft.type,
      boundRight.type,
    );

    if (boundOperator == null) {
      this.diagnostics.push(
        `Binary operator '${
          syntax.operatorToken.text
        }' is not defined for types ${boundLeft.type} and ${boundRight.type}.`,
      );
      return boundLeft;
    }

    return new BoundBinaryExpression(boundLeft, boundOperator, boundRight);
  }
}
