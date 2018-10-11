import { BoundNodeKind } from "./bound-node-kind";

export abstract class BoundNode {
  public abstract get kind(): BoundNodeKind;
}
