describe('partial mocking', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('mockOne, mockTwo, mockThree should not log into console', async () => {
    jest.doMock('./index', () => {
      const originalModule =
        jest.requireActual<typeof import('./index')>('./index');
      return {
        __esModule: true,
        ...originalModule,
        mockOne: jest.fn(),
        mockTwo: jest.fn(),
        mockThree: jest.fn(),
      };
    });

    const { mockOne, mockTwo, mockThree } = await import('./index');

    mockOne();
    mockTwo();
    mockThree();

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  test('unmockedFunction should log into console', async () => {
    jest.dontMock('./index');

    const { unmockedFunction } = await import('./index');

    unmockedFunction();

    expect(consoleSpy).toHaveBeenCalledWith('I am not mocked');
  });
});
