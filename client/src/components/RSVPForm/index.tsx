'use client';
import { RSVP } from '@/lib/types/application';
import Card from '../Card';
import Heading from '../Heading';
import MultipleChoiceGroup from '../MultipleChoiceGroup';
import TextField from '../TextField';
import Button from '../Button';
import Typography from '../Typography';
import { ResponseAPI } from '@/lib/api';
import showToast from '@/lib/showToast';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import styles from './style.module.scss';
import { Yes } from '@/lib/types/enums';

interface RSVPFormProps {
  accessToken: string;
}

const RSVPForm = ({ accessToken }: RSVPFormProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RSVP>();

  const onSubmit: SubmitHandler<RSVP> = async form => {
    const submittedForm = await ResponseAPI.submitRSVP(accessToken, form);
    if ('error' in submittedForm) {
      showToast("Couldn't submit form", submittedForm.error);
      return;
    }
    router.push('/profile');
  };
  return (
    <Card gap={1.5} className={styles.container}>
      <Heading>DiamondHacks RSVP Form</Heading>
      <Typography variant="body/medium">
        Welcome to DiamondHacks 2026! Please fill out this form to confirm your acceptance and
        reserve your spot.
      </Typography>
      <Typography variant="body/medium">
        Spots that are unfilled by 3/20 will be offered to waitlisted attendees.
      </Typography>
      <Typography variant="body/medium">
        Our mission at DiamondHacks is to bring together hackers from diverse backgrounds to develop
        innovative solutions to real world problems. All experience levels are welcome. We hope to
        see you there!
      </Typography>
      <Typography variant="body/medium">
        Contact hackathon@acmucsd.org with any questions!
      </Typography>
      <Typography variant="label/medium" component="p">
        I am attending DiamondHacks on April 4-5 at UC San Diego.
      </Typography>
      <MultipleChoiceGroup
        mode="radio"
        name="willAttend"
        choices={[Yes.YES]}
        formRegister={register}
        required
      />
      {/* <Typography variant="label/medium" component="p">
        I joined the DiamondHacks discord (
          <a href='https://acmurl.com/diamondhacks26-discord'>
            https://acmurl.com/diamondhacks26-discord
          </a>
        )
      </Typography>
      <MultipleChoiceGroup
        mode="radio"
        name="joinedDiscord"
        choices={[Yes.YES]}
        formRegister={register}
        required
      /> */}
      <TextField
        id="additionalComments"
        label="Any questions, comments, or concerns?"
        defaultText="Type answer here..."
        error={errors.additionalComments}
        formRegister={register('additionalComments', {})}
        type="text"
        autoComplete="name"
      />
      <Button variant="primary" onClick={handleSubmit(onSubmit)}>
        Submit
      </Button>
    </Card>
  );
};

export default RSVPForm;
