type SyntaxTokens =
  | "BadToken"
  | "EndOfFileToken"
  | "WhitespaceToken"
  | "IdentifierToken"
  | "NumberToken"
  | "PlusToken"
  | "MinusToken"
  | "SlashToken"
  | "StarToken"
  | "PercentToken"
  | "BangToken"
  | "EqualsEqualsToken"
  | "BangEqualsToken"
  | "AmpersandAmpersandToken"
  | "PipePipeToken"
  | "OpenParenthesesToken"
  | "CloseParenthesesToken";

type SyntaxExpressions =
  | "LiteralExpression"
  | "BinaryExpression"
  | "ParenthesizedExpression"
  | "UnaryExpression";

type KeywordTokens = "FalseKeyword" | "TrueKeyword";

export type SyntaxKind = SyntaxTokens | SyntaxExpressions | KeywordTokens;
