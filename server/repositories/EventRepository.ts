import Container from 'typedi';
import { DataSource } from 'typeorm';
import { EventModel } from '../models/EventModel';

export const EventRepository = Container.get(DataSource)
  .getRepository(EventModel)
  .extend({
    async findAll(): Promise<EventModel[]> {
      return this.find();
    },

    async findPublished(): Promise<EventModel[]> {
      return this.findBy({ published: true });
    },

    async findByUuid(uuid: string): Promise<EventModel | null> {
      return this.findOneBy({ uuid });
    },
  });
