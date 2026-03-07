import Container from 'typedi';
import { DataSource, In } from 'typeorm';
import { UserModel } from '../models/UserModel';
import { ResponseModel } from '../models/ResponseModel';
import { FormType } from '../types/Enums';

export const ResponseRepository = Container.get(DataSource)
  .getRepository(ResponseModel)
  .extend({
    async findAll(): Promise<ResponseModel[]> {
      return this.find();
    },

    async findAllWithUserRelation(): Promise<ResponseModel[]> {
      return this.find({ relations: {
        user: true,
      } });
    },

    async findAllWithReviewerRelation(): Promise<ResponseModel[]> {
      return this.find({ relations: {
        user: {
          reviewer: true,
        },
      } });
    },

    async findByUuid(uuid: string): Promise<ResponseModel | null> {
      return this.findOneBy({ uuid });
    },

    async findResponsesForUser(user: UserModel): Promise<ResponseModel[]> {
      return this.find({
        where: {
          user: {
            id: user.id,
          },
        },
        relations: { user: true },
      });
    },

    async findResponsesForUserByType(user: UserModel, formType: FormType): Promise<ResponseModel[]> {
      return this.find({
        where: {
          user: {
            id: user.id,
          },
          formType,
        },
        relations: { user: true },
      });
    },

    async findResponsesForUsersByType(userIds: string[], formType: FormType): Promise<ResponseModel[]> {
      return this.find({
        where: {
          user: {
            id: In(userIds),
          },
          formType,
        },
        relations: { user: true },
      });
    },

  });
