import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { UserModel } from '../models/UserModel';
import { CreateUser } from '../types/ApiRequests';
import { FirebaseAuthError, getAuth } from 'firebase-admin/auth';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from 'routing-controllers';

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

    let firebaseUser;
    try {
      firebaseUser = await getAuth().createUser({
        email,
        password: createUser.password,
        displayName: `${createUser.firstName} ${createUser.lastName}`,
      });
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        if (error.code === 'auth/email-already-exists')
          throw new BadRequestError('Email already in use');
      }
      throw error;
    }

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

  public async checkAuthToken(token: string): Promise<UserModel> {
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(token);
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        if (error.code === 'auth/invalid-id-token')
          throw new BadRequestError('Invalid auth token');
      }
      throw error;
    }
    const user = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.user(entityManager).findById(decodedToken.uid),
    );
    if (!user) throw new NotFoundError();
    if (user.isRestricted())
      throw new ForbiddenError('Your account has been restricted');
    return user;
  }
}
