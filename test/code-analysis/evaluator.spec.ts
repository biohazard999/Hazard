import { BoundExpression } from "../../src/code-analysis/binding/bound-expression";
import { Evaluator } from "../../src/code-analysis/evaluator";
import { SyntaxTree } from "../../src/code-analysis/syntax/syntax-tree";
import { Binder } from "./../../src/code-analysis/binding/binder";

describe("the evaluator", () => {
  function arrange(syntax: BoundExpression) {
    return new Evaluator(syntax);
  }

  function parseExpression(src: string) {
    const syntaxTree = SyntaxTree.parse(src);
    const binder = new Binder();
    return binder.bindExpression(syntaxTree.root);
  }

  it("should evaluate a single number", () => {
    const evaluator = arrange(parseExpression("1"));

    expect(evaluator.evaluate()).toBe(1);
  });

  describe("binary expressions", () => {
    describe("addition", () => {
      it("1+1=2", () => {
        const evaluator = arrange(parseExpression("1+1"));

        expect(evaluator.evaluate()).toBe(2);
      });

      it("1+101=102", () => {
        const evaluator = arrange(parseExpression("1+101"));

        expect(evaluator.evaluate()).toBe(102);
      });

      it("40+2=42", () => {
        const evaluator = arrange(parseExpression("40+2"));

        expect(evaluator.evaluate()).toBe(42);
      });
    });

    describe("subtraction", () => {
      it("1-1=0", () => {
        const evaluator = arrange(parseExpression("1-1"));

        expect(evaluator.evaluate()).toBe(0);
      });

      it("1-101=-100", () => {
        const evaluator = arrange(parseExpression("1-101"));

        expect(evaluator.evaluate()).toBe(-100);
      });

      it("40-2=38", () => {
        const evaluator = arrange(parseExpression("40-2"));

        expect(evaluator.evaluate()).toBe(38);
      });
    });

    describe("multiplication", () => {
      it("1*1=1", () => {
        const evaluator = arrange(parseExpression("1*1"));

        expect(evaluator.evaluate()).toBe(1);
      });

      it("2*101=202", () => {
        const evaluator = arrange(parseExpression("2*101"));

        expect(evaluator.evaluate()).toBe(202);
      });

      it("40*2=80", () => {
        const evaluator = arrange(parseExpression("40*2"));

        expect(evaluator.evaluate()).toBe(80);
      });
    });

    describe("division", () => {
      it("1/1=1", () => {
        const evaluator = arrange(parseExpression("1/1"));

        expect(evaluator.evaluate()).toBe(1);
      });

      it("4/2=2", () => {
        const evaluator = arrange(parseExpression("4/2"));

        expect(evaluator.evaluate()).toBe(2);
      });

      it("40/2=20", () => {
        const evaluator = arrange(parseExpression("40/2"));

        expect(evaluator.evaluate()).toBe(20);
      });
    });

    describe("modulo", () => {
      it("1%1=0", () => {
        const evaluator = arrange(parseExpression("1%1"));

        expect(evaluator.evaluate()).toBe(0);
      });

      it("4%2=0", () => {
        const evaluator = arrange(parseExpression("4%2"));

        expect(evaluator.evaluate()).toBe(0);
      });

      it("40%3=1", () => {
        const evaluator = arrange(
          parseExpression("40%3"),
        );

        expect(evaluator.evaluate()).toBe(1);
      });
    });
  });

  describe("parenthesis", () => {
    describe("simple", () => {
      it("should calculate (1+2)*2=6", () => {
        const tree = parseExpression("(1+2)*2=6");
        const evaluator = arrange(tree);

        expect(evaluator.evaluate()).toBe(6);
      });
    });
  });
});
