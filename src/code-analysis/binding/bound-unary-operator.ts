import { SyntaxKind } from "../syntax/syntax-kind";
import { Bool, Int32 } from "../types/build-in-types";
import { Type } from "../types/type";
import { BoundUnaryOperatorKind } from "./bound-unary-operator-kind";

export class BoundUnaryOperator {
  public static bind(
    syntaxKind: SyntaxKind,
    operandType: Type,
  ): BoundUnaryOperator | undefined {
    for (const op of this._operators) {
      if (op.syntaxKind === syntaxKind && op.operandType === operandType) {
        return op;
      }
    }
  }

  private static _operators: BoundUnaryOperator[] = [
    createUnaryOperator("BangToken", "LogicalNegation", Bool),
    createUnaryOperator("PlusToken", "Identity", Int32),
    createUnaryOperator("MinusToken", "Negation", Int32),
  ];

  constructor(
    public readonly syntaxKind: SyntaxKind,
    public readonly kind: BoundUnaryOperatorKind,
    public readonly operandType: Type,
    public readonly type: Type,
  ) {}
}

export function createUnaryOperator(
  syntaxKind: SyntaxKind,
  kind: BoundUnaryOperatorKind,
  operandType: Type,
  resultType?: Type,
) {
  return resultType
    ? new BoundUnaryOperator(syntaxKind, kind, operandType, resultType)
    : new BoundUnaryOperator(syntaxKind, kind, operandType, operandType);
}
