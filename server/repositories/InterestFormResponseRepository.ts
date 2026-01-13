import Container from 'typedi';
import { DataSource } from 'typeorm';
import { InterestFormResponseModel } from '../models/InterestFormResponseModel';

export const InterestFormResponseRepository = Container.get(DataSource)
  .getRepository(InterestFormResponseModel)
  .extend({
    async addInterestByEmail(email: string): Promise<InterestFormResponseModel> {
      const interest = this.create({ email: email });
      return this.save(interest);
    },
    async findInterestByEmail(email: string): Promise<InterestFormResponseModel | null> {
      return this.findOneBy({ email });
    },
    async findAllInterest(): Promise<InterestFormResponseModel[]> {
      return this.find();
    },

  });
