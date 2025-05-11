import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(1000);

    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();

    doStuffByInterval(callback, 500);

    jest.advanceTimersByTime(1500);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(path, 'join').mockReturnValue('/mock/path');
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await readFileAsynchronously('somefile.txt');

    expect(joinSpy).toHaveBeenCalledWith(__dirname, 'somefile.txt');
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(path, 'join').mockReturnValue('/mock/path');
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously('nofile.txt');

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(path, 'join').mockReturnValue('/mock/path');
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsPromises.readFile as jest.Mock).mockResolvedValue(
      Buffer.from('mock content'),
    );

    const result = await readFileAsynchronously('file.txt');

    expect(result).toBe('mock content');
  });
});
