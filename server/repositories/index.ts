import { Service } from 'typedi';
import { DataSource, EntityManager, QueryFailedError } from 'typeorm';
import { UserRepository } from './UserRepository';
import { ResponseRepository } from './ResponseRepository';
import { EventRepository } from './EventRepository';
import { AttendanceRepository } from './AttendanceRepository';
import { ApplicationConfigRepository } from './ApplicationConfigRepository';
import { InterestFormResponseRepository } from './InterestFormResponseRepository';

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


  public static applicationConfig(entityManager: EntityManager) {
    return entityManager.withRepository(ApplicationConfigRepository);
  }

  public static interestFormResponse(entityManager: EntityManager) {
    return entityManager.withRepository(InterestFormResponseRepository);
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

  public async readWrite<T>(fn: (entityManager: EntityManager) => Promise<T>,
  { maxAttempts = 1 } : { maxAttempts?: number } = {}) {
    for (let attempt = 1; ; attempt++) {
			try {
				if (attempt > 1) {
					console.warn(`[db] Starting transaction attempt ${attempt}/${maxAttempts} after SQLSTATE 40001`);
				}

				return await this.dataSource.transaction('SERIALIZABLE', fn);
			}
			catch (error) {
				const isSerializationFailure =
				error instanceof QueryFailedError
				&& error.driverError.code === '40001';

				if (!isSerializationFailure || attempt >= maxAttempts) {
					throw error;
				}


				const baseDelay = Math.min(500, 25 * 2 ** (attempt - 1));
				const delay = baseDelay * (1 + Math.random());

				await new Promise<void>((resolve) => {
					setTimeout(resolve, delay);
				});
			}
		}
	}
}
