import { DataSource, In } from 'typeorm';
import { UserModel } from '../models/UserModel';
import Container from 'typedi';

export const UserRepository = Container.get(DataSource)
  .getRepository(UserModel)
  .extend({
    async findAll(): Promise<UserModel[]> {
      return this.find();
    },

    async findById(id: string): Promise<UserModel | null> {
      return this.findOneBy({ id });
    },

    async findByEmail(email: string): Promise<UserModel | null> {
      return this.findOneBy({ email });
    },

    async findByEmails(emails: string[]): Promise<UserModel[]> {
      return this.findBy({ email: In(emails) });
    },
  });
