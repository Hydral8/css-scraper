const assert = require("assert").strict;

function freqSelector(ar, N) {
  /** Returns the top N frequently used values in the array

  @param {array} ar - containing all elements
  @params {int} N - number of top used values to return

  @returns {Array} An array of the top used values from the input array.
  */

  counts = {};

  for (item of ar) {
    counts[item] = counts[item] ? counts[item] + 1 : 1;
  }

  sortedKeys = Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .map((v) => new Object({ key: v, freq: counts[v] }));

  //   get only top N elements from sortedKeys, unless sortedKeys is smaller than N, then just gets the entire array
  if (sortedKeys.length < N) {
    return sortedKeys;
  }
  return sortedKeys.slice(0, N);
}

function runTests() {
  tests = [
    {
      ar: ["a", "a", "b", "c", "d", "a", "d", "e", "f"],
      N: 2,
      ans: [
        { key: "a", freq: 3 },
        { key: "d", freq: 2 },
      ],
    },
  ];
  function testFreqSelector({ ar, N, ans }) {
    topFreq = freqSelector(ar, N);
    assert.deepStrictEqual(topFreq, ans, "The two arrays don't match");
  }
  for (test of tests) {
    testFreqSelector(test);
  }
}
runTests();

module.exports = freqSelector;
