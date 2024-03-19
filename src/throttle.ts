import pino from 'pino';

const logger = pino();

// Simula uma tarefa assíncrona com um delay aleatório para representar a carga de trabalho
const simulateAsyncWork = (id: number): Promise<string> => {
    const delay = Math.random() * 1000; // Delay aleatório até 1 segundo
    return new Promise((resolve) =>
        setTimeout(() => resolve(`Task ${id} completed`), delay)
    );
};

// Função para executar tarefas assíncronas com controle de workers otimizado
const executeWithThrottle = async (
    tasks: Array<() => Promise<string>>,
    maxWorkers: number
) => {
    const executeTask = async (task: () => Promise<string>) => {
        try {
            const result = await task();
            logger.info(result);
        } catch (error) {
            logger.error('Error executing task:', error);
        }
    };

    const taskPromises = [];
    for (let i = 0; i < maxWorkers && i < tasks.length; i++) {
        taskPromises.push(executeTask(tasks[i]));
    }

    for (let i = maxWorkers; i < tasks.length; i++) {
        // Aguarda a conclusão de qualquer worker antes de atribuir uma nova tarefa
        await Promise.race(taskPromises);
        taskPromises.push(executeTask(tasks[i]));
    }

    // Aguarda a conclusão de todas as tarefas
    await Promise.all(taskPromises);
    logger.info('All tasks completed.');
};

export { simulateAsyncWork, executeWithThrottle };
