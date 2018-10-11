import { SyntaxKind } from "../syntax/syntax-kind";
import { Bool, Int32 } from "../types/build-in-types";
import { Type } from "../types/type";
import { BoundBinaryOperatorKind } from "./bound-binary-operator-kind";

export class BoundBinaryOperator {
  public static bind(
    syntaxKind: SyntaxKind,
    leftType: Type,
    rightType: Type,
  ) {
    for (const op of this._operators) {
      if (
        op.syntaxKind === syntaxKind &&
        op.leftType === leftType &&
        op.rightType === rightType
      ) {
        return op;
      }
    }
  }

  private static _operators: BoundBinaryOperator[] = [
    createBinaryOperator("PlusToken", "Addition", Int32),
    createBinaryOperator("MinusToken", "Subtraction", Int32),
    createBinaryOperator("StarToken", "Multiplication", Int32),
    createBinaryOperator("SlashToken", "Division", Int32),
    createBinaryOperator("EqualsEqualsToken", "Equals", Bool),
    createBinaryOperator("BangEqualsToken", "NotEquals", Int32, Bool),
    createBinaryOperator("AmpersandAmpersandToken", "LogicalAnd", Bool),
    createBinaryOperator("PipePipeToken", "LogicalOr", Bool),
    createBinaryOperator("EqualsEqualsToken", "Equals", Bool),
    createBinaryOperator("BangEqualsToken", "NotEquals", Bool),
  ];

  constructor(
    public readonly syntaxKind: SyntaxKind,
    public readonly kind: BoundBinaryOperatorKind,
    public readonly leftType: Type,
    public readonly rightType: Type,
    public readonly type: Type,
  ) {}
}

export function createBinaryOperator(
  syntaxKind: SyntaxKind,
  kind: BoundBinaryOperatorKind,
  operandType: Type,
  resultType?: Type,
) {
  return resultType
    ? new BoundBinaryOperator(
        syntaxKind,
        kind,
        operandType,
        operandType,
        resultType,
      )
    : new BoundBinaryOperator(
        syntaxKind,
        kind,
        operandType,
        operandType,
        operandType,
      );
}
