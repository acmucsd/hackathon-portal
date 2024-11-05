import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { UserModel } from '../models/UserModel';
import { Uid } from '../types/Internal';

@Service()
export class UserService {
  private transactionsManager: TransactionsManager;

  constructor(transactionsManager: TransactionsManager) {
    this.transactionsManager = transactionsManager;
  }

  public async findByUid(uid: Uid): Promise<UserModel> {
    const user = await this.transactionsManager.readOnly(
      async (entityManager) => Repositories.user(entityManager).findByUid(uid),
    );
    if (!user) throw new Error('User not found');
    return user;
  }
}
