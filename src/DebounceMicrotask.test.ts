import { assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { debounceMicrotask } from "./DebounceMicrotask.ts";

describe("debounceMicrotask", () => {
  it("should debounce", async () => {
    const fn = spy(() => {});
    const debounced = debounceMicrotask(fn);

    debounced();

    assertSpyCalls(fn, 0);

    debounced();

    assertSpyCalls(fn, 0);

    await Promise.resolve().then();

    assertSpyCalls(fn, 1);
  });

  it("should bail out after debounceLimit", async () => {
    const debounced = debounceMicrotask(() => {}, { debounceLimit: 1 });

    debounced();

    await Promise.resolve();

    assertThrows(() => debounced(), `Maximum debounce limit reached.`);
  });

  it("should use the latest arguments", async () => {
    const fn = spy((_: number) => {});
    const debounced = debounceMicrotask(fn, { updateArguments: true });

    debounced(1);
    debounced(2);

    await Promise.resolve().then();

    assertSpyCall(fn, 0, { args: [2] });
  });

  it("should ignore the limit", async () => {
    const fn = spy(() => {});
    const debounced = debounceMicrotask(fn, {
      debounceLimit: 1,
      limitAction: "ignore",
    });

    debounced();
    debounced();

    await Promise.resolve().then();

    assertSpyCalls(fn, 1);
  });

  it("should invoke the function", async () => {
    const fn = spy(() => {});
    const debounced = debounceMicrotask(fn, {
      debounceLimit: 1,
      limitAction: "invoke",
    });

    debounced();

    await Promise.resolve();

    debounced();

    await Promise.resolve();

    assertSpyCalls(fn, 2);
  });
});
