import { DataSource, EntityManager, QueryFailedError } from 'typeorm';
import { adminAuth } from '../../FirebaseAuth';
import { UserModel } from '../../models/UserModel';
import { TransactionsManager } from '../../repositories';
import type { FetchAiHandleValidationService } from '../../services/FetchAiHandleValidationService';
import type { HouseService } from '../../services/HouseService';
import { UserService } from '../../services/UserService';

jest.mock('../../FirebaseAuth', () => ({
  adminAuth: {
    createUser: jest.fn().mockResolvedValue({ uid: 'firebase-uid' }),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  },
}));

const signup = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@ucsd.edu',
  password: 'password123',
};

function serializationFailure() {
  return new QueryFailedError('COMMIT', [], Object.assign(new Error(), { code: '40001' }));
}

function signupWithOutcomes(...outcomes: { saveError?: Error; commitError?: Error }[]) {
  const save = jest.fn();
  const entityManager = {
    query: jest.fn().mockResolvedValue(undefined),
    withRepository: () => ({
      findByEmail: jest.fn().mockResolvedValue(null),
      create: (fields: Partial<UserModel>) => Object.assign(new UserModel(), fields),
      save,
    }),
  } as unknown as EntityManager;

  const transaction = jest.fn();
  for (const { saveError, commitError } of outcomes) {
    transaction.mockImplementationOnce(async (_isolation, run) => {
      save.mockImplementationOnce(async (user: UserModel) => {
        if (saveError) throw saveError;
        return user;
      });
      try {
        const user = await run(entityManager);
        if (commitError) throw commitError;
        return user;
      } finally {
        expect(adminAuth.deleteUser).not.toHaveBeenCalled();
      }
    });
  }

  const service = new UserService(
    {} as HouseService,
    new TransactionsManager({ transaction } as unknown as DataSource),
    {} as FetchAiHandleValidationService,
  );
  return { result: service.createUser(signup), transaction, save };
}

test('reuses the original Firebase UID after a serialization failure at commit', async () => {
  const { result, transaction, save } = signupWithOutcomes({ commitError: serializationFailure() }, {});

  await expect(result).resolves.toMatchObject({ id: 'firebase-uid', email: signup.email });
  expect(transaction).toHaveBeenCalledTimes(2);
  expect(adminAuth.createUser).toHaveBeenCalledTimes(1);
  expect(save).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: 'firebase-uid' }));
  expect(save).toHaveBeenNthCalledWith(2, expect.objectContaining({ id: 'firebase-uid' }));
  expect(adminAuth.deleteUser).not.toHaveBeenCalled();
});

test('deletes the new Firebase user after a failed save rolls back', async () => {
  const saveError = new Error('Save failed');
  const { result } = signupWithOutcomes({ saveError });
  await expect(result).rejects.toBe(saveError);
  expect(adminAuth.deleteUser).toHaveBeenCalledWith('firebase-uid');
});

test('deletes the new Firebase user after the last serialization failure', async () => {
  const commitError = serializationFailure();
  const { result, transaction } = signupWithOutcomes({ commitError }, { commitError }, { commitError });
  await expect(result).rejects.toBe(commitError);
  expect(transaction).toHaveBeenCalledTimes(3);
  expect(adminAuth.createUser).toHaveBeenCalledTimes(1);
  expect(adminAuth.deleteUser).toHaveBeenCalledTimes(1);
  expect(adminAuth.deleteUser).toHaveBeenCalledWith('firebase-uid');
});

test('keeps the Firebase user if the commit outcome is unknown', async () => {
  const commitError = new Error('Connection lost during commit');
  const { result } = signupWithOutcomes({ commitError });
  await expect(result).rejects.toBe(commitError);
  expect(adminAuth.deleteUser).not.toHaveBeenCalled();
});
