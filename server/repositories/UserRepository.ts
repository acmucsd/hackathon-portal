import { DataSource, In } from 'typeorm';
import { UserModel } from '../models/UserModel';
import Container from 'typedi';
import { Uid } from '../types/Internal';

export const UserRepository = Container.get(DataSource)
  .getRepository(UserModel)
  .extend({
    async findAll(): Promise<UserModel[]> {
      return this.find();
    },

    async findByUid(uid: Uid): Promise<UserModel | null> {
      return this.findOneBy({ uid });
    },

    async findByEmail(email: string): Promise<UserModel | null> {
      return this.findOneBy({ email });
    },

    async findByEmails(emails: string[]): Promise<UserModel[]> {
      return this.findBy({ email: In(emails) });
    },
  });
