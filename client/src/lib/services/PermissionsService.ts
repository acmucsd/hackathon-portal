'use server';

import { redirect } from 'next/navigation';
import { PrivateProfile } from '../types/apiResponses';
import { UserAccessType } from '../types/enums';

export async function onlyAllowSuperAdmins(user: PrivateProfile) {
  if (user.accessType !== UserAccessType.SUPER_ADMIN) {
    if (user.accessType === UserAccessType.ADMIN) {
      redirect('/admin');
    } else {
      redirect('/');
    }
  }
}

export async function onlyAllowAdmins(user: PrivateProfile) {
  if (user.accessType !== UserAccessType.ADMIN && user.accessType !== UserAccessType.SUPER_ADMIN) {
    redirect('/');
  }
}
