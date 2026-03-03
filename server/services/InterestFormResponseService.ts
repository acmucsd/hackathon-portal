import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { NotFoundError } from 'routing-controllers';
import { InterestFormResponseModel } from '../models/InterestFormResponseModel';

@Service()
export class InterestFormResponseService {
  private transactionsManager: TransactionsManager;

  constructor(transactionsManager: TransactionsManager) {
    this.transactionsManager = transactionsManager;
  }

    public async addInterestedEmail(
    email: string,
  ): Promise<InterestFormResponseModel> {

    const existingInterest = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories
          .interestFormResponse(entityManager)
          .findInterestByEmail(email),
    );

    const interestAlreadyExists = existingInterest !== null;
    if (interestAlreadyExists) {
      return existingInterest;
    }

    const interest = await this.transactionsManager.readWrite(
      async (entityManager) => {
        const interestFormResponseRepository =
          Repositories.interestFormResponse(entityManager);

        const newInterest = interestFormResponseRepository.create({
          email: email,
        });

        const createdInterest =
          interestFormResponseRepository.save(newInterest);

        return createdInterest;
      },
    );

    return interest;
  }

public async addInterestedPhone(
    phone: string,
  ): Promise<InterestFormResponseModel> {

    const existingInterest = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories
          .interestFormResponse(entityManager)
          .findInterestByPhone(phone),
    );

    const interestAlreadyExists = existingInterest !== null;
    if (interestAlreadyExists) {
      return existingInterest;
    }

    const interest = await this.transactionsManager.readWrite(
      async (entityManager) => {
        const interestFormResponseRepository =
          Repositories.interestFormResponse(entityManager);

        const newInterest = interestFormResponseRepository.create({
          phone: phone,
        });

        const createdInterest =
          interestFormResponseRepository.save(newInterest);

        return createdInterest;
      },
    );

    return interest;
  }


  public async addListOfInterestedEmails(
  emails: string[],
): Promise<InterestFormResponseModel[]> {

  const newInterests = await this.transactionsManager.readWrite(
    async (entityManager) => {
      const interestFormResponseRepository =
        Repositories.interestFormResponse(entityManager);

        const addedEmails = await interestFormResponseRepository
        .createQueryBuilder()
        .insert()
        .into(InterestFormResponseModel)
        .values(emails.map((email)=>({ email })))
        .orIgnore()
        .returning('*')
        .execute();

        return addedEmails.raw as InterestFormResponseModel[];
    },
  );

  return newInterests;

}

  public async addListOfInterestedPhones(
  phones: string[],
): Promise<InterestFormResponseModel[]> {

  const newInterests = await this.transactionsManager.readWrite(
    async (entityManager) => {
      const interestFormResponseRepository =
        Repositories.interestFormResponse(entityManager);

        const addedPhones = await interestFormResponseRepository
        .createQueryBuilder()
        .insert()
        .into(InterestFormResponseModel)
        .values(phones.map((phone)=>({ phone })))
        .orIgnore()
        .returning('*')
        .execute();

        return addedPhones.raw as InterestFormResponseModel[];
    },
  );

  return newInterests;

}

  public async removeInterestedEmail(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase();

    const interest = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories
          .interestFormResponse(entityManager)
          .findInterestByEmail(normalizedEmail),
    );

    if (!interest) {
      throw new NotFoundError('Interested email not found');
    }

    await this.transactionsManager.readWrite(async (entityManager) =>
      Repositories
        .interestFormResponse(entityManager)
        .remove(interest),
    );
  }

  public async removeInterestedPhone(phone: string): Promise<void> {

    const interest = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories
          .interestFormResponse(entityManager)
          .findInterestByPhone(phone),
    );

    if (!interest) {
      throw new NotFoundError('Interested phone not found');
    }

    await this.transactionsManager.readWrite(async (entityManager) =>
      Repositories
        .interestFormResponse(entityManager)
        .remove(interest),
    );
  }


  public async checkEmailForInterest(email: string): Promise<boolean> {

    const interestedEmail = await this.transactionsManager.readOnly(
         async (entityManager) =>
           Repositories.interestFormResponse(entityManager).findInterestByEmail(email),
       );
      const emailInterestFound = interestedEmail !== null;
      return emailInterestFound;

  }

  public async checkPhoneForInterest(phone: string): Promise<boolean> {

    const interestedPhone = await this.transactionsManager.readOnly(
         async (entityManager) =>
           Repositories.interestFormResponse(entityManager).findInterestByPhone(phone),
       );
      const phoneInterestFound = interestedPhone !== null;
      return phoneInterestFound;

  }

  public async checkEmailsForInterest(emails: string[]): Promise<Map<string, boolean>> {
    const interestByEmail = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.interestFormResponse(entityManager).findInterestByEmails(emails),
      );
    return interestByEmail;
  }

  public async checkPhonesForInterest(phones: string[]): Promise<Map<string, boolean>> {
    const interestByPhone = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.interestFormResponse(entityManager).findInterestByPhones(phones),
      );
    return interestByPhone;
  }

    public async findAllInterestedEmailAndPhone(): Promise<InterestFormResponseModel[]> {

    const interestedEmailAndPhoneList = await this.transactionsManager.readOnly(
         async (entityManager) =>
           Repositories.interestFormResponse(entityManager).findAllInterest(),
       );

      return interestedEmailAndPhoneList;

  }
}

