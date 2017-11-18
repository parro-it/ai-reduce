import isAsyncIterable from "is-async-iterable";

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
