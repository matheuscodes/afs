/**
 * @jest-environment jsdom
 */

declare global {
  interface Window {
    storage: {
      appendData: jest.Mock;
      loadAllFiles: jest.Mock;
      listenData: jest.Mock;
    };
    filesystem: {
      readFile: jest.Mock;
    };
  }
}

window.storage = {
  appendData: jest.fn(),
  loadAllFiles: jest.fn(),
  listenData: jest.fn(),
};

window.filesystem = {
  readFile: jest.fn(),
};

import '@testing-library/jest-dom';

const originalConsoleError = console.error;

console.error = (...args: unknown[]) => {
  const message = args.map((arg) => String(arg ?? '')).join(' ');
  if (message.includes('Unsupported style property') && message.includes('-webkit-font-smoothing')) {
    return;
  }
  originalConsoleError(...args);
};
