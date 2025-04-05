'use client';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import TextField from '@/components/TextField';
import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import ToggleSwitch from '@/components/ToggleSwitch';
import Typography from '@/components/Typography';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import { EventAPI } from '@/lib/api';
import { Day, EventType } from '@/lib/types/enums';
import { PublicEvent } from '@/lib/types/apiResponses';
import styles from './style.module.scss';
import { reportError } from '@/lib/utils';
import showToast from '@/lib/showToast';
import { useState, useEffect } from 'react';

interface EventFormProps {
  accessToken: string;
  event?: PublicEvent;
}

const EventForm = ({ accessToken, event }: EventFormProps) => {
  const [currentEvent, setCurrentEvent] = useState<PublicEvent | undefined>(event);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<PublicEvent>({
    defaultValues: currentEvent || {
      type: EventType.INFO,
      day: Day.SATURDAY,
      published: false,
    },
  });

  useEffect(() => {
    if (currentEvent) {
      Object.keys(currentEvent).forEach(key => {
        setValue(key as keyof PublicEvent, currentEvent[key as keyof PublicEvent]);
      });
    }
  }, [currentEvent, setValue]);

  // Update or create event

  const onSubmit: SubmitHandler<PublicEvent> = async eventData => {
    try {
      if (!eventData.locationLink?.trim()) {
        delete eventData.locationLink;
      }

      if (event) {
        const updatedEvent = await EventAPI.updateEvent(accessToken, eventData, event.uuid);
        if ('error' in updatedEvent) {
          showToast('Changes failed to save', updatedEvent.error);
          return;
        }
        showToast(`Successfully updated event: ${updatedEvent.name}`);
        setCurrentEvent(updatedEvent);
      } else {
        const createdEvent = await EventAPI.createEvent(accessToken, eventData);
        showToast(`Successfully created event: ${createdEvent.name}`);
      }
    } catch (error) {
      reportError("Couldn't save event", error);
    }
  };

  const discardChanges = () => {
    reset(
      currentEvent || {
        type: EventType.INFO,
        day: Day.SATURDAY,
        published: false,
      }
    );
  };

  const deleteEvent = async () => {
    if (currentEvent) {
      try {
        await EventAPI.deleteEvent(accessToken, currentEvent.uuid);
        showToast(`Successfully deleted event: ${currentEvent.name}`);
      } catch (error) {
        reportError("Couldn't delete event", error);
      }
    }
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => setShowConfirm(true);
  const handleCancel = () => setShowConfirm(false);
  const handleConfirmDelete = () => {
    deleteEvent();
    setShowConfirm(false);
  };

  return (
    <Card gap={2} className={styles.container}>
      <Button href="/manageEvents" variant="tertiary" className={styles.backButton}>
        {'< Back'}
      </Button>
      {showConfirm && (
        <div className={styles.modalContainer} onClick={handleCancel}>
          <Card gap={1} className={styles.confirmModal}>
            <Heading>Are you sure you want to delete this event?</Heading>
            <Typography variant="body/large">
              Click below to confirm the deletion of the event.
            </Typography>
            <div className={styles.buttonContainer}>
              <Button className={styles.deleteButton} onClick={handleConfirmDelete}>
                Yes, Delete
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </div>
          </Card>
        </div>
      )}
      <Heading>{currentEvent ? 'Modify Event' : 'Create Event'}</Heading>
      <hr className={styles.divider} />
      <div className={styles.form}>
        <TextField
          id="name"
          label="Event Name"
          error={errors.name}
          defaultText={currentEvent?.name || 'Enter name of event'}
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
          error={errors.host}
          defaultText={currentEvent?.host || 'Enter host(s) of event'}
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
          error={errors.location}
          defaultText={currentEvent?.location || 'Enter location of event'}
          formRegister={register('location', {
            required: 'Missing input/field.',
          })}
          type="text"
          autoComplete="off"
          variant="horizontal"
        />
        <TextField
          id="locationLink"
          label="Location Link (Optional)"
          error={errors.locationLink}
          defaultText={currentEvent?.locationLink || 'Enter location link of event'}
          formRegister={register('locationLink')}
          type="text"
          autoComplete="off"
          variant="horizontal"
        />
        <TextField
          id="description"
          label="Description"
          error={errors.description}
          defaultText={currentEvent?.description || 'Enter description of event'}
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
            defaultText={currentEvent?.startTime || '0:00'}
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
            defaultText={currentEvent?.endTime || '0:00'}
            type="time"
            autoComplete="off"
            variant="horizontal"
          />
        </div>
        <Controller
          name="published"
          control={control}
          render={({ field }) => (
            <ToggleSwitch label="Published?" onToggle={field.onChange} checked={field.value} />
          )}
        />
        <div className={styles.buttonContainer}>
          {event && (
            <>
              <Button className={styles.deleteButton} onClick={handleDeleteClick}>
                Delete Event
              </Button>
              <Button variant="tertiary" onClick={discardChanges}>
                Discard Changes
              </Button>
            </>
          )}
          <Button onClick={handleSubmit(onSubmit)}>
            {event ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventForm;
