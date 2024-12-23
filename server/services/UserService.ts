import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { UserModel } from '../models/UserModel';

@Service()
export class UserService {
  private transactionsManager: TransactionsManager;

  constructor(transactionsManager: TransactionsManager) {
    this.transactionsManager = transactionsManager;
  }

  public async findById(id: string): Promise<UserModel> {
    const user = await this.transactionsManager.readOnly(
      async (entityManager) => Repositories.user(entityManager).findById(id),
    );
    if (!user) throw new Error('User not found');
    return user;
  }
}
