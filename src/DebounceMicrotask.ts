export type Function<TArgs extends unknown[], TReturn> = (
  ...args: TArgs
) => TReturn;

const enqueue = typeof queueMicrotask === "function"
  ? queueMicrotask
  : (fn: Function<unknown[], unknown>): unknown => Promise.resolve().then(fn);

/**
 * Options for the debounceMicrotask function.
 */
export type Options = {
  /**
   * Maximum consecutive microtasks to push before bailing out for infinite
   * loops.
   *
   * @default 1000
   */
  debounceLimit?: number;

  /**
   * Actions to take when the debounce limit is reached.
   */
  limitAction?: "ignore" | "invoke" | "throw";

  /**
   * Enable this to update the arguments of the function to the latest
   * invocation, it uses the arguments from the first invocation by default.
   *
   * @default false
   */
  updateArguments?: boolean;
};

/**
 * Execute the function in the next microtask, if the function is called again
 * later in the event loop, push back the execution one more microtask
 * in the future.
 */
export const debounceMicrotask = <TArgs extends unknown[], TReturn>(
  fn: Function<TArgs, TReturn>,
  options?: Options,
): Function<TArgs, void> => {
  let queued = false;
  let { debounceLimit = 1000 } = options ?? {};
  let currentArgs: TArgs | undefined;

  return (...args: TArgs) => {
    if (options?.updateArguments) {
      currentArgs = args;
    } else {
      currentArgs ??= args;
    }

    if (queued) return;

    if (debounceLimit-- <= 0) {
      switch (options?.limitAction) {
        case "ignore":
          return;
        case "invoke":
          return fn(...currentArgs!);
        case "throw":
        default:
          throw new Error(`Maximum debounce limit reached.`);
      }
    }

    queued = true;

    enqueue(dequeue);

    function dequeue() {
      if (queued) {
        queued = false;

        enqueue(dequeue);
      } else {
        debounceLimit = options?.debounceLimit ?? 1000;
        fn(...currentArgs!);
      }
    }
  };
};
