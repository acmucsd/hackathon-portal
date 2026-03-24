'use client';

import Image from 'next/image';
import { confetti, confettiMobile, badges } from '@/../public/assets/houses';
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

  return (
    <div className={styles.profileContainer}>
      <div className={styles.house}>
        <Image
          src={!isMobile ? confetti.green : confettiMobile.green}
          alt="Confetti"
          quality={100}
          className={styles.confetti}
        />
        <Image
          src={badges.racoon}
          alt="Badge"
          quality={100}
          className={styles.badge}
        />
      </div>
      <ProfileCard user={user} />
      {application && (
        <ApplicationCard application={application} applicationStatus={user.applicationStatus} />
      )}
    </div>
  );
};

export default Profile;
