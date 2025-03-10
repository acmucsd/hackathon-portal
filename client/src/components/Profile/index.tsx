import ProfileCard from '@/components/ProfileCard';
import ApplicationCard from '@/components/ApplicationCard';
import Card from '../Card';
import styles from './style.module.scss';
import { PrivateProfile, ResponseModel } from '@/lib/types/apiResponses';

interface ProfileClientProps {
  user: PrivateProfile;
  application: ResponseModel;
}

const Profile = ({ user, application }: ProfileClientProps) => {
  return (
    <main className={styles.main}>
      <div className={styles.profileContainer}>
        <ProfileCard user={user} className={styles.profile} />
        <ApplicationCard
          application={application}
          applicationStatus={user.applicationStatus}
          className={styles.application}
        />
      </div>
    </main>
  );
};

export default Profile;
