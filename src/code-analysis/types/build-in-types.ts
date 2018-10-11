import { Type } from "./type";

export const Int32 = new Type("int32");
export const Bool = new Type("boolean");

export function getType(obj: any) {
  return typeof obj === "boolean" ? Bool : Int32;
}
