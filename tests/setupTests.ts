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

import ResizeObserver from 'resize-observer-polyfill';
global.ResizeObserver = ResizeObserver;

import '@testing-library/jest-dom';
