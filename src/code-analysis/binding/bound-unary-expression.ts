import { BoundExpression } from "./bound-expression";
import { BoundNodeKind } from "./bound-node-kind";
import { BoundUnaryOperator } from "./bound-unary-operator";

export class BoundUnaryExpression extends BoundExpression {
  constructor(
    public readonly operator: BoundUnaryOperator,
    public readonly operand: BoundExpression,
  ) {
    super();
  }

  public get kind(): BoundNodeKind {
    return "UnaryExpression";
  }

  public get type() {
    return this.operator.type;
  }
}
