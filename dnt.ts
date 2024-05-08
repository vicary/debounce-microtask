// Bundle src/DebounceMicrotask.ts into both ESM and CJS format.
import { build, emptyDir } from "@deno/dnt";
import pkg from "./deno.json" with { type: "json" };

await emptyDir("./dnt");

await build({
  entryPoints: ["./DebounceMicrotask.ts"],
  outDir: "./dnt",
  shims: {
    deno: "dev",
  },
  importMap: "./deno.json",
  package: {
    name: "debounce-microtasks", // debounce-microtask is taken and abandoned.
    version: pkg.version,
    description: "Debounce a function using microtasks instead of timers.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/vicary/debounce-microtask.git",
    },
    bugs: {
      url: "https://github.com/vicary/debounce-microtask/issues",
    },
    keywords: [
      "microtask",
      "debounce",
      "throttle",
      "rate",
      "limit",
      "batch",
    ],
    funding: {
      type: "github",
      url: "https://github.com/sponsors/vicary",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "dnt/LICENSE");
    Deno.copyFileSync("README.md", "dnt/README.md");
  },
});
