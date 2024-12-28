import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { UserModel } from '../models/UserModel';
import { CreateUser } from '../types/ApiRequests';
import { getAuth } from 'firebase-admin/auth';
import { BadRequestError } from 'routing-controllers';

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

  public async createUser(createUser: CreateUser): Promise<UserModel> {
    const email = createUser.email.toLowerCase();

    const userWithEmail = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.user(entityManager).findByEmail(email),
    );
    const emailAlreadyUsed = userWithEmail !== null;
    if (emailAlreadyUsed) throw new BadRequestError('Email already in use');

    const firebaseUser = await getAuth().createUser({
      email,
      password: createUser.password,
      displayName: `${createUser.firstName} ${createUser.lastName}`,
    });

    return this.transactionsManager.readWrite(async (entityManager) => {
      const userRepository = Repositories.user(entityManager);
      const newUser = userRepository.create({
        id: firebaseUser.uid,
        email,
        firstName: createUser.firstName,
        lastName: createUser.lastName,
      });
      const user = userRepository.save(newUser);
      return user;
    });
  }
}
