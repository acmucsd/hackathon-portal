import { DataSource, In } from 'typeorm';
import { UserModel } from '../models/UserModel';
import Container from 'typedi';
import { House } from '../types/Enums';

export const UserRepository = Container.get(DataSource)
  .getRepository(UserModel)
  .extend({
    async findAll(): Promise<UserModel[]> {
      return this.find();
    },

    async findAllWithReviewerRelation(): Promise<UserModel[]> {
      return this.find({ relations: ['reviewer', 'reviewees'] });
    },

    async findById(id: string): Promise<UserModel | null> {
      return this.findOneBy({ id });
    },

    async findByIds(ids: string[]): Promise<UserModel[]> {
      return this.findBy({ id: In(ids) });
    },

    async findByIdWithReviewerRelation(id: string): Promise<UserModel | null> {
      return this.findOne({
        where: { id },
        relations: ['reviewer', 'reviewees'],
      });
    },

    async findByIdWithLastDecisionUpdatedByRelation(id: string): Promise<UserModel | null> {
      return this.findOne({
        where: { id },
        relations: ['lastDecisionUpdatedBy'],
      });
    },

    async findByIdsWithReviewerRelation(ids: string[]): Promise<(UserModel | null)[]> {
      return this.find({
        where: { id: In(ids) },
        relations: ['reviewer', 'reviewees'],
      });
    },

    async findByEmail(email: string): Promise<UserModel | null> {
      return this.findOneBy({ email });
    },

    async findByEmails(emails: string[]): Promise<UserModel[]> {
      return this.findBy({ email: In(emails) });
    },

    async getHeadcountsByHouse(): Promise<{ house: House; count: number }[]> {
      return this.createQueryBuilder('user')
        .select('user.house', 'house')
        .addSelect('COUNT(*)', 'count')
        .groupBy('user.house')
        .getRawMany();
    },

    async getPointsSumByHouse(): Promise<{ house: House; points: number }[]> {
      return this.createQueryBuilder('user')
        .select('user.house', 'house')
        .addSelect('SUM(user.points)', 'points')
        .groupBy('user.house')
        .getRawMany();
    },
  });
