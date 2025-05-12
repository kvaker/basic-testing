import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    expect(simpleCalculator({ a: 5, b: 3, action: Action.Add })).toBe(8);
  });

  test('should subtract two numbers', () => {
    expect(simpleCalculator({ a: 10, b: 4, action: Action.Subtract })).toBe(6);
  });

  test('should multiply two numbers', () => {
    expect(simpleCalculator({ a: 7, b: 6, action: Action.Multiply })).toBe(42);
  });

  test('should divide two numbers', () => {
    expect(simpleCalculator({ a: 20, b: 4, action: Action.Divide })).toBe(5);
  });

  test('should exponentiate two numbers', () => {
    expect(simpleCalculator({ a: 2, b: 3, action: Action.Exponentiate })).toBe(
      8,
    );
  });

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a: 2, b: 3, action: '%' })).toBeNull();
  });

  test('should return null for non-number arguments', () => {
    expect(simpleCalculator({ a: '2', b: 3, action: Action.Add })).toBeNull();
    expect(simpleCalculator({ a: 2, b: '3', action: Action.Add })).toBeNull();
    expect(simpleCalculator({ a: null, b: 3, action: Action.Add })).toBeNull();
  });

  test('should return null when any argument is missing', () => {
    expect(simpleCalculator({ a: 2, b: 3, action: undefined })).toBeNull();
    expect(
      simpleCalculator({ a: 2, b: undefined, action: Action.Add }),
    ).toBeNull();
    expect(
      simpleCalculator({ a: undefined, b: 3, action: Action.Add }),
    ).toBeNull();
  });
});
