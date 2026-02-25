import { Service } from 'typedi';
import { UserModel } from '../models/UserModel';

@Service()
export default class PermissionsService {
  public static canViewAllApplications(user: UserModel): boolean {
    return user.isAdmin();
  }

  public static canViewApplicationDecisions(user: UserModel): boolean {
    return user.isAdmin();
  }

  public static canEditApplicationDecisions(user: UserModel): boolean {
    return user.isAdmin();
  }

  public static canGetEmailVerificationLinks(user: UserModel): boolean {
    return user.isAdmin();
  }

  public static canGetPasswordResetLinks(user: UserModel): boolean {
    return user.isSuperAdmin();
  }

  public static canEditEvents(user: UserModel): boolean {
    return user.isAdmin();
  }

  public static canViewUnpublishedEvents(user: UserModel): boolean {
    return user.isAdmin();
  }

  public static canEditInterestEmails(user: UserModel): boolean {
    return user.isAdmin();
  }

  public static canGetReviewerOverview(user: UserModel): boolean {
    return user.isSuperAdmin();
  }

  public static canOpenCloseApplications(user: UserModel): boolean {
    return user.isSuperAdmin();
  }

  public static canAssignReviewers(user: UserModel): boolean {
    return user.isSuperAdmin();
  }

  public static canReleaseApplicationDecisions(user: UserModel): boolean {
    return user.isSuperAdmin();
  }
}
