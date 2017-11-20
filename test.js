import test from "tape-async";
import reduce from ".";

function reducer(accum, item) {
  return accum + item.answer;
}

function sum(accum, item) {
  return accum + item;
}

test("exports a function", async t => {
  t.is(typeof reduce, "function");
});

test("reduce to a sum", async t => {
  const arr = [{ answer: 42 }, { answer: 43 }];
  const tot = await reduce(arr, reducer, 1);
  t.is(tot, 86);
});

test("the initial accumulator value default to the first item", async t => {
  const arr = [42, 43];
  const tot = await reduce(arr, sum);
  t.is(tot, 85);
});

test("can be partially applied", async t => {
  const sum = reduce.with(reducer, 1);
  const tot = await sum([{ answer: 42 }, { answer: 43 }]);
  t.is(tot, 86);
});

test("initial accumulator value default to the first item when partially applied", async t => {
  const reduceSum = reduce.with(sum);
  const tot = await reduceSum([42, 43]);
  t.is(tot, 85);
});

test("reducer receive item, index, iterable", async t => {
  const arr = [{ answer: 42 }, { answer: 43 }];
  const result = [];
  await reduce(
    arr,
    (accumulator, item, index, iterable) => {
      result.push({ index });
      t.is(iterable, arr);
      return true;
    },
    0
  );

  t.deepEqual(result, [{ index: 0 }, { index: 1 }]);
});

test("first index is 1 when initial accumulator not provided", async t => {
  const arr = [42, 43];
  const result = [];
  await reduce(arr, (accumulator, item, index, iterable) => {
    result.push(index);
    t.is(accumulator, arr[0]);
    t.is(iterable, arr);
    return accumulator;
  });

  t.deepEqual(result, [1]);
});

test("predicate could return a promise", async t => {
  const arr = [{ answer: 42 }, { answer: 43 }];
  const tot = await reduce(
    arr,
    async (accum, item) => {
      return accum + item.answer;
    },
    0
  );
  t.is(tot, 85);
});

test("throw async if data is not an async iterable", async t => {
  const err = await reduce(0, () => 0, 0).catch(err => err);

  t.is(err.message, "data argument must be an iterable or async-iterable.");
});

test("throw async if data is reducer is not a function", async t => {
  const err = await reduce(0, 0, 0).catch(err => err);

  t.is(err.message, "reducer argument must be a function.");
});

test("throw async during iteration if reducer throws", async t => {
  const err = await reduce(
    ["ciao"],
    () => {
      throw new Error("test");
    },
    0
  ).catch(err => err);

  t.is(err.message, "test");
});

test("throw async during iteration if predicate rejected", async t => {
  const err = await reduce(
    ["ciao"],
    async () => {
      throw new Error("test");
    },
    0
  ).catch(err => err);

  t.is(err.message, "test");
});
