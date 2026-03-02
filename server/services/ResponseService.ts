import { Service } from 'typedi';
import * as path from 'path';
import { Repositories, TransactionsManager } from '../repositories';
import { ResponseModel } from '../models/ResponseModel';
import { UserModel } from '../models/UserModel';
import { ApplicationStatus, FormType, MediaType } from '../types/Enums';
import { Application, Waiver } from '../types/Application';
import { BadRequestError, ForbiddenError, NotFoundError } from 'routing-controllers';
import { File } from '../types/ApiRequests';
import { StorageService } from './StorageService';
import { ApplicationConfigService } from './ApplicationConfigService';

const RESUME_ALLOWED_EXTENSIONS = ['.pdf', '.doc', 'docx'];

@Service()
export class ResponseService {
  private storageService: StorageService;

  private transactionsManager: TransactionsManager;

  private applicationConfigService: ApplicationConfigService;

  constructor(
    storageService: StorageService,
    transactionsManager: TransactionsManager,
    applicationConfigService: ApplicationConfigService,
  ) {
    this.storageService = storageService;
    this.transactionsManager = transactionsManager;
    this.applicationConfigService = applicationConfigService;
  }

  public async getUserResponses(user: UserModel): Promise<ResponseModel[]> {
    const response = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.response(entityManager).findResponsesForUser(user),
    );
    return response;
  }

  private async getAllResponses(): Promise<ResponseModel[]> {
    const responses = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.response(entityManager).findAll(),
    );
    return responses;
  }

  private async getAllResponsesWithUserRelation(): Promise<ResponseModel[]> {
    const responses = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.response(entityManager).findAllWithUserRelation(),
    );
    return responses;
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

  public async getApplicationById(uuid: string): Promise<ResponseModel> {
    try {
      const response = await this.transactionsManager.readOnly(
        async (entityManager) =>
          Repositories.response(entityManager).findByUuid(uuid),
      );
      if (!response || response.formType !== FormType.APPLICATION)
        throw new NotFoundError('Application not found');
      return response;
    } catch (error) {
      throw new NotFoundError('Application not found');
    }
  }

  public async getAllApplications(): Promise<ResponseModel[]> {
    const responses = await this.getAllResponses();
    const applications = responses.filter(
      (response) => response.formType === FormType.APPLICATION,
    );
    return applications;
  }

  public async getAllApplicationsWithUserRelation(): Promise<ResponseModel[]> {
    const responses = await this.getAllResponsesWithUserRelation();
    const applications = responses.filter(
      (response) => response.formType === FormType.APPLICATION,
    );
    return applications;
  }

  public async submitUserApplication(
    user: UserModel,
    application: Application,
    resume: File,
  ) {

    // 0. Check if application submission is open
    const isOpen = await this.applicationConfigService.isOpen();

    if (!isOpen) {
      throw new ForbiddenError('Applications are currently closed.');
    }

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

    // Error if resume has disallowed extension
    const fileExtension = path.extname(resume.originalname);
    if (!RESUME_ALLOWED_EXTENSIONS.includes(fileExtension))
      throw new BadRequestError("Filetype must be '.pdf' or '.doc' or '.docx'");

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

    const isOpen = await this.applicationConfigService.isOpen();

    if (!isOpen) {
      throw new ForbiddenError('Applications are currently closed.');
    }

    const application = await this.getUserApplication(user);

    if (resume) {
      // Error if resume has disallowed extension
      const fileExtension = path.extname(resume.originalname);
      if (!RESUME_ALLOWED_EXTENSIONS.includes(fileExtension))
        throw new BadRequestError(
          "Filetype must be '.pdf' or '.doc' or '.docx'",
        );

      // Delete previous resume
      const applicationData = application.data as Application;
      this.storageService.deleteAtUrl(applicationData.resumeLink);

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
    const applicationData = application.data as Application;
    this.storageService.deleteAtUrl(applicationData.resumeLink);

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

  public async submitUserWaiver(
    user: UserModel,
    formData: Waiver,
    formType: FormType,
  ): Promise<ResponseModel> {
    if (
      user.applicationStatus !== ApplicationStatus.ACCEPTED &&
      user.applicationStatus !== ApplicationStatus.CONFIRMED
    ) {
      throw new BadRequestError(
        'User must have an accepted application to submit this form.');
    }

    const existingForms = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.response(entityManager).findResponsesForUserByType(
          user,
          formType,
        ),
    );
    if (existingForms.length > 0) {
      throw new BadRequestError(`User has already submitted ${formType}`);
    }

    const response = await this.transactionsManager.readWrite(
      async (entityManager) => {
        const responseRepository = Repositories.response(entityManager);
        const newResponse = responseRepository.create({
          user,
          formType: formType,
          data: formData,
        });
        const createdResponse = responseRepository.save(newResponse);
        return createdResponse;
      },
    );

    return response;
  }

  public async getUserWaivers(user: UserModel): Promise<ResponseModel[]> {
    const userResponses = await this.getUserResponses(user);
    const waivers = userResponses.filter(
      (response) =>
        response.formType === FormType.LIABILITY_WAIVER ||
        response.formType === FormType.PHOTO_RELEASE,
    );
    if (!waivers) throw new NotFoundError('No waivers found for user');
    return waivers;
  }
}
