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
}