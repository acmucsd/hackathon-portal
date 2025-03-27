'use client';
import Card from '../Card';
import Heading from '../Heading';
import TextField from '../TextField';
import Button from '../Button';
import Typography from '../Typography';
import { ResponseAPI } from '@/lib/api';
import showToast from '@/lib/showToast';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import styles from './style.module.scss';

interface PhotoReleaseFormProps {
  accessToken: string;
}

interface PhotoReleaseFormValues {
  participantName: string;
  dateOfBirth: string;
  signature: string;
  date: string;
}

const PhotoReleaseForm = ({ accessToken }: PhotoReleaseFormProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhotoReleaseFormValues>();

  const onSubmit: SubmitHandler<PhotoReleaseFormValues> = async waiver => {
    const submittedWaiver = await ResponseAPI.submitPhotoRelease(accessToken, waiver);
    if ('error' in submittedWaiver) {
      showToast("Couldn't submit waiver", submittedWaiver.error);
      return;
    }
    router.push('/profile');
  };
  return (
    <Card gap={1.5} className={styles.container}>
      <Heading>Photo Release</Heading>
      <Typography variant="body/medium">UNIVERSITY OF CALIFORNIA, San Diego</Typography>
      <Typography variant="body/medium">
        I hereby grant the DiamondHacks Team permission to use my likeness in a photograph, video,
        or other digital media (“photo”) in any and all of its publications, including web-based
        publications, without payment or other consideration. I understand and agree that all photos
        will become the property of the DiamondHacks Team and will not be returned.
      </Typography>
      <Typography variant="body/medium">
        I hereby irrevocably authorize the DiamondHacks Team to edit, alter, copy, exhibit, publish,
        or distribute these photos for any lawful purpose. In addition, I waive any right to inspect
        or approve the finished product wherein my likeness appears. Additionally, I waive any right
        to royalties or other compensation arising or related to the use of the photo. I hereby hold
        harmless, release, and forever discharge the DiamondHacks Team from all claims, demands, and
        causes of action which I, my heirs, representatives, executors, administrators, or any other
        persons acting on my behalf or on behalf of my estate have or may have by reason of this
        authorization. I HAVE READ AND UNDERSTAND THE ABOVE PHOTO RELEASE. I AFFIRM THAT I AM AT
        LEAST 18 YEARS OF AGE, AND ACCEPT THE TERMS OF THE AGREEMENT AS EVIDENCED BY MY SIGNATURE.
      </Typography>
      <TextField
        id="participantName"
        label="Participant Name (print)"
        defaultText="Type answer here..."
        error={errors.participantName}
        formRegister={register('participantName', {
          required: 'Missing input/field.',
        })}
        type="text"
        autoComplete="name"
      />
      <TextField
        id="dateOfBirth"
        label="Date of Birth"
        defaultText="Type answer here..."
        error={errors.dateOfBirth}
        formRegister={register('dateOfBirth', {
          required: 'Missing input/field.',
        })}
        type="date"
        autoComplete="bday"
      />
      <TextField
        id="signature"
        label="Participant Signature (Full Name)"
        defaultText="Type answer here..."
        error={errors.signature}
        formRegister={register('signature', {
          required: 'Missing input/field.',
        })}
        type="text"
        autoComplete="name"
      />
      <TextField
        id="date"
        label="Date"
        defaultText="Type answer here..."
        error={errors.date}
        formRegister={register('date', {
          required: 'Missing input/field.',
        })}
        type="date"
        autoComplete="off"
      />
      <Button variant="primary" onClick={handleSubmit(onSubmit)}>
        Submit
      </Button>
    </Card>
  );
};

export default PhotoReleaseForm;
