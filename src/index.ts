import { simulateAsyncWork, executeWithThrottle } from './throttle';

// Gera tarefas assíncronas simuladas
const tasks: Array<() => Promise<string>> = Array.from(
    { length: 50 },
    (_, i) => () => simulateAsyncWork(i)
);

executeWithThrottle(tasks, 1);
