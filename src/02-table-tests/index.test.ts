import { simpleCalculator, Action } from './index';

describe('simpleCalculator', () => {
  test.each([
    { a: 1, b: 2, action: Action.Add, expected: 3 },
    { a: 5, b: 3, action: Action.Subtract, expected: 2 },
    { a: 4, b: 2, action: Action.Multiply, expected: 8 },
    { a: 10, b: 2, action: Action.Divide, expected: 5 },
    { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  ])(
    'should return $expected for $a $action $b',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );

  test.each([
    { a: 1, b: 2, action: '%' },
    { a: 1, b: 2, action: null },
    { a: 1, b: 2, action: 'invalid' },
  ])('should return null for invalid action: $action', ({ a, b, action }) => {
    const result = simpleCalculator({ a, b, action });
    expect(result).toBeNull();
  });

  test.each([
    { a: '1', b: 2, action: Action.Add },
    { a: 1, b: '2', action: Action.Multiply },
    { a: null, b: 2, action: Action.Divide },
    { a: 1, b: undefined, action: Action.Subtract },
  ])('should return null for invalid arguments: $a, $b', ({ a, b, action }) => {
    const result = simpleCalculator({ a, b, action });
    expect(result).toBeNull();
  });
});
