import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { ResponseModel } from '../models/ResponseModel';

@Service()
export class ResponseService {
  private transactionsManager: TransactionsManager;

  constructor(transactionsManager: TransactionsManager) {
    this.transactionsManager = transactionsManager;
  }

  public async findByUuid(uuid: string): Promise<ResponseModel> {
    const response = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.response(entityManager).findByUuid(uuid),
    );
    if (!response) throw new Error('Response not found');
    return response;
  }
}
