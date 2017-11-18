import test from "tape-async";
import aiReduce from ".";

test("exports a function", t => {
  t.is(typeof aiReduce, "function");
});
