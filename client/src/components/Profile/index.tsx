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
  const application = responses.find(response => response.formType === FormType.APPLICATION);

  return (
    <div className={styles.profileContainer}>
      <ProfileCard user={user} />
      {application && (
        <ApplicationCard application={application} applicationStatus={user.applicationStatus} />
      )}
    </div>
  );
};

export default Profile;
