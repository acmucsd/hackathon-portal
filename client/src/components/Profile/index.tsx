'use client';

import Image from 'next/image';
import { houseAssets } from '@/lib/constants/houseAssets';
import { useWindowSize } from '@/lib/hooks/useWindowSize';
import ProfileCard from '@/components/ProfileCard';
import ApplicationCard from '@/components/ApplicationCard';
import styles from './style.module.scss';
import { FormType } from '@/lib/types/enums';
import { PrivateProfile, ResponseModel } from '@/lib/types/apiResponses';

interface ProfileClientProps {
  user: PrivateProfile;
  responses: ResponseModel[];
}

const Profile = ({ user, responses }: ProfileClientProps) => {
  const size = useWindowSize();
  const isMobile = (size.width ?? 0) <= 870;
  const application = responses.find(response => response.formType === FormType.APPLICATION);
  const house = houseAssets[user.house];

  const houseStyles = {
    RACCOON: styles.raccoon,
    SUN_GOD: styles.sunGod,
    GEISEL: styles.geisel,
    TRITON: styles.kingTriton,
  } as const;

  return (
    <div className={styles.profileContainer}>
      {user.house !== 'UNASSIGNED' && size.width !== undefined && (
        <div className={styles.house}>
          <div className={`${styles.confettiContainer} ${houseStyles[user.house]}`}>
            <Image
              src={!isMobile ? house.confetti : house.confettiMobile}
              alt="Confetti"
              quality={100}
              className={`${styles.confetti} ${houseStyles[user.house]}`}
            />
          </div>
          <Image src={house.badge} alt="Badge" quality={100} className={styles.badge} />
        </div>
      )}
      <ProfileCard user={user} />
      {application && (
        <ApplicationCard application={application} applicationStatus={user.applicationStatus} />
      )}
    </div>
  );
};

export default Profile;
