import { simulateAsyncWork, executeWithThrottle } from './throttle';
import pino from 'pino';

// Mocking do pino logger
jest.mock('pino', () => {
  const error = jest.fn();
  const info = jest.fn();
  return jest.fn(() => ({ info, error }));
});

describe('simulateAsyncWork', () => {
  it('should complete with the correct message', async () => {
    const result = await simulateAsyncWork(1);
    expect(result).toBe('Task 1 completed');
  });
});

describe('executeWithThrottle', () => {
  const originalConsole = console.info;
  beforeEach(() => {
    console.info = jest.fn(); // Mock console.info if needed
  });

  afterEach(() => {
    console.info = originalConsole;
  });

  it('should execute all tasks with throttling', async () => {
    const tasks = Array.from({ length: 5 }, (_, i) => () => simulateAsyncWork(i));
    await executeWithThrottle(tasks, 2);

    // Verifica se o logger.info foi chamado corretamente
    const logger = pino();
    expect(logger.info).toHaveBeenCalledTimes(tasks.length + 1); // +1 for the 'All tasks completed.' log
    expect(logger.error).not.toHaveBeenCalled();
  });
});
