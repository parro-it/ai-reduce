# ai-reduce

[![Travis Build Status](https://img.shields.io/travis/parro-it/ai-reduce/master.svg)](http://travis-ci.org/parro-it/ai-reduce)
[![NPM downloads](https://img.shields.io/npm/dt/ai-reduce.svg)](https://npmjs.org/package/ai-reduce)

> Reduce for async iterables.

The reduce() method applies a function against an accumulator and each element
in the array (from left to right) to reduce it to a single value.

## Async iterable fun

**This module is part of
[Async iterable fun](https://github.com/parro-it/ai-fun), a complete toolset of
modules to work with async iterables.**

## Usage

description of the example

```js
const aiReduce = require("ai-reduce");

console.log({ aiReduce });
```

This will output

```

```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### index

The reduce() method applies a function against an accumulator and each element
in the async iterable to reduce it to a single promise.

**Parameters**

* `reducer` **\[type]** Function to execute on each element in the async
  iterable, taking four arguments:

```
        accumulator - The accumulator accumulates the callback's return values; it is the accumulated value
         previously returned in the last invocation of the callback, or initialValue, if supplied (see below).
        currentValue - The current element being processed in the async iterable.
        currentIndex - The index of the current element being processed in the async
         iterable. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
        data - The async iterable reduce was called upon.
```

* `accumulator` **\[type]** Value to use as the first argument to the first call
  of the callback. If no initial value is supplied, the first element in the
  async iterable will be used. Calling reduce on an empty async iterable without
  an initial value is an error.
* `data` **\[type]** The async iterable to reduce

Returns **\[type]** The promise value that results from the reduction.

## Install

With [npm](https://npmjs.org/) installed, run

```bash
npm install --save ai-reduce
```

## See Also

* [`noffle/common-readme`](https://github.com/noffle/common-readme)
* [`parro-it/ai-fun`](https://github.com/parro-it/ai-fun)

## License

MIT
