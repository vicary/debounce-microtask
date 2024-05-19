// Bundle mod.ts into both ESM and CJS format.
import { build } from "@deno/dnt";
import pkg from "./deno.json" with { type: "json" };

await Deno.remove("./dnt", { recursive: true }).catch(() => {});

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./dnt",
  shims: {
    deno: "dev",
  },
  importMap: "./deno.json",
  package: {
    name: "debounce-microtasks", // debounce-microtask is taken and abandoned.
    version: pkg.version,
    description: pkg.description,
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
  async postBuild() {
    // steps to run after building and before running the tests
    await Deno.copyFile("LICENSE", "dnt/LICENSE");
    await Deno.copyFile("README.md", "dnt/README.md");
  },
  typeCheck: "both",
});
