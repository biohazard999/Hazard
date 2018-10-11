import { Type } from "../types/type";
import { BoundBinaryOperator } from "./bound-binary-operator";
import { BoundExpression } from "./bound-expression";
import { BoundNodeKind } from "./bound-node-kind";

export class BoundBinaryExpression extends BoundExpression {
  constructor(
    public readonly left: BoundExpression,
    public readonly operator: BoundBinaryOperator,
    public readonly right: BoundExpression,
  ) {
    super();
  }
  public get kind(): BoundNodeKind { return "UnaryExpression"; }
  public get type(): Type { return this.operator.type; }
}
