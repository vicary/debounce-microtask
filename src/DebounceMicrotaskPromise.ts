import {
  debounceMicrotask as debounce,
  type Function,
  type Options,
} from "./DebounceMicrotask.ts";

/**
 * Execute the function in the next microtask, if the function is called again
 * later in the event loop, push back the execution one more microtask
 * in the future.
 *
 * The debounced function will return a promise that resolves when the specified
 * callback is invoked.
 */
export const debounceMicrotask = <TArgs extends unknown[], TReturn>(
  fn: Function<TArgs, TReturn>,
  options?: Options,
): Function<TArgs, Promise<void>> => {
  let resolve: () => void;
  let reject: (error: Error) => void;
  let settled = false;

  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const debounceFn = debounce((...args: TArgs) => {
    try {
      fn(...args);
      resolve();
    } catch (e) {
      reject(e);
    } finally {
      settled = true;
    }
  }, options);

  return (...args: TArgs) => {
    if (!settled) {
      try {
        debounceFn(...args);
      } catch (e) {
        reject(e);
        settled = true;
      }
    }

    return promise;
  };
};
