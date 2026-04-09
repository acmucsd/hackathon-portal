'use client';

import Image from 'next/image';
import { houseAssets } from '@/lib/constants/houseAssets';
import { useWindowSize } from '@/lib/hooks/useWindowSize';
import ProfileCard from '@/components/ProfileCard';
import ApplicationCard from '@/components/ApplicationCard';
import styles from './style.module.scss';
import { FormType, House } from '@/lib/types/enums';
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

  const houseStyles: Record<House, string> = {
    [House.RACCOON]: styles.raccoon,
    [House.SUN_GOD]: styles.sunGod,
    [House.GEISEL]: styles.geisel,
    [House.TRITON]: styles.kingTriton,
    [House.UNASSIGNED]: '',
  };

  return (
    <div className={styles.profileContainer}>
      {size.width !== undefined && (
        <div className={styles.house}>
          {user.house !== 'UNASSIGNED' && (
            <div className={`${styles.confettiContainer} ${houseStyles[user.house]}`}>
              <Image
                src={!isMobile ? house.confetti : house.confettiMobile}
                alt="Confetti"
                quality={100}
                className={`${styles.confetti} ${houseStyles[user.house]}`}
              />
            </div>
          )}
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
