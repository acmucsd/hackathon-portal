import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { ApplicationConfigModel } from '../models/ApplicationConfigModel';

@Service()
export class ApplicationConfigService {
  private transactionsManager: TransactionsManager;

  constructor(transactionsManager: TransactionsManager) {
    this.transactionsManager = transactionsManager;
  }

  public async isOpen(): Promise<boolean> {
    return this.transactionsManager.readOnly(async (entityManager) => {
      const config = await Repositories.applicationConfig(entityManager).findSingleton();
      return config?.applicationsOpen === true;
    });
  }

  public async setApplicationSingleton(applicationsOpen: boolean, updateBy: string): Promise<ApplicationConfigModel> {
    return this.transactionsManager.readWrite(async (entityManager) => {
      const configRepository = Repositories.applicationConfig(entityManager);
      let config = await configRepository.findSingleton();

      if (!config) {
        throw new Error('ApplicationConfig singleton not found');
      } else {
        config.applicationsOpen = applicationsOpen;
        config.updatedBy = updateBy;
        config.updatedAt = new Date();
      }

      return configRepository.save(config);
    });
  }

}