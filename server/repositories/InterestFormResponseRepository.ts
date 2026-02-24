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
    async findInterestByEmails(emails: string[]): Promise<Map<string, boolean>> {
      if (emails.length === 0) {
        return new Map();
      }

      const found = await this.createQueryBuilder('interest')
        .select('interest.email')
        .where('interest.email IN (:...emails)', { emails })
        .getMany();

      const foundEmailSet = new Set(found.map(i => i.email));

      // returns a map that holds true/false for each email
      return new Map(
        emails.map(email => [email, foundEmailSet.has(email)]),
      );
    },
  });
