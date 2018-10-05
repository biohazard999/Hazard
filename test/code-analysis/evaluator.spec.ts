import { Evaluator } from "../../src/code-analysis/evaluator";
import { ExpressionSyntax } from "../../src/code-analysis/expression-syntax";
import { BinaryExpressionSyntax } from "../../src/code-analysis/expression-syntax-binary";
import { NumberExpressionSyntax } from "../../src/code-analysis/expression-syntax-number";
import { ParenthesizedExpressionSyntax } from "../../src/code-analysis/expression-syntax-parenthesis";
import { SyntaxKind } from "../../src/code-analysis/syntax-kind";
import { SyntaxToken } from "../../src/code-analysis/syntax-token";

describe("the evaluator", () => {
  function arrange(syntax: ExpressionSyntax) {
    return new Evaluator(syntax);
  }

  function createNumberExpression(number: number) {
    return new NumberExpressionSyntax(
      new SyntaxToken("NumberExpression", 0, number.toString(), number),
    );
  }

  function createBinaryExpression(
    operator: SyntaxKind,
    left: number | SyntaxToken,
    right: number | SyntaxToken,
  ) {
    return new BinaryExpressionSyntax(
      typeof left === "number" ? createNumberExpression(left) : left,
      new SyntaxToken(operator),
      typeof right === "number" ? createNumberExpression(right) : right,
    );
  }

  function createParenthesizedExpression(expression: SyntaxToken) {
    return new ParenthesizedExpressionSyntax(
      new SyntaxToken("OpenParenthesesToken"),
      expression,
      new SyntaxToken("CloseParenthesesToken"),
    );
  }

  it("should evaluate a single number", () => {
    const evaluator = arrange(createNumberExpression(1));

    expect(evaluator.evaluate()).toBe(1);
  });

  describe("binary expressions", () => {
    describe("addition", () => {
      it("1+1=2", () => {
        const evaluator = arrange(createBinaryExpression("PlusToken", 1, 1));

        expect(evaluator.evaluate()).toBe(2);
      });

      it("1+101=102", () => {
        const evaluator = arrange(createBinaryExpression("PlusToken", 1, 101));

        expect(evaluator.evaluate()).toBe(102);
      });

      it("40+2=42", () => {
        const evaluator = arrange(createBinaryExpression("PlusToken", 40, 2));

        expect(evaluator.evaluate()).toBe(42);
      });
    });

    describe("subtraction", () => {
      it("1-1=0", () => {
        const evaluator = arrange(createBinaryExpression("MinusToken", 1, 1));

        expect(evaluator.evaluate()).toBe(0);
      });

      it("1-101=-100", () => {
        const evaluator = arrange(createBinaryExpression("MinusToken", 1, 101));

        expect(evaluator.evaluate()).toBe(-100);
      });

      it("40-2=38", () => {
        const evaluator = arrange(createBinaryExpression("MinusToken", 40, 2));

        expect(evaluator.evaluate()).toBe(38);
      });
    });

    describe("multiplication", () => {
      it("1*1=1", () => {
        const evaluator = arrange(createBinaryExpression("StarToken", 1, 1));

        expect(evaluator.evaluate()).toBe(1);
      });

      it("2*101=202", () => {
        const evaluator = arrange(createBinaryExpression("StarToken", 2, 101));

        expect(evaluator.evaluate()).toBe(202);
      });

      it("40*2=80", () => {
        const evaluator = arrange(createBinaryExpression("StarToken", 40, 2));

        expect(evaluator.evaluate()).toBe(80);
      });
    });

    describe("division", () => {
      it("1/1=1", () => {
        const evaluator = arrange(createBinaryExpression("SlashToken", 1, 1));

        expect(evaluator.evaluate()).toBe(1);
      });

      it("4/2=2", () => {
        const evaluator = arrange(createBinaryExpression("SlashToken", 4, 2));

        expect(evaluator.evaluate()).toBe(2);
      });

      it("40/2=20", () => {
        const evaluator = arrange(createBinaryExpression("SlashToken", 40, 2));

        expect(evaluator.evaluate()).toBe(20);
      });
    });

    describe("modulo", () => {
      it("1%1=0", () => {
        const evaluator = arrange(createBinaryExpression("PercentToken", 1, 1));

        expect(evaluator.evaluate()).toBe(0);
      });

      it("4%2=0", () => {
        const evaluator = arrange(createBinaryExpression("PercentToken", 4, 2));

        expect(evaluator.evaluate()).toBe(0);
      });

      it("40%3=1", () => {
        const evaluator = arrange(
          createBinaryExpression("PercentToken", 40, 3),
        );

        expect(evaluator.evaluate()).toBe(1);
      });
    });
  });

  describe("parenthesis", () => {
    describe("simple", () => {
      it("should calculate (1+2)*2=6", () => {
        const tree = createBinaryExpression(
          "StarToken",
          createParenthesizedExpression(
            createBinaryExpression("PlusToken", 1, 2),
          ),
          createNumberExpression(2),
        );
        const evaluator = arrange(tree);

        expect(evaluator.evaluate()).toBe(6);
      });
    });
  });
});
