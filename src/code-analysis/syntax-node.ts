import { SyntaxKind } from "./syntax-kind";

export abstract class SyntaxNode {
  public abstract kind: SyntaxKind;
  public abstract children: SyntaxNode[];
}
