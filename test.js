import test from "tape-async";
import reduce from ".";
import AsyncIterable from "asynciterable";

function reducer(accum, item) {
  return accum + item.answer;
}

test("exports a function", async t => {
  t.is(typeof reduce, "function");
});

function fromArray(arr) {
  return new AsyncIterable((write, end) => {
    arr.forEach(write);
    end();
  });
}

test("reduce to a sum", async t => {
  const arr = [{ answer: 42 }, { answer: 43 }];
  const tot = await reduce(reducer, 0, fromArray(arr));
  t.is(tot, 85);
});

test("reducer receive item, index, iterable", async t => {
  const arr = fromArray([{ answer: 42 }, { answer: 43 }]);
  const result = [];
  await reduce(
    (accumulator, item, index, iterable) => {
      result.push({ index });
      t.is(iterable, arr);
      return true;
    },
    0,
    arr
  );

  t.deepEqual(result, [{ index: 0 }, { index: 1 }]);
});

test("predicate could return a promise", async t => {
  const arr = [{ answer: 42 }, { answer: 43 }];
  const tot = await reduce(
    async (accum, item) => {
      return accum + item.answer;
    },
    0,
    fromArray(arr)
  );
  t.is(tot, 85);
});

test("throw async if data is not an async iterable", async t => {
  const err = await reduce(() => 0, 0, 0).catch(err => err);

  t.is(err.message, "data argument must be an iterable or async-iterable.");
});

test("throw async if data is reducer is not a function", async t => {
  const err = await reduce(0, 0, 0).catch(err => err);

  t.is(err.message, "reducer argument must be a function.");
});

test("throw async during iteration if reducer throws", async t => {
  const err = await reduce(
    () => {
      throw new Error("test");
    },
    0,
    fromArray(["ciao"])
  ).catch(err => err);

  t.is(err.message, "test");
});

test("throw async during iteration if predicate rejected", async t => {
  const err = await reduce(
    async () => {
      throw new Error("test");
    },
    0,
    fromArray(["ciao"])
  ).catch(err => err);

  t.is(err.message, "test");
});
