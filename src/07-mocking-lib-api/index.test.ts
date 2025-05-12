import axios from 'axios';
import { throttledGetDataFromApi } from './index';
import type { AxiosInstance } from 'axios';

jest.mock('lodash', () => {
  const actual = jest.requireActual('lodash');
  return {
    ...actual,
    throttle: jest.fn((fn) => fn),
  };
});

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const getMock = jest.fn();

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    const mockedInstance: Partial<AxiosInstance> = {
      get: getMock,
    };

    mockedAxios.create.mockReturnValue(mockedInstance as AxiosInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    getMock.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi('/posts');

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const testPath = '/posts/1';
    getMock.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi(testPath);

    expect(getMock).toHaveBeenCalledWith(testPath);
  });

  test('should return response data', async () => {
    const mockData = { id: 1, title: 'Test' };
    getMock.mockResolvedValue({ data: mockData });

    const result = await throttledGetDataFromApi('/posts/1');

    expect(result).toEqual(mockData);
  });

  test('should throttle multiple rapid calls (only first will run)', async () => {
    const mockData = { id: 1, title: 'Test' };
    getMock.mockResolvedValue({ data: mockData });

    const promise1 = throttledGetDataFromApi('/posts/1');
    const promise2 = throttledGetDataFromApi('/posts/2');

    const result1 = await promise1;
    const result2 = await promise2;

    expect(result1).toEqual(mockData);
    expect(result2).toEqual(mockData);
    expect(getMock).toHaveBeenCalledTimes(2);
  });
});
