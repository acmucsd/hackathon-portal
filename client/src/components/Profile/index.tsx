import ProfileCard from '@/components/ProfileCard';
import ApplicationCard from '@/components/ApplicationCard';
import Heading from '@/components/Heading';
import StatusTag from '@/components/StatusTag';
import Typography from '@/components/Typography';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './style.module.scss';
import { ApplicationStatus, FormType } from '@/lib/types/enums';
import { PrivateProfile, ResponseModel } from '@/lib/types/apiResponses';
import { canUserSubmitWaivers } from '@/lib/utils';

interface ProfileClientProps {
  user: PrivateProfile;
  responses: ResponseModel[];
}

const Profile = ({ user, responses }: ProfileClientProps) => {
  const applicationStatus = user.applicationStatus;
  const application = responses.find(response => response.formType === FormType.APPLICATION);
  const liabilitySubmitted = !!responses.find(
    response => response.formType === FormType.LIABILITY_WAIVER
  );
  const photoReleaseSubmitted = !!responses.find(
    response => response.formType === FormType.PHOTO_RELEASE
  );

  return (
    <div className={styles.profileContainer}>
      <ProfileCard user={user} />
      {canUserSubmitWaivers(applicationStatus) && (
        <div className={styles.formsContainer}>
          <Card gap={1.5} className={styles.liability}>
            <Heading>Liability Form Status</Heading>
            <StatusTag
              status={
                liabilitySubmitted ? ApplicationStatus.SUBMITTED : ApplicationStatus.NOT_SUBMITTED
              }
            ></StatusTag>
            {!liabilitySubmitted ? (
              <>
                <Typography variant="body/large">
                  Our records have indicated that you have not started on your liability waiver.
                  Click below to begin your hacker journey!
                </Typography>
                <Typography variant="body/large">
                  Please note that forms are due on April 04, 2025. Reference the hackathon timeline
                  for more information.
                </Typography>
                <Button href="/liability">Complete Now</Button>
              </>
            ) : (
              <>
                <Typography variant="body/large">
                  Thank you for completing your liability waiver! You&apos;re one step closer to
                  your hacker journey.
                </Typography>
                <Typography variant="body/large">
                  Remember, the hackathon will take place on April 5-6, 2025. We look forward to
                  seeing you there!
                </Typography>
              </>
            )}
          </Card>
          <Card gap={1.5} className={styles.photo}>
            <Heading>Photo Release Form Status</Heading>
            <StatusTag
              status={
                photoReleaseSubmitted
                  ? ApplicationStatus.SUBMITTED
                  : ApplicationStatus.NOT_SUBMITTED
              }
            ></StatusTag>
            {!photoReleaseSubmitted ? (
              <>
                <Typography variant="body/large">
                  Our records have indicated that you have not started on your photo release form.
                  Click below to begin your hacker journey!
                </Typography>
                <Typography variant="body/large">
                  Please note that forms are due on April 04, 2025. Reference the hackathon timeline
                  for more information.
                </Typography>
                <Button href="/photoRelease">Complete Now</Button>
              </>
            ) : (
              <>
                <Typography variant="body/large">
                  Thank you for completing your photo release form! You&apos;re one step closer to
                  your hacker journey.
                </Typography>
                <Typography variant="body/large">
                  Remember, the hackathon will take place on April 5-6, 2025. We look forward to
                  seeing you there!
                </Typography>
              </>
            )}
          </Card>
        </div>
      )}
      {application && (
        <ApplicationCard application={application} applicationStatus={user.applicationStatus} />
      )}
    </div>
  );
};

export default Profile;
