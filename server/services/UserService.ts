import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { UserModel } from '../models/UserModel';
import {
  CreateUser,
  GetIdTokenRequest,
  SendEmailVerificationRequest,
} from '../types/ApiRequests';
import { FirebaseAuthError, getAuth } from 'firebase-admin/auth';
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from 'routing-controllers';
import { UpdateUser } from '../api/validators/UserControllerRequests';
import { Config } from '../config';
import {
  GetIdTokenResponse,
  SendEmailVerificationResponse,
} from '../types/ApiResponses';

const GET_ID_TOKEN_ENDPOINT =
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' +
  Config.firebase.apiKey;

const SEND_EMAIL_VERIFICATION_ENDPOINT =
  'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=' +
  Config.firebase.apiKey;

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
    if (emailAlreadyUsed) throw new ForbiddenError('Email already in use');

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
    getAuth().updateUser(user.id, {
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
    getAuth().deleteUser(user.id);
    this.transactionsManager.readWrite(async (entityManager) =>
      Repositories.user(entityManager).remove(user),
    );
  }

  public async checkAuthToken(token: string): Promise<UserModel> {
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(token);
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
    if (!user) throw new NotFoundError();
    if (!decodedToken.email_verified)
      throw new UnauthorizedError('Please verify your email');
    if (user.isRestricted())
      throw new ForbiddenError('Your account has been restricted');
    return user;
  }

  private async sendEmailVerification(id: string): Promise<string> {
    const customToken = await getAuth().createCustomToken(id);

    const getIdTokenRequestBody: GetIdTokenRequest = {
      token: customToken,
      returnSecureToken: true,
    };
    const getIdTokenRequest = new Request(GET_ID_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getIdTokenRequestBody),
    });
    const getIdTokenResponse = await fetch(getIdTokenRequest);
    const getIdTokenResponseBody: GetIdTokenResponse =
      await getIdTokenResponse.json();

    const idToken = getIdTokenResponseBody.idToken;

    const sendEmailVerificationRequestBody: SendEmailVerificationRequest = {
      requestType: 'VERIFY_EMAIL',
      idToken,
    };
    const sendEmailVerificationRequest = new Request(
      SEND_EMAIL_VERIFICATION_ENDPOINT,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendEmailVerificationRequestBody),
      },
    );
    const sendEmailVerificationResponse = await fetch(
      sendEmailVerificationRequest,
    );
    const sendEmailVerificationResponseBody: SendEmailVerificationResponse =
      await sendEmailVerificationResponse.json();

    const email = sendEmailVerificationResponseBody.email;
    return email;
  }
}
