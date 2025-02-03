import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { UserModel } from '../models/UserModel';
import { CreateUser } from '../types/ApiRequests';
import {
  sendEmailVerification,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { FirebaseAuthError } from 'firebase-admin/auth';
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from 'routing-controllers';
import { UpdateUser } from '../api/validators/UserControllerRequests';
import { auth, adminAuth } from '../FirebaseAuth';
import { UserAndToken } from '../types/ApiResponses';

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
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  public async createUser(createUser: CreateUser): Promise<UserModel> {
    const email = createUser.email.toLowerCase();

    const userWithEmail = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.user(entityManager).findByEmail(email),
    );
    const emailAlreadyUsed = userWithEmail !== null;
    if (emailAlreadyUsed) {
      const firebaseRecord = await adminAuth.getUserByEmail(email);

      if (!firebaseRecord.emailVerified) {
        await adminAuth.updateUser(firebaseRecord.uid, {
          password: createUser.password,
        });

        const user = await this.updateUser(userWithEmail, {
          firstName: createUser.firstName,
          lastName: createUser.lastName,
        });

        this.sendEmailVerification(userWithEmail.id);

        return user;
      } else {
        throw new ForbiddenError('Email already in use');
      }
    }

    let firebaseUser;
    try {
      firebaseUser = await adminAuth.createUser({
        email,
        password: createUser.password,
        displayName: `${createUser.firstName} ${createUser.lastName}`,
      });
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        if (error.code === 'auth/email-already-exists')
          throw new ForbiddenError('Email already in use');
      }
      throw error;
    }

    const user = await this.transactionsManager.readWrite(
      async (entityManager) => {
        const userRepository = Repositories.user(entityManager);
        const newUser = userRepository.create({
          id: firebaseUser.uid,
          email,
          firstName: createUser.firstName,
          lastName: createUser.lastName,
        });
        const createdUser = userRepository.save(newUser);
        return createdUser;
      },
    );

    this.sendEmailVerification(user.id);

    return user;
  }

  public async updateUser(
    user: UserModel,
    updateUser: UpdateUser,
  ): Promise<UserModel> {
    const firstName = updateUser.firstName ?? user.firstName;
    const lastName = updateUser.lastName ?? user.lastName;
    adminAuth.updateUser(user.id, {
      displayName: `${firstName} ${lastName}`,
    });
    return this.transactionsManager.readWrite(async (entityManager) => {
      const userRepository = Repositories.user(entityManager);
      user = userRepository.merge(user, updateUser);
      const updatedUser = userRepository.save(user);
      return updatedUser;
    });
  }

  public async deleteUser(user: UserModel): Promise<void> {
    adminAuth.deleteUser(user.id);
    this.transactionsManager.readWrite(async (entityManager) =>
      Repositories.user(entityManager).remove(user),
    );
  }

  public async login(email: string, password: string): Promise<UserAndToken> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const token = await userCredential.user.getIdToken();
      // If checkAuthToken() runs without throwing an error, the user exists.
      const user = await this.checkAuthToken(token);
      return { token, user };
    } catch (error) {
      if (
        error instanceof UnauthorizedError ||
        error instanceof ForbiddenError
      ) {
        // Throw special error messages as-is.
        throw error;
      }
      throw new UnauthorizedError('Invalid email or password.');
    }
  }

  public async checkAuthToken(token: string): Promise<UserModel> {
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        if (error.code === 'auth/invalid-id-token')
          throw new UnauthorizedError('Invalid auth token');
        if (error.code === 'auth/id-token-expired')
          throw new UnauthorizedError('Expired auth token');
      }
      throw error;
    }
    const user = await this.transactionsManager.readOnly(
      async (entityManager) =>
        Repositories.user(entityManager).findById(decodedToken.uid),
    );
    if (!user) throw new NotFoundError('User not found');
    if (!decodedToken.email_verified)
      throw new UnauthorizedError('Please verify your email');
    if (user.isRestricted())
      throw new ForbiddenError('Your account has been restricted');
    return user;
  }

  private async sendEmailVerification(id: string): Promise<void> {
    const customToken = await adminAuth.createCustomToken(id);
    const userCredential = await signInWithCustomToken(auth, customToken);
    await sendEmailVerification(userCredential.user);
  }

  public async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const firebaseRecord = await adminAuth.getUserByEmail(email);
      if (!firebaseRecord) {
        throw new NotFoundError('No user found with the provided email address.');
      }
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  }
}
