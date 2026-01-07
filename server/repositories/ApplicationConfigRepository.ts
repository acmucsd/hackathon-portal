import Container from 'typedi';
import { DataSource } from 'typeorm';
import { ApplicationConfigModel } from '../models/ApplicationConfigModel';

export const ApplicationConfigRepository = Container.get(DataSource)
  .getRepository(ApplicationConfigModel)
  .extend({
    async findSingleton(): Promise<ApplicationConfigModel | null> {
      return this.findOne({
        where: { id: 1 },
      });
    },
  });