jest.mock('lodash', () => ({
  random: jest.fn(),
}));

import {
  getBankAccount,
  TransferFailedError,
  SynchronizationFailedError,
  InsufficientFundsError,
} from '.';
import { random } from 'lodash';

describe('BankAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create account with initial balance', () => {
    const account = getBankAccount(100);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError when withdrawing more than balance', () => {
    const account = getBankAccount(50);
    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const account1 = getBankAccount(50);
    const account2 = getBankAccount(0);
    expect(() => account1.transfer(100, account2)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const account = getBankAccount(100);
    account.deposit(50);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(100);
    account.withdraw(40);
    expect(account.getBalance()).toBe(60);
  });

  test('should transfer money', () => {
    const account1 = getBankAccount(100);
    const account2 = getBankAccount(50);
    account1.transfer(30, account2);
    expect(account1.getBalance()).toBe(70);
    expect(account2.getBalance()).toBe(80);
  });

  test('fetchBalance should return number if request did not fail', async () => {
    (random as jest.Mock)
      .mockImplementationOnce(() => 75)
      .mockImplementationOnce(() => 1);

    const account = getBankAccount(0);
    const result = await account.fetchBalance();
    expect(result).toBe(75);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    (random as jest.Mock)
      .mockImplementationOnce(() => 90)
      .mockImplementationOnce(() => 1);

    const account = getBankAccount(10);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(90);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    (random as jest.Mock)
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 0);

    const account = getBankAccount(10);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
