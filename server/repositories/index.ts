import { Service } from 'typedi';
import { DataSource, EntityManager } from 'typeorm';
import { UserRepository } from './UserRepository';
import { ResponseRepository } from './ResponseRepository';
import { EventRepository } from './EventRepository';
import { AttendanceRepository } from './AttendanceRepository';

export class Repositories {
  public static user(entityManager: EntityManager) {
    return entityManager.withRepository(UserRepository);
  }

  public static response(entityManager: EntityManager) {
    return entityManager.withRepository(ResponseRepository);
  }

  public static event(entityManager: EntityManager) {
    return entityManager.withRepository(EventRepository);
  }

  public static attendance(entityManager: EntityManager) {
    return entityManager.withRepository(AttendanceRepository);
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
