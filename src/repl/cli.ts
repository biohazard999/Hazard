import chalk from "chalk";
import { EOL } from "os";
// tslint:disable:no-console

const eolRegEx = new RegExp(EOL + "$");

export const trimEOL = (str: string) => str.replace(eolRegEx, "");

const stdout = process.stdout;

export const write = (...str: string[]) => str.forEach((s) => stdout.write(s));

export const writeGray = (...str: string[]) =>
  str.forEach((s) => write(chalk.gray(s)));

export const writeRed = (...str: string[]) =>
  str.forEach((s) => write(chalk.red(s)));

export const writeGreen = (...str: string[]) =>
  str.forEach((s) => write(chalk.green(s)));

export const writeYellow = (...str: string[]) =>
  str.forEach((s) => write(chalk.yellow(s)));

export const moveLeft = (offset: number) => {
  if (offset > 0) {
    while (offset--) {
      write("\x1B[1D");
    }
  }
};

export const moveRight = (offset: number) => {
  if (offset > 0) {
    while (offset--) {
      write("\x1B[1C");
    }
  }
};

export const eraseToEol = () => write("\x1B[K");

export const replaceLine = (str: string) => write("\x1B[1000D\x1B[K" + str);

export const clear = () => write("\x1Bc");

export const error = console.error;
export const log = console.log;
