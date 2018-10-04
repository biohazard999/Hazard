import { error } from "./repl/cli";
import { Repl } from "./repl/repl";

(async () => {
  const repl = new Repl();
  await repl.start();
})().catch(error);
