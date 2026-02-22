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
import {
  ReviewAssignment,
  ReviewerOverviewResponse,
  ReviewerOverviewReviewer,
  UserAndToken,
} from '../types/ApiResponses';
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
    reviewerComments?: string | null,
  ): Promise<UserModel> {
    return this.transactionsManager.readWrite(async (entityManager) => {
      const userRepository = Repositories.user(entityManager);
      const user = await userRepository.findById(userId);
      if (!user) throw new NotFoundError('User not found');
      user.applicationDecision = applicationDecision;
      if (reviewerComments !== undefined) {
        user.reviewerComments = reviewerComments;
      }

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
    assignmentsRequest: ReviewAssignmentJob[],
  ): Promise<ReviewAssignment[]> {
    return this.transactionsManager.readWrite(async (entityManager) => {
      const userRepository = Repositories.user(entityManager);
      const interestFormResponseRepository = Repositories.interestFormResponse(entityManager);

      const newAssignments: ReviewAssignment[] = [];

      const userIds = new Set([
        ...assignmentsRequest.map(job => job.applicantId),
        ...assignmentsRequest.map(job => job.reviewerId),
      ].filter((userId): userId is string => userId != null));
      const users = await userRepository.findByIdsWithReviewerRelation([...userIds]);

      const userMap: Record<string, UserModel> = {};
      users.forEach(user => {
        if (user) userMap[user.id] = user;
      });

      const interestByEmail = await interestFormResponseRepository.findInterestByEmails(
        assignmentsRequest.map(job => userMap[job.applicantId].email),
      );

      const editedUsers: UserModel[] = [];
      assignmentsRequest.forEach((assignment) => {
        const reviewee = userMap[assignment.applicantId];
        const reviewer = assignment.reviewerId ? userMap[assignment.reviewerId] : null;
        if (!reviewee) return;

        // ONLY mutate the owning side
        reviewee.reviewer = reviewer;

        // persist reviewee only
        editedUsers.push(reviewee);

        newAssignments.push({
          applicant: {
            ...reviewee.getHiddenProfile(),
            didInterestForm: interestByEmail.get(reviewee.email) ?? false,
          },
          reviewer: reviewer?.getHiddenProfile(),
        });
      });

      await Repositories.user(entityManager).save(editedUsers);

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
    Note 2: not the most efficient way since it does 2 user lookups (one here, one in postAssignments), but its ok
    */

    const users = await this.transactionsManager.readOnly(async (entityManager) =>
      Repositories.user(entityManager).findAllWithReviewerRelation(),
    );

    const admins = users.filter((user) => user.isAdmin());
    const applicantsToAssign = users.filter((user) =>
      !user.isAdmin() && // normal applicant
      user.applicationDecision == ApplicationDecision.NO_DECISION && // not already reviewed
      user.applicationStatus == ApplicationStatus.SUBMITTED, // submitted application
    );

    function getRandomIntInclusive(min: number, max: number): number {
      min = Math.ceil(min);
      max = Math.floor(max);
      // generates a random number in the range [min, max]
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const arr: ReviewAssignmentJob[] = [];
    applicantsToAssign.forEach((reviewee) => {
      const R = getRandomIntInclusive(0, admins.length - 1);
      const reviewer = admins[R];
      arr.push({
        applicantId: reviewee.id,
        reviewerId: reviewer.id,
      });
    });

    return this.assignReviews(arr);
  }

  // admin are reviewers
  // 1, Find all reviewers
  // 2, Find the users (applicants) each reviewer is responsible for
  // 3, Return the ApplicationDecision status of the users each reviewer reviews

  public async getReviewerOverview(): Promise<ReviewerOverviewResponse> {
    const rows = await this.transactionsManager.readOnly(async (entityManager) =>
    entityManager.query(`
      SELECT
        r.id          AS reviewer_id,
        r."firstName" AS reviewer_first_name,
        r."lastName"  AS reviewer_last_name,
        a.id          AS applicant_id,
        a."firstName" AS applicant_first_name,
        a."lastName"  AS applicant_last_name,
        a."applicationDecision"
      FROM "User" r
      LEFT JOIN "User" a
        ON a."reviewerId" = r.id
      WHERE r."accessType" = 'ADMIN'
      ORDER BY r.id
    `),
  );

  const map = new Map<string, ReviewerOverviewReviewer>();

  for (const row of rows) {
    const reviewerId = row.reviewer_id;

    if (!map.has(reviewerId)) {
      map.set(reviewerId, {
        reviewerId,
        reviewerFirstName: row.reviewer_first_name,
        reviewerLastName: row.reviewer_last_name,
        applicants: [],
        total: 0,
        accept: 0,
        reject: 0,
        waitlist: 0,
        noDecision: 0,
      });
    }

    if (row.applicant_id) {
      const reviewer = map.get(reviewerId)!;

      reviewer.applicants.push({
        userId: row.applicant_id,
        firstName: row.applicant_first_name,
        lastName: row.applicant_last_name,
        applicationDecision: row.applicationDecision,
      });

      reviewer.total++;

      switch (row.applicationDecision) {
        case 'ACCEPT':
          reviewer.accept++;
          break;
        case 'REJECT':
          reviewer.reject++;
          break;
        case 'WAITLIST':
          reviewer.waitlist++;
          break;
        case 'NO_DECISION':
        default:
          reviewer.noDecision++;
          break;
      }
    }
  }

  return {
    reviewers: Array.from(map.values()),
  };
  }
}
