import { Service } from 'typedi';
import * as path from 'path';
import { Repositories, TransactionsManager } from '../repositories';
import { ResponseModel } from '../models/ResponseModel';
import { UserModel } from '../models/UserModel';
import { ApplicationStatus, FormType, MediaType } from '../types/Enums';
import { Application } from '../types/Application';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { File } from '../types/ApiRequests';
import { StorageService } from './StorageService';

@Service()
export class ResponseService {
  private storageService: StorageService;

  private transactionsManager: TransactionsManager;

  constructor(
    storageService: StorageService,
    transactionsManager: TransactionsManager,
  ) {
    this.storageService = storageService;
    this.transactionsManager = transactionsManager;
  }

  public async getUserResponses(user: UserModel): Promise<ResponseModel[]> {
    const response = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.response(entityManager).findResponsesForUser(user),
    );
    return response;
  }

  public async getUserResponseByUuid(
    user: UserModel,
    uuid: string,
  ): Promise<ResponseModel> {
    const response = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.response(entityManager).findByUuid(uuid),
    );
    if (!response || response.user !== user)
      throw new Error('Response not found');
    return response;
  }

  public async getUserApplication(user: UserModel): Promise<ResponseModel> {
    const userResponses = await this.getUserResponses(user);
    const application = userResponses.find(
      (response) => response.formType === FormType.APPLICATION,
    );
    if (!application) throw new NotFoundError('No application found for user');
    return application;
  }

  public async submitUserApplication(
    user: UserModel,
    application: Application,
    resume: File,
  ) {
    // 1. Error if the user has already applied.
    if (user.applicationStatus !== ApplicationStatus.NOT_SUBMITTED) {
      throw new Error('User has already applied');
    }

    // 2. Error if a response has already been submitted.
    try {
      await this.getUserApplication(user);
      throw new Error('User has already applied');
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        throw error;
      }
    }

    // Error if resume is not a pdf
    if (path.extname(resume.originalname) !== '.pdf')
      throw new BadRequestError("Filetype must be '.pdf'");

    // Upload resume
    const fileName = resume.originalname.substring(
      0,
      resume.originalname.lastIndexOf('.'),
    );
    const url = await this.storageService.uploadToFolder(
      resume,
      MediaType.RESUME,
      fileName,
      user.id,
    );

    // 3. Insert the response into the database.
    const response = await this.transactionsManager.readWrite(
      async (entityManager) => {
        const responseRepository = Repositories.response(entityManager);
        const newResponse = responseRepository.create({
          user,
          formType: FormType.APPLICATION,
          data: { ...application, resumeLink: url },
        });
        const createdResponse = responseRepository.save(newResponse);
        return createdResponse;
      },
    );

    // 4. Update the user's applicationStatus.
    await this.transactionsManager.readWrite(async (entityManager) => {
      const userRepository = Repositories.user(entityManager);
      user = userRepository.merge(user, {
        applicationStatus: ApplicationStatus.SUBMITTED,
      });
      userRepository.save(user);
    });

    // 5. Return the database object back to the user.
    return response;
  }

  public async updateUserApplication(
    user: UserModel,
    updateApplication: Application,
    resume?: File,
  ): Promise<ResponseModel> {
    const application = await this.getUserApplication(user);

    console.log(resume);
    if (resume) {
      // Error if resume is not a pdf
      if (path.extname(resume.originalname) !== '.pdf')
        throw new BadRequestError("Filetype must be '.pdf'");

      // Delete previous resume
      this.storageService.deleteAtUrl(application.data.resumeLink);

      // Upload new resume
      const fileName = resume.originalname.substring(
        0,
        resume.originalname.lastIndexOf('.'),
      );
      const url = await this.storageService.uploadToFolder(
        resume,
        MediaType.RESUME,
        fileName,
        user.id,
      );

      updateApplication.resumeLink = url;
    }

    return this.transactionsManager.readWrite(async (entityManager) => {
      const responseRepository = Repositories.response(entityManager);
      const newApplication = responseRepository.merge(application, {
        data: { ...application.data, ...updateApplication },
      });
      const updatedApplication = responseRepository.save(newApplication);
      return updatedApplication;
    });
  }

  public async deleteUserApplication(user: UserModel): Promise<void> {
    const application = await this.getUserApplication(user);

    // Delete resume
    this.storageService.deleteAtUrl(application.data.resumeLink);

    this.transactionsManager.readWrite(async (entityManager) =>
      Repositories.response(entityManager).remove(application),
    );

    // Update the user's applicationStatus.
    await this.transactionsManager.readWrite(async (entityManager) => {
      const userRepository = Repositories.user(entityManager);
      user = userRepository.merge(user, {
        applicationStatus: ApplicationStatus.NOT_SUBMITTED,
      });
      userRepository.save(user);
    });
  }
}
