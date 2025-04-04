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

interface LiabilityFormProps {
  accessToken: string;
}

interface LiabilityFormValues {
  participantName: string;
  dateOfBirth: string;
  signature: string;
  date: string;
}

const LiabilityForm = ({ accessToken }: LiabilityFormProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LiabilityFormValues>();

  const onSubmit: SubmitHandler<LiabilityFormValues> = async waiver => {
    const submittedWaiver = await ResponseAPI.submitLiabilityWaiver(accessToken, waiver);
    if ('error' in submittedWaiver) {
      showToast("Couldn't submit waiver", submittedWaiver.error);
      return;
    }
    router.push('/profile');
  };
  return (
    <Card gap={1.5} className={styles.container}>
      <Heading>DiamondHacks Liability Waiver</Heading>
      <Typography variant="body/medium">
        <strong>Waiver of Liability, Assumption of Risk, and Indemnity Agreement</strong>
      </Typography>
      <Typography variant="body/medium">UNIVERSITY OF CALIFORNIA, San Diego</Typography>
      <Typography variant="body/medium">
        <strong>Waiver:</strong> In return for being permitted to participate in DiamondHacks 2025
        on April 5-6th, 2025 at UC San Diego (“The Activity”), including any associated use of the
        premises, facilities, staff, equipment, transportation, and services of the University, I,
        for myself, heirs, personal representatives, and assigns, do hereby release, waive,
        discharge, and promise not to sue The Regents of the University of California, the
        Association for Computing Machinery, Triton Engineering Student Council, and their
        respective directors, officers, employees, and agents (collectively “The Releasees”), from
        liability from any and all claims, including the negligence of The Releasees, resulting in
        personal injury (including death), accidents or illnesses, and property loss, in connection
        with my participation in the Activity and any use of University premises and facilities.
      </Typography>
      <Typography variant="body/medium">
        <strong>Name of Student Organization/Club:</strong> Association for Computing Machinery at
        UC San Diego
      </Typography>
      <Typography variant="body/medium">
        <strong>Description of the Activity (include date, time, location):</strong> Hackathon
        Weekend, April 5-6 at UC San Diego 
      </Typography>
      <Typography variant="body/medium">
        <strong>Assumption of Risks:</strong> Participation in The Activity carries with it certain
        inherent risks that cannot be eliminated regardless of the care taken to avoid injury. The
        specific risks vary from one activity to another, but the risks range from: 1) Minor
        injuries such as scratches, bruises, and sprains 2) Major injuries such as eye injury, joint
        or bone injuries, heart attacks, and concussions 3) Catastrophic injuries such as paralysis
        and death.
      </Typography>
      <Typography variant="body/medium">
        <strong>Indemnification and Hold Harmless:</strong> I also agree to indemnify and hold The
        Releasees harmless from any and all claims, actions, suits, procedures, costs, expenses,
        damages and liabilities, including attorney’s fees, arising out of my involvement in The
        Activity, and to reimburse it for any such expenses incurred.
      </Typography>
      <Typography variant="body/medium">
        <strong>Severability:</strong> I further agree that this Waiver of Liability, Assumption of
        Risk, and Indemnity Agreement is intended to be as broad and inclusive as permitted by law,
        and that if any portion is held invalid, the remaining portions will continue to have full
        legal force and effect.
      </Typography>
      <Typography variant="body/medium">
        <strong>Governing Law and Jurisdiction:</strong> This Agreement shall be governed by the
        laws of the State of California, and any disputes arising out of or in connection with this
        Agreement shall be under the exclusive jurisdiction of the Courts of the State of
        California.
      </Typography>
      <Typography variant="body/medium">
        <strong>Acknowledgment of Understanding:</strong> I have read this Waiver of Liability,
        Assumption of Risk, and Indemnity Agreement, fully understand its terms, and understand that
        I am giving up substantial rights, including my right to sue. I confirm that I am signing
        the agreement freely and voluntarily, and intend my signature to be a complete and
        unconditional release of all liability to the greatest extent allowed by law.
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

export default LiabilityForm;
