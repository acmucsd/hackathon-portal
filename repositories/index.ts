import { Service } from 'typedi';
import { DataSource, EntityManager } from 'typeorm';
import { UserRepository } from './UserRepository';

export class Repositories {
  public static user(entityManager: EntityManager) {
    return entityManager.withRepository(UserRepository);
  }
}

@Service()
export class TransactionsManager {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  // add automatic retries if transaction failing often - see membership portal
  public readOnly<T>(fn: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.transaction('REPEATABLE READ', fn);
  }

  public readWrite<T>(fn: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.transaction('SERIALIZABLE', fn);
  }
}
