import { DataSource, EntityManager, QueryFailedError } from 'typeorm';
import { TransactionsManager } from '../../repositories';

const transaction = jest.fn();
const manager = new TransactionsManager({ transaction } as unknown as DataSource);

function databaseError(code: string) {
  return new QueryFailedError('COMMIT', [], Object.assign(new Error(), { code }));
}

beforeEach(() => {
  transaction.mockReset();
});

test('runs the callback in a fresh transaction after a serialization failure at commit', async () => {
  const firstManager = {} as EntityManager;
  const secondManager = {} as EntityManager;
  const callback = jest.fn(async (_manager: EntityManager) => 'saved');

  transaction.mockImplementationOnce(async (_isolation, run) => {
    await run(firstManager);
    throw databaseError('40001');
  });
  transaction.mockImplementationOnce(async (_isolation, run) => run(secondManager));

  await expect(manager.readWrite(callback, { maxAttempts: 3 })).resolves.toBe('saved');
  expect(transaction).toHaveBeenCalledTimes(2);
  expect(transaction).toHaveBeenCalledWith('SERIALIZABLE', callback);
  expect(callback).toHaveBeenNthCalledWith(1, firstManager);
  expect(callback).toHaveBeenNthCalledWith(2, secondManager);
});

test('returns the last failure when the attempt limit is reached', async () => {
  const lastFailure = databaseError('40001');
  transaction.mockRejectedValueOnce(databaseError('40001'));
  transaction.mockRejectedValueOnce(lastFailure);

  await expect(manager.readWrite(async () => 'saved', { maxAttempts: 2 })).rejects.toBe(lastFailure);
  expect(transaction).toHaveBeenCalledTimes(2);
});

test('does not retry a unique constraint violation', async () => {
  const duplicate = databaseError('23505');
  transaction.mockRejectedValue(duplicate);

  await expect(manager.readWrite(async () => 'saved', { maxAttempts: 3 })).rejects.toBe(duplicate);
  expect(transaction).toHaveBeenCalledTimes(1);
});

test('defaults to one attempt', async () => {
  const failure = databaseError('40001');
  transaction.mockRejectedValue(failure);

  await expect(manager.readWrite(async () => 'saved')).rejects.toBe(failure);
  expect(transaction).toHaveBeenCalledTimes(1);
});
