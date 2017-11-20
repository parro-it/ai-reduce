import isAsyncIterable from "is-async-iterable";

const Unspecified = {};

/**
 * The reduce() method applies a function against an accumulator and each element
 * in the async iterable to reduce it to a single promise.
 * @param  {AsyncIterable} data        The async iterable to reduce
 * @param  {Function} reducer Function to execute on each element in the async iterable, taking four arguments:
 *     .
 *     ```
 *
 *     __data__ - The async iterable reduce was called upon.
 *
 *     __accumulator__ - The accumulator accumulates the callback's return values; it is
 *     the accumulated value previously returned in the last invocation of the
 *     callback, or initialValue, if supplied (see below).
 *
 *     __currentValue__ - The current element being processed in the async iterable.
 *
 *     __currentIndex__ - The index of the current element being processed in the async
 *     iterable. Starts at index 0, if an initialValue is provided, and at index 1
 *     otherwise.
 *     ```
 *
 * @param  {any} initialValue Value to use as the first argument to the first call of
 * the callback. If no initial value is supplied, the first element in the async iterable will
 * be used. Calling reduce on an empty async iterable without an initial value is an error.
 * @return {Promise}             The promise value that results from the reduction.
 */
export default async function reduce(data, reducer, initialValue) {
  if (typeof reducer !== "function") {
    throw new TypeError("reducer argument must be a function.");
  }

  if (!isAsyncIterable(data)) {
    throw new TypeError("data argument must be an iterable or async-iterable.");
  }

  let index = 0;
  let accumulator = initialValue;

  if (accumulator === undefined) {
    accumulator = Unspecified;
  }

  for await (const item of data) {
    if (accumulator === Unspecified) {
      accumulator = item;
    } else {
      accumulator = await reducer(accumulator, item, index, data);
    }
    index++;
  }

  if (accumulator === Unspecified) {
    throw new TypeError(
      "Reduce of empty async iterable with no initial value."
    );
  }

  return accumulator;
}

/**
 * Higher order function that partially apply `reducer` and
 * `accumulator` arguments to the reduce function.
 * @param  {Function} reducer     The reducer argument to partially apply
 * @param  {any} accumulator The accumulator argument to partially apply
 * @return {Function}           A `reduce` unary function that take a data argument
 */
reduce.with = (reducer, accumulator) => data =>
  reduce(data, reducer, accumulator);
