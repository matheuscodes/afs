describe('app bootstrap', () => {
  const setupAppMocks = (createRootMock: jest.Mock) => {
    jest.doMock('react-dom/client', () => ({
      createRoot: createRootMock,
    }));
    jest.doMock('../src/store', () => jest.fn(() => ({})));
    jest.doMock('../src/Application', () => ({
      __esModule: true,
      default: () => null,
    }));
  };

  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '';
  });

  test('creates and renders react root when container exists', () => {
    document.body.innerHTML = '<div id="internal-app"></div>';
    const renderMock = jest.fn();
    const createRootMock = jest.fn(() => ({ render: renderMock }));
    setupAppMocks(createRootMock);

    require('../src/app');

    expect(createRootMock).toHaveBeenCalledWith(document.getElementById('internal-app'));
    expect(renderMock).toHaveBeenCalledTimes(1);
  });

  test('does not create root when container is missing', () => {
    const createRootMock = jest.fn();
    setupAppMocks(createRootMock);
    expect(() => require('../src/app')).not.toThrow();

    expect(createRootMock).not.toHaveBeenCalled();
  });
});
