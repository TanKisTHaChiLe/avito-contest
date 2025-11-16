import '@testing-library/jest-dom';

// Исправленный полифилл для structuredClone
global.structuredClone = (val: any) => {
  if (val === undefined) return undefined;
  return JSON.parse(JSON.stringify(val));
};

// Добавьте для решения проблемы с TextEncoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
}));

Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('ReactDOM.render is no longer supported') ||
        args[0].includes('Error fetching ads') ||
        args[0].includes('Error approving ad') ||
        args[0].includes('Error rejecting ad') ||
        args[0].includes('Error fetching ad') ||
        args[0].includes('Network error'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
