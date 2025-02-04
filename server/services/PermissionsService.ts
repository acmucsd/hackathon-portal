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
}
