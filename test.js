import test from "tape-async";
import reduce from ".";

const arr = [42, 43];

const add = (accum, item) => accum + item;
const rejection = p => p.catch(err => err);
const fail = () => {
  throw new Error("test");
};

test("exports a function", async t => {
  t.is(typeof reduce, "function");
});

test("reduce to a sum", async t => {
  const tot = await reduce(arr, add, 1);
  t.is(tot, 86);
});

test("the initial accumulator value default to the first item", async t => {
  const tot = await reduce(arr, add);
  t.is(tot, 85);
});

test("can be partially applied", async t => {
  const sum = reduce.with(add, 1);
  const tot = await sum(arr);
  t.is(tot, 86);
});

test("initial accumulator value default to the first item when partially applied", async t => {
  const reduceSum = reduce.with(add);
  const tot = await reduceSum(arr);
  t.is(tot, 85);
});

test("reducer receive item, index, iterable", async t => {
  const result = [];
  await reduce(
    arr,
    (accumulator, item, index, iterable) => {
      result.push(index);
      t.is(iterable, arr);
    },
    0
  );

  t.deepEqual(result, [0, 1]);
});

test("first index is 1 when initial accumulator not provided", async t => {
  const first = [];
  const data = [first, ...arr];
  const result = await reduce(data, (accumulator, item, index) =>
    accumulator.concat(index)
  );

  t.deepEqual(result, [1, 2]);
});

test("predicate could return a promise", async t => {
  const tot = await reduce(arr, (accum, item) => Promise.resolve(accum + item));
  t.is(tot, 85);
});

test("throw async if data is not an async iterable", async t => {
  const err = await rejection(reduce(0, () => 0));

  t.is(err.message, "data argument must be an iterable or async-iterable.");
});

test("throw async if reducer is not a function", async t => {
  const err = await rejection(reduce([0], 0));
  t.is(err.message, "reducer argument must be a function.");
});

test("throw async if reducer throws", async t => {
  const err = await rejection(reduce(["ciao"], fail, 0));
  t.is(err.message, "test");
});

test("throw async during iteration if reducer return a rejected promise", async t => {
  const err = await rejection(reduce(["ciao"], async () => fail(), 0));
  t.is(err.message, "test");
});
