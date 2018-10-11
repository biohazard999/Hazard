import { Parser } from "./parser";
import { SyntaxToken } from "./syntax-token";
import { ExpressionSyntax } from "./syntax/expression-syntax";

export class SyntaxTree {
  public static parse(text: string) {
    const parser = new Parser(text);
    return parser.parse();
  }

  constructor(
    public readonly root: ExpressionSyntax,
    _endOfFileToken: SyntaxToken,
    public readonly diagnostics: string[],
  ) {}
}
