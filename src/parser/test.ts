import { parseAndEvaluate } from './parser.ts';

const tests = [
  { input: '1 + 2 = 3', expected: true },
  { input: '2 * 3 + 4 = 10', expected: true },
  { input: '2 * (3 + 4) = 10', expected: false },
  { input: '6 = 10 / 2 + 1', expected: true },
  { input: '12 + 3 != 4 / 2 + 5', expected: true },
  { input: '2 + 3 * 2 = 10', expected: false },
  { input: '2 * 3 + 4 != 10', expected: false },
  { input: '1 + (2 = 3', expected: 'error' },
  // Extra cases
  { input: '((2 + 2) * 2) = 8', expected: true },
  { input: '3 + 4 * 2 = 11', expected: true },
  { input: '5 / (2 - 2) = 0', expected: 'error' },
];

tests.forEach(({ input, expected }, i) => {
  const result = parseAndEvaluate(input);
  if (result.error) {
    if (expected === 'error') {
      console.log(`Test ${i + 1} PASSED (error as expected): ${input}`);
    } else {
      console.error(`Test ${i + 1} FAILED: ${input}\n  Error: ${result.error}`);
    }
  } else {
    if (result.result === expected) {
      console.log(`Test ${i + 1} PASSED: ${input} => ${result.result}`);
    } else {
      console.error(`Test ${i + 1} FAILED: ${input} => ${result.result}, expected ${expected}`);
    }
  }
});

