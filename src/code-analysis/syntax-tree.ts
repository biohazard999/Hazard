import { ExpressionSyntax } from "./expression-syntax";
import { Parser } from "./parser";
import { SyntaxToken } from "./syntax-token";

export class SyntaxTree {
  public static parse(text: string) {
    const parser = new Parser(text);
    return parser.parse();
  }

  constructor(
    public readonly root: ExpressionSyntax,
    endOfFileToken: SyntaxToken,
    public readonly diagnostics: string[],
  ) {}
}
