import { Type } from "../types/type";
import { BoundNode } from "./bound-node";
import { BoundNodeKind } from "./bound-node-kind";

export abstract class BoundExpression implements BoundNode {
    public abstract get type(): Type;
    public abstract get kind(): BoundNodeKind;
}
