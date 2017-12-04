import isAsyncIterable from "is-async-iterable";

const Unspecified = {};

function checkReducerArgument(reducer) {
  if (typeof reducer !== "function") {
    throw new TypeError("reducer argument must be a function.");
  }
}

/**
 * The reduce() method applies a function against an accumulator and each element
 * in the async iterable to reduce it to a single promise.
 * @param  {AsyncIterable} data        The async iterable to reduce
 * @param  {Function} reducer Function to execute on each element in the async iterable, taking four arguments:
 *     .
 *     ```
 *
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
 *
 *     __data__ - The async iterable reduce was called upon.
 *     ```
 *
 * @param  {any} initialValue Value to use as the first argument to the first call of
 * the callback. If no initial value is supplied, the first element in the async iterable will
 * be used. Calling reduce on an empty async iterable without an initial value is an error.
 * @return {Promise}             The promise value that results from the reduction.
 */
export default async function reduce(data, reducer, initialValue) {
  checkReducerArgument(reducer);

  if (!isAsyncIterable(data)) {
    throw new TypeError("data argument must be an iterable or async-iterable.");
  }

  let index = 0;
  let accumulator = initialValue;

  if (accumulator === undefined) {
    accumulator = Unspecified;
  }
  const generator = data[Symbol.asyncIterator] || data[Symbol.iterator];
  const iterator = generator.call(data);

  let it = await iterator.next();
  while (!it.done) {
    if (accumulator === Unspecified) {
      accumulator = it.value;
    } else {
      accumulator = await reducer(accumulator, await it.value, index, data);
    }
    index++;
    it = await iterator.next();
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
reduce.with = (reducer, accumulator) => {
  checkReducerArgument(reducer);

  return data => reduce(data, reducer, accumulator);
};
