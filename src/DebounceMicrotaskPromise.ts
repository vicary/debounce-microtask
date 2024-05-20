import {
  debounceMicrotask as debounce,
  type Function,
  type Options,
} from "./DebounceMicrotask.ts";

/**
 * @module
 *
 * A simple utility to debounce a function to the next microtask, returning
 * promises that resolves with the next execution.
 */

/**
 * Execute the function in the next microtask, if the function is called again
 * later in the event loop, push back the execution one more microtask
 * in the future.
 *
 * The debounced function will return a promise that resolves with the return
 * value when the specified function is executed, while the non-promise version
 * has no way to capture the return values.
 */
export const debounceMicrotask = <TArgs extends unknown[], TReturn>(
  fn: Function<TArgs, TReturn>,
  options?: Options,
): Function<TArgs, Promise<TReturn>> => {
  let resolve: (result: TReturn) => void;
  let reject: (error: Error) => void;
  let settled = false;

  let promise = new Promise<TReturn>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const debounceFn = debounce((...args: TArgs) => {
    try {
      resolve(fn(...args));
    } catch (e) {
      reject(e);
    } finally {
      settled = true;
    }
  }, options);

  return (...args: TArgs) => {
    if (settled) {
      promise = new Promise<TReturn>((res, rej) => {
        resolve = res;
        reject = rej;
      });

      settled = false;
    } else {
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
