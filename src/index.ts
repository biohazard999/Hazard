import chalk from "chalk";
import { EOL } from "os";

import { SyntaxNode } from "./code-analysis/syntax-node";
import { SyntaxToken } from "./code-analysis/syntax-token";
import { SyntaxTree } from "./code-analysis/syntax-tree";
import { Evaluator } from "./evaluator";
// tslint:disable:no-console

const eolRegEx = new RegExp(EOL + "$");
const trimEOL = (str: string) => str.replace(eolRegEx, "");

const stdin = process.openStdin();
const stdout = process.stdout;
const readLine = () =>
  new Promise<string>((resolve) => {
    stdin.once("data", (data: string | Buffer) => {
      const text = trimEOL(
        typeof data === "string" ? data : data.toString("utf8"),
      );
      resolve(text);
    });
  });

const write = (str: string) => stdout.write(str);
const writeGray = (str: string) => write(chalk.gray(str));
const writeRed = (str: string) => write(chalk.red(str));
const writeGreen = (str: string) => write(chalk.green(str));
const writeYellow = (str: string) => write(chalk.yellow(str));

const clear = () => write("\x1Bc");

const prettyPrint = (
  node: SyntaxNode,
  indent: string = "",
  isLast: boolean = true,
) => {
  // ├──
  // └──
  // │

  const marker = isLast ? "└──" : "├──";

  writeGray(indent);
  writeGray(marker);
  writeGray(node.kind);

  if (node instanceof SyntaxToken && node.value) {
    writeGray(" ");
    writeGray(node.value);
  }

  write("\n");

  indent += isLast ? "   " : "│  ";

  const lastChild = node.children[node.children.length - 1];

  for (const child of node.children) {
    prettyPrint(child, indent, child === lastChild);
  }
};

(async () => {
  let debug = false;
  clear();

  while (true) {
    stdout.write("> ");

    const line = await readLine();

    if (line.trim() === "#debug") {
      debug = !debug;
      writeYellow(`Debug mode ${debug ? "enabled" : "disabled"}`);
      write("\n");
      continue;
    }

    if (line.trim() === "#cls") {
      clear();
      continue;
    }

    if (debug) {
      console.log("input: ", line.split(""));
    }

    const syntaxTree = SyntaxTree.parse(line);

    if (debug) {
      prettyPrint(syntaxTree.root);
    }

    if (syntaxTree.diagnostics.length === 0) {
      const evaluator = new Evaluator(syntaxTree.root);
      const result = evaluator.evaluate();

      writeGreen(`${result}`);
      write("\n");
    } else {
      for (const diagnostics of syntaxTree.diagnostics) {
        writeRed(diagnostics);
        write("\n");
      }
    }
  }
})().catch(console.error);
