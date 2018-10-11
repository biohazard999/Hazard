import { SyntaxKind } from "./syntax-kind";
import { SyntaxNode } from "./syntax-node";

export class SyntaxToken extends SyntaxNode {
  public children: SyntaxNode[] = [];
  constructor(
    public readonly kind: SyntaxKind,
    public readonly position?: number,
    public readonly text?: string,
    public readonly value?: any,
  ) {
    super();
  }
}
