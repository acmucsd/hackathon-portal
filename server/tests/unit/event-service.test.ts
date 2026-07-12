import { NotFoundError } from 'routing-controllers';
import type { EntityManager } from 'typeorm';
import { EventModel } from '../../models/EventModel';
import { TransactionsManager } from '../../repositories';
import { EventService } from '../../services/EventService';

describe('When an event exists by UUID', () => {
  test('Then, the event is returned', async () => {
    const event = new EventModel();
    event.uuid = 'event-1';
    const transactionsManager = {
      readOnly: <T>(work: (entityManager: EntityManager) => Promise<T>) => work({
        withRepository: () => ({ findByUuid: async () => event }),
      } as unknown as EntityManager),
    } as TransactionsManager;
    const service = new EventService(transactionsManager);

    await expect(service.findByUuid('event-1')).resolves.toBe(event);
  });
});

describe('When no event exists by UUID', () => {
  test('Then, a not found error is thrown', async () => {
    const transactionsManager = {
      readOnly: <T>(work: (entityManager: EntityManager) => Promise<T>) => work({
        withRepository: () => ({ findByUuid: async () => null }),
      } as unknown as EntityManager),
    } as TransactionsManager;
    const service = new EventService(transactionsManager);

    await expect(service.findByUuid('event-1')).rejects.toBeInstanceOf(NotFoundError);
  });
});
