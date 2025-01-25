import { Service } from 'typedi';
import { UserModel } from '../models/UserModel';

@Service()
export default class PermissionsService {
  public static canViewAllApplications(user: UserModel): boolean {
    return user.isAdmin();
  }
}
