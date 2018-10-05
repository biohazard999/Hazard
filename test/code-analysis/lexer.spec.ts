import { isDigit } from "../../src/code-analysis/lexer";

describe("the lexer", () => {
  describe("helper function", () => {
    describe("isDigit", () => {
      it("1 should be true", () => {
        expect(isDigit("1")).toBe(true);
      });

      it("10 should be false", () => {
        expect(isDigit("10")).toBe(false);
      });

      it("0 should be true", () => {
        expect(isDigit("0")).toBe(true);
      });
    });
  });
});
