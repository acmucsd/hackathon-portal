import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { UserModel } from '../models/UserModel';
import { ReviewAssignmentJob, CreateUser } from '../types/ApiRequests';
import {
  sendEmailVerification,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { FirebaseAuthError } from 'firebase-admin/auth';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from 'routing-controllers';
import { UpdateUser } from '../api/validators/UserControllerRequests';
import { auth, adminAuth } from '../FirebaseAuth';
import { ReviewAssignment, UserAndToken } from '../types/ApiResponses';
import { ApplicationDecision, ApplicationStatus } from '../types/Enums';

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

  public async findByIdWithReviewerRelation(id: string): Promise<UserModel> {
    // same as findById() but includes reviewer / reviewee links
    const user = await this.transactionsManager.readOnly(
      async (entityManager) => Repositories.user(entityManager).findByIdWithReviewerRelation(id),
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

  public async updateUserStatus(
    userId: string,
    applicationStatus: ApplicationStatus,
  ): Promise<UserModel> {
    return this.transactionsManager.readWrite(async (entityManager) => {
      const userRepository = Repositories.user(entityManager);
      const user = await userRepository.findById(userId);
      if (!user) throw new NotFoundError('User not found');
      user.applicationStatus = applicationStatus;
      const updatedUser = userRepository.save(user);
      return updatedUser;
    });
  }

  public async updateApplicationDecision(
    userId: string,
    applicationDecision: ApplicationDecision,
  ): Promise<UserModel> {
    return this.transactionsManager.readWrite(async (entityManager) => {
      const userRepository = Repositories.user(entityManager);
      const user = await userRepository.findById(userId);
      if (!user) throw new NotFoundError('User not found');
      user.applicationDecision = applicationDecision;
      const updatedUser = userRepository.save(user);
      return updatedUser;
    });
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

  public async getEmailVerificationLink(email: string): Promise<string> {
    try {
      const firebaseUser = await adminAuth.getUserByEmail(email);
      if (firebaseUser.emailVerified)
        throw new BadRequestError('User email already verified');
      return await adminAuth.generateEmailVerificationLink(email);
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        if (error.code === 'auth/user-not-found') {
          throw new NotFoundError(
            'No user found with the provided email address.',
          );
        }
      }
      throw error;
    }
  }

  private async sendEmailVerification(id: string): Promise<void> {
    const customToken = await adminAuth.createCustomToken(id);
    const userCredential = await signInWithCustomToken(auth, customToken);
    await sendEmailVerification(userCredential.user);
  }

  public async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const firebaseRecord = await adminAuth.getUserByEmail(email);
      if (firebaseRecord) await sendPasswordResetEmail(auth, email);
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        if (error.code === 'auth/user-not-found') {
          throw new NotFoundError(
            'No user found with the provided email address.',
          );
        }
      }
      throw error;
    }
  }

  public async getAllUsers(): Promise<UserModel[]> {
    return this.transactionsManager.readOnly(async (entityManager) =>
      Repositories.user(entityManager).findAll(),
    );
  }

  public async getAllUsersWithReviewerRelation(): Promise<UserModel[]> {
    // same as getAllUsers() but includes reviewer / reviewee links
    return this.transactionsManager.readOnly(async (entityManager) =>
      Repositories.user(entityManager).findAllWithReviewerRelation(),
    );
  }

  public async assignReviews(
    assignmentsRequest: ReviewAssignmentJob[]
  ): Promise<ReviewAssignment[]> {
    return this.transactionsManager.readWrite(async (entityManager) => {
      const userRepository = Repositories.user(entityManager);
      const newAssignments: ReviewAssignment[] = [];

      for (const assignment of assignmentsRequest) {
        // load reviewee
        const reviewee = await userRepository.findByIdWithReviewerRelation(
          assignment.applicantId
        );
        if (!reviewee) continue;

        // load reviewer (if any)
        const reviewer = assignment.reviewerId
          ? await userRepository.findByIdWithReviewerRelation(
              assignment.reviewerId
            )
          : undefined;

        // ONLY mutate the owning side
        reviewee.reviewer = reviewer ?? null;

        // persist reviewee only
        const res = await userRepository.save(reviewee);

        newAssignments.push({
          applicant: reviewee.getHiddenProfile(),
          reviewer: reviewer?.getHiddenProfile(),
        });
      }

      return newAssignments;
    });
  }


  public async randomlyAssignReviews(): Promise<ReviewAssignment[]> {
    /*
    RANDOM ASSIGNMENT PROCESS:

    This method only handles the random assignment, the database dirty work is handled in postAssignments()
    All users are fetched, then split into admins and applicants, before pairing each applicant to a random admin.
    {applicantId, reviewerId} pairs are generated for each pairing
    This list is then sent to postAssignments().

    Note 1: the distribution across admins is not equalized so some may have more reviews to complete than others :)
    Note 2: not the most efficient way since it does 2 user lookups (one here, one in postAssignments), but should be fine
    */

    const users = await this.transactionsManager.readOnly(async (entityManager) =>
      Repositories.user(entityManager).findAllWithReviewerRelation(),
    )

    const admins = users.filter((user) => user.isAdmin())
    const applicantsToAssign = users.filter((user) =>
      !user.isAdmin() && // normal applicant
      user.applicationDecision == ApplicationDecision.NO_DECISION && // not already reviewed
      user.applicationStatus == ApplicationStatus.SUBMITTED // submitted application
    )

    function getRandomIntInclusive(min: number, max: number): number {
      min = Math.ceil(min);
      max = Math.floor(max);
      // generates a random number in the range [min, max]
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const arr: ReviewAssignmentJob[] = []
    applicantsToAssign.forEach((reviewee) => {
      const R = getRandomIntInclusive(0, admins.length - 1);
      const reviewer = admins[R];
      arr.push({
        applicantId: reviewee.id,
        reviewerId: reviewer.id,
      })
    })

    return this.assignReviews(arr);
  }

}
