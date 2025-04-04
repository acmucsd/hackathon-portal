'use client';

import { useForm, Controller } from 'react-hook-form';
import TextField from '@/components/TextField';
import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import ToggleSwitch from '@/components/ToggleSwitch';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import { Day, EventType } from '@/lib/types/enums';
import styles from './style.module.scss';

interface EventFormData {
  name: string;
  type: EventType;
  host: string;
  location: string;
  locationLink?: string;
  description: string;
  day: Day;
  startTime: string;
  endTime: string;
  published: boolean;
}

export default function EventForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventFormData>();

  const onSubmit = (data: EventFormData) => {
    console.log('Submitting event:', data);
    // TODO: Send data to backend
  };

  return (
    <Card gap={2}>
      <Heading>Create Event</Heading>
      <hr className={styles.divider} />
      <div className={styles.form}>
        <TextField
          id="name"
          label="Event Name"
          defaultText="Enter name of event"
          error={errors.name}
          formRegister={register('name', {
            required: 'Missing input/field.',
          })}
          type="text"
          autoComplete="off"
          variant="horizontal"
        />
        <Controller
          name="type"
          rules={{ required: 'Event Type is required' }}
          control={control}
          render={({ field }) => (
            <Dropdown
              name="typeOptions"
              options={Object.values(EventType)}
              value={field.value}
              onChange={field.onChange}
              className={styles.dropdown}
              placeholder="Choose type of event"
              ariaLabel="Event Type"
            />
          )}
        />
        <TextField
          id="host"
          label="Event Host"
          defaultText="Enter host(s) of event"
          error={errors.host}
          formRegister={register('host', {
            required: 'Missing input/field.',
          })}
          type="text"
          autoComplete="off"
          variant="horizontal"
        />
        <TextField
          id="location"
          label="Location"
          defaultText="Enter location of event"
          error={errors.location}
          formRegister={register('location', {
            required: 'Missing input/field.',
          })}
          type="text"
          autoComplete="off"
          variant="horizontal"
        />
        <TextField
          id="description"
          label="Description"
          defaultText="Enter description of event"
          error={errors.description}
          formRegister={register('description', {
            required: 'Missing input/field.',
          })}
          type="textarea"
          autoComplete="off"
        />
        <div className={styles.timeContainer}>
          <Controller
            name="day"
            rules={{ required: 'Event Day is required' }}
            control={control}
            render={({ field }) => (
              <Dropdown
                name="dayOptions"
                options={Object.values(Day)}
                value={field.value}
                onChange={field.onChange}
                className={styles.dropdown}
                placeholder="Day"
                ariaLabel="On"
              />
            )}
          />
          <TextField
            id="startTime"
            label="Starts at"
            error={errors.startTime}
            formRegister={register('startTime', {
              required: 'Missing input/field.',
            })}
            type="time"
            autoComplete="off"
            variant="horizontal"
          />
          <TextField
            id="endTime"
            label="and ends at"
            error={errors.endTime}
            formRegister={register('endTime', {
              required: 'Missing input/field.',
            })}
            type="time"
            autoComplete="off"
            variant="horizontal"
          />
        </div>
        <Controller
          name="published"
          control={control}
          render={({ field }) => <ToggleSwitch label="Published?" onToggle={field.onChange} />}
        />
        <Button onClick={handleSubmit(onSubmit)}>Create Event</Button>
      </div>
    </Card>
  );
}
