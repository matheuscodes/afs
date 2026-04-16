describe('app bootstrap', () => {
  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '';
  });

  test('creates and renders react root when container exists', () => {
    document.body.innerHTML = '<div id="internal-app"></div>';
    const renderMock = jest.fn();
    const createRootMock = jest.fn(() => ({ render: renderMock }));

    jest.doMock('react-dom/client', () => ({
      createRoot: createRootMock,
    }));
    jest.doMock('../src/store', () => jest.fn(() => ({})));
    jest.doMock('../src/Application', () => ({
      __esModule: true,
      default: () => null,
    }));

    require('../src/app');

    expect(createRootMock).toHaveBeenCalledWith(document.getElementById('internal-app'));
    expect(renderMock).toHaveBeenCalledTimes(1);
  });

  test('does not create root when container is missing', () => {
    const createRootMock = jest.fn();

    jest.doMock('react-dom/client', () => ({
      createRoot: createRootMock,
    }));
    jest.doMock('../src/store', () => jest.fn(() => ({})));
    jest.doMock('../src/Application', () => ({
      __esModule: true,
      default: () => null,
    }));

    require('../src/app');

    expect(createRootMock).not.toHaveBeenCalled();
  });
});
