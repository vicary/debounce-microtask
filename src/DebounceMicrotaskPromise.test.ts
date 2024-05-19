import { assertRejects } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { debounceMicrotask as debounceMicrotaskPromise } from "./DebounceMicrotaskPromise.ts";

describe("debounceMicrotaskPromise", () => {
  it("should debounce", async () => {
    const fn = spy(() => {});
    const debounced = debounceMicrotaskPromise(fn);

    debounced();

    assertSpyCalls(fn, 0);

    debounced();

    assertSpyCalls(fn, 0);

    await debounced();

    assertSpyCalls(fn, 1);
  });

  it("should bail out after debounceLimit", async () => {
    const debounced = debounceMicrotaskPromise(() => {}, { debounceLimit: 1 });

    debounced();

    await Promise.resolve();

    assertRejects(debounced, `Maximum debounce limit reached.`);
  });

  it("should use the latest arguments", async () => {
    const fn = spy((_: number) => {});
    const debounced = debounceMicrotaskPromise(fn, { updateArguments: true });

    debounced(1);
    debounced(2);

    await debounced(3);

    assertSpyCall(fn, 0, { args: [3] });
  });

  it("should ignore the limit", async () => {
    const fn = spy(() => {});
    const debounced = debounceMicrotaskPromise(fn, {
      debounceLimit: 1,
      limitAction: "ignore",
    });

    debounced();
    debounced();

    await debounced();

    assertSpyCalls(fn, 1);
  });

  it("should invoke the function", async () => {
    const fn = spy(() => {});
    const debounced = debounceMicrotaskPromise(fn, {
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
