import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { CreateEvent } from '../types/ApiRequests';
import { EventModel } from '../models/EventModel';
import { NotFoundError } from 'routing-controllers';

@Service()
export class EventService {
  private transactionsManager: TransactionsManager;

  constructor(transactionsManager: TransactionsManager) {
    this.transactionsManager = transactionsManager;
  }

  public async createEvent(createEvent: CreateEvent): Promise<EventModel> {
    return this.transactionsManager.readWrite(async (entityManager) => {
      const eventRepository = Repositories.event(entityManager);
      const newEvent = eventRepository.create(createEvent);
      const createdEvent = eventRepository.save(newEvent);
      return createdEvent;
    });
  }

  public async getAllEvents(): Promise<EventModel[]> {
    return this.transactionsManager.readOnly(async (entityManager) =>
      Repositories.event(entityManager).findAll(),
    );
  }

  public async getPublishedEvents(): Promise<EventModel[]> {
    return this.transactionsManager.readOnly(async (entityManager) =>
      Repositories.event(entityManager).findPublished(),
    );
  }

  public async findByUuid(uuid: string): Promise<EventModel> {
    const event = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.event(entityManager).findByUuid(uuid),
    );
    if (!event) throw new NotFoundError('Event not found');
    return event;
  }

  public async updateByUuid(
    uuid: string,
    changes: Partial<EventModel>,
  ): Promise<EventModel> {
    return this.transactionsManager.readWrite(async (entityManager) => {
      const eventRepository = Repositories.event(entityManager);
      const currentEvent = await eventRepository.findByUuid(uuid);
      if (!currentEvent) throw new NotFoundError('Event not found');
      const newEvent = eventRepository.merge(currentEvent, changes);
      const updatedEvent = eventRepository.save(newEvent);
      return updatedEvent;
    });
  }

  public async deleteByUuid(uuid: string): Promise<void> {
    this.transactionsManager.readWrite(async (entityManager) => {
      const eventRepository = Repositories.event(entityManager);
      const event = await eventRepository.findByUuid(uuid);
      if (!event) throw new NotFoundError('Event not found');
      await eventRepository.remove(event);
    });
  }
}
