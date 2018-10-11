import { getType } from "../types/build-in-types";
import { Type } from "../types/type";
import { BoundExpression } from "./bound-expression";
import { BoundNodeKind } from "./bound-node-kind";

export class BoundLiteralExpression extends BoundExpression {
  constructor(public readonly value: any) {
    super();
  }

  public get kind(): BoundNodeKind {
    return "LiteralExpression";
  }
  public get type(): Type {
    return getType(this.value);
  }
}
