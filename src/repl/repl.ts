import { EOL } from "os";

import { Evaluator } from "../code-analysis/evaluator";
import { SyntaxNode } from "../code-analysis/syntax/syntax-node";
import { SyntaxToken } from "../code-analysis/syntax/syntax-token";
import { SyntaxTree } from "../code-analysis/syntax/syntax-tree";
import {
  clear,
  log,
  moveLeft,
  moveRight,
  replaceLine,
  trimEOL,
  write,
  writeGray,
  writeGreen,
  writeRed,
  writeYellow,
} from "./cli";

export type ReplCommand = "Prev" | "Next" | "Exit" | "Quit";

export interface IReplData {
  buffer: string;
}

export type ReplInput = IReplData | ReplCommand;

export class Repl {
  private _stdin?: NodeJS.Socket;

  private get stdin(): NodeJS.Socket {
    if (!this._stdin) {
      this._stdin = this.initRepl();
    }
    return this._stdin;
  }

  private historyCursor?: number;
  private history: string[] = [];
  private cursor: number = 0;
  private currentBuffer: string[] = [];

  public async start() {
    let debug = false;
    clear();

    while (true) {
      write("> ");

      const input = await this.readInput();

      if (input === "Prev") {
        continue;
      }
      if (input === "Next") {
        continue;
      }

      if (input === "Exit") {
        process.exit(0);
        break;
      }
      if (input === "Quit") {
        process.exit(0);
        break;
      }

      const line = input.buffer;

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

      if (line.trim() === "#ch") {
        this.historyCursor = undefined;
        this.history = [];
        continue;
      }

      if (debug) {
        log("input: ", line.split(""));
      }

      const syntaxTree = SyntaxTree.parse(line);

      if (debug) {
        this.prettyPrint(syntaxTree.root);
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
  }

  private initRepl(): NodeJS.Socket {
    const stdin = process.openStdin();
    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(true);
    }

    stdin.resume();
    stdin.setEncoding("utf8");
    return stdin;
  }

  private readInput(): Promise<ReplInput> {
    // const inputBuffer: string[] = [];
    this.currentBuffer = [];

    return new Promise<ReplInput>((r) => {
      const listener = (data: string | Buffer) => {
        const resolve = (d: ReplInput) => {
          this.stdin.removeListener("data", listener);
          r(d);
        };

        const text = trimEOL(
          typeof data === "string" ? data : data.toString("utf8"),
        );

        switch (text) {
          case "\u001b[A": // Up
          case "\u001b[5~": // Page up
            this.currentBuffer = [...this.prevHistory()];
            this.replaceLine(this.currentBuffer.join(""));
            break;
          case "\u001b[B": // Down
          case "\u001b[6~": // Page down
            this.currentBuffer = [...this.nextHistory()];
            this.replaceLine(this.currentBuffer.join(""));
            break;
          case "\u001b[C": // Right
            this.moveRight();
            break;
          case "\u001b[D": // Left
            this.moveLeft();
            break;
          case "\u0003":
            resolve("Exit");
            break;
          case "\u001a":
            resolve("Quit");
            break;
          case "\b": // Backspace
            moveLeft(1);
            this.currentBuffer.splice(this.cursor, 1);
            if (this.cursor > 0) {
              this.cursor--;
            }
            write(" ");
            moveLeft(1);
            break;
          case "\u001b[3~": // Del
            break;
          case "\u001b[1~": // Home
            this.moveToBegin();
            break;
          case "\u001b[4~": // End
            this.moveToEnd();
            break;
          case "\r": // Return
            write(EOL);
            const command = this.currentBuffer.join("");
            this.pushHistory(command);
            this.cursor = 0;
            resolve({
              buffer: command,
            });
            break;
          case "\u001b": // Esc
            this.currentBuffer = [];
            this.historyCursor = undefined;
            this.replaceLine(this.currentBuffer.join(""));
            break;
          default:
            // console.log([text]);
            write(text);
            this.currentBuffer[this.cursor] = text;
            this.cursor++;
            break;
        }
      };
      this.stdin.on("data", listener);
    });
  }

  private pushHistory(command: string) {
    const lastHistory = this.history[this.history.length - 1];
    if (lastHistory !== command) {
      this.history.push(command);
      this.historyCursor = undefined;
    }
  }

  private prevHistory() {
    if (this.historyCursor === undefined) {
      this.historyCursor =
        this.history.length > 0 ? this.history.length - 1 : 0;
    } else {
      if (this.historyCursor > 0) {
        this.historyCursor--;
      }
    }
    const history = this.history[this.historyCursor];
    return history ? history.split("") : [];
  }

  private nextHistory() {
    if (this.historyCursor === undefined) {
      this.historyCursor =
        this.history.length > 0 ? this.history.length - 1 : 0;
    } else {
      if (this.historyCursor < this.history.length - 1) {
        this.historyCursor++;
      }
    }
    const history = this.history[this.historyCursor];
    return history ? history.split("") : [];
  }

  private moveLeft() {
    if (this.cursor <= 0) {
      return;
    }
    this.cursor--;
    moveLeft(1);
  }

  private moveRight() {
    if (this.cursor > this.currentBuffer.length - 1) {
      return;
    }
    this.cursor++;
    moveRight(1);
  }

  private replaceLine(str: string) {
    replaceLine("> " + str);
    this.cursor = str.length;
  }

  private moveToBegin() {
    write("\x1B[1000D\x1B[2C");
    this.cursor = 0;
  }

  private moveToEnd() {
    this.replaceLine(this.currentBuffer.join(""));
  }

  private prettyPrint(
    node: SyntaxNode,
    indent: string = "",
    isLast: boolean = true,
  ) {
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
      this.prettyPrint(child, indent, child === lastChild);
    }
  }
}
