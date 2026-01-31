/**
 * @jest-environment jsdom
 */

// @ts-ignore
window.storage = {
    appendData: jest.fn(),
    loadAllFiles: jest.fn(),
    listenData: jest.fn(),
}

import '@testing-library/jest-dom';
