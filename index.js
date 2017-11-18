import isAsyncIterable from "is-async-iterable";

/**
 * The reduce() method applies a function against an accumulator and each element
 * in the async iterable to reduce it to a single promise.
 * @param  {[type]} reducer Function to execute on each element in the async iterable, taking four arguments:
 *     accumulator - The accumulator accumulates the callback's return values; it is the accumulated value
 *      previously returned in the last invocation of the callback, or initialValue, if supplied (see below).
 *     currentValue - The current element being processed in the async iterable.
 *     currentIndex - The index of the current element being processed in the async
 *      iterable. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 *     data - The async iterable reduce was called upon.
 * @param  {[type]} accumulator Value to use as the first argument to the first call of
 * the callback. If no initial value is supplied, the first element in the async iterable will
 * be used. Calling reduce on an empty async iterable without an initial value is an error.
 * @param  {[type]} data        The async iterable to reduce
 * @return {[type]}             The promise value that results from the reduction.
 */
export default async function reduce(reducer, accumulator, data) {
  if (typeof reducer !== "function") {
    throw new TypeError("reducer argument must be a function.");
  }

  if (typeof data === "undefined") {
    return reduce.bind(null, reducer, accumulator);
  }

  if (!isAsyncIterable(data)) {
    throw new TypeError("data argument must be an iterable or async-iterable.");
  }

  let index = 0;
  for await (const item of data) {
    accumulator = await reducer(accumulator, item, index++, data);
  }

  return accumulator;
}
