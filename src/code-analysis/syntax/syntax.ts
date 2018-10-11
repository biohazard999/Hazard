import { SyntaxKind } from "./syntax-kind";

export function unaryOperatorPrecedenceOf(kind: SyntaxKind) {
  switch (kind) {
    case "PlusToken":
    case "MinusToken":
      return 3;
    default:
      return 0;
  }
}

export function binaryOperatorPrecedenceOf(kind: SyntaxKind) {
  switch (kind) {
    case "StarToken":
    case "SlashToken":
      return 2;
    case "PlusToken":
    case "MinusToken":
      return 1;
    default:
      return 0;
  }
}
