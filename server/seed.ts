import 'reflect-metadata';
import 'dotenv/config';

import { dataSource } from './DataSource';
import { Repositories } from './repositories';
import { UserAccessType } from './types/Enums';
import { Config } from './config';

const testEmail = Config.testing.testUserEmail;
const testId = Config.testing.testUserId;

export const seedTestUser = async (id:string, email: string, accessType: UserAccessType, firstName: string="First", lastName: string="Last") => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const userRepository = Repositories.user(dataSource.manager);

  const existing = await userRepository.findById(id);

  if (!existing) {
    const user = userRepository.create({
      id: id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      accessType: accessType,
    });
    await userRepository.save(user);
  }

  await dataSource.destroy();
};

// We can add more testing functions above and calls to those functions below

seedTestUser(testId, testEmail, UserAccessType.STANDARD);