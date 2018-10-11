import { SyntaxKind } from "./syntax-kind";

export function unaryOperatorPrecedenceOf(kind: SyntaxKind) {
  switch (kind) {
    case "PlusToken":
    case "MinusToken":
    case "BangToken":
        return 6;

    default:
        return 0;
  }
}

export function binaryOperatorPrecedenceOf(kind: SyntaxKind) {
  switch (kind) {
    case "StarToken":
    case "SlashToken":
        return 5;

    case "PlusToken":
    case "MinusToken":
        return 4;

    case "EqualsEqualsToken":
    case "BangEqualsToken":
        return 3;

    case "AmpersandAmpersandToken":
        return 2;

    case "PipePipeToken":
        return 1;

    default:
        return 0;
  }
}

export function keywordKindOf(text: string): SyntaxKind {
  switch (text) {
    case "true":
    return "TrueKeyword";
    case "false":
    return "FalseKeyword";
    default:
    return "IdentifierToken";
  }
}
