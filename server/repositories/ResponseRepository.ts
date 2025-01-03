import Container from 'typedi';
import { DataSource } from 'typeorm';
import { UserModel } from '../models/UserModel';
import { ResponseModel } from '../models/ResponseModel';

export const ResponseRepository = Container.get(DataSource)
  .getRepository(ResponseModel)
  .extend({
    async findAll(): Promise<ResponseModel[]> {
      return this.find();
    },

    async findByUuid(uuid: string): Promise<ResponseModel | null> {
      return this.findOneBy({ uuid });
    },

    async findResponsesForUser(user: UserModel): Promise<ResponseModel[]> {
      return this.findBy({ user });
    },
  });
