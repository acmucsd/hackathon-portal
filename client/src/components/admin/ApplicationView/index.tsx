'use client';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { appQuestions } from '@/config';
import { Fragment } from 'react';
import StatusTag from '@/components/StatusTag';
import { AdminAPI } from '@/lib/api';
import { ResponseModel } from '@/lib/types/apiResponses';
import { ApplicationDecision, ApplicationStatus, FormType } from '@/lib/types/enums';
import { reportError } from '@/lib/utils';
import { useState } from 'react';
import styles from './style.module.scss';
import Link from 'next/link';

interface ApplicationStats {
  total: number;
  accepted: number;
  rejected: number;
  waitlisted: number;
  acceptedPct: number;
}

interface ApplicationViewProps {
  application: ResponseModel;
  token: string;
  decision: ApplicationDecision;
  status: ApplicationStatus;
  waivers: ResponseModel[];
  stats: ApplicationStats;
  reviewer: any; // TODO
  reviewerOverview: any; // TODO
  onConfirm?: () => Promise<void> | void;
}

const ApplicationView = ({
  application,
  token,
  decision,
  status,
  waivers,
  stats,
  reviewer,
  reviewerOverview,
  onConfirm,
}: ApplicationViewProps) => {
  const responses: Record<string, string | string[] | File | any> = application.data;
  const user = application.user;
  // const [currentDecision, setCurrentDecision] = useState(decision);
  const liabilitySubmitted = !!waivers.find(
    response => response.formType === FormType.LIABILITY_WAIVER
  );
  // const photoReleaseSubmitted = !!waivers.find(
  //   response => response.formType === FormType.PHOTO_RELEASE
  // );
  // const [currentStatus, setCurrentStatus] = useState(user.applicationStatus);

  const NO_RESPONSE = 'No response.';

  const safeNum = (v: unknown, fallback = 0) =>
    typeof v === 'number' && Number.isFinite(v) ? v : fallback;

  const computedStats = (() => {
    // reviewerId: r.reviewerId,
    // reviewerFirstName: r.reviewerFirstName,
    // reviewerLastName: r.reviewerLastName,
    // applicants: r.applicants,
    // total: r.total,
    // accept: r.accept,
    // reject: r.reject,
    // waitlist: r.waitlist,
    // noDecision: r.noDecision,
    // acceptedNonUcsd: r.acceptedNonUcsd,
    // acceptedNonUcsdPercentage,
    if (reviewerOverview == null) {
      return { total: 0, accepted: 0, rejected: 0, waitlisted: 0, acceptedPct: 0 };
    }
    const ro = reviewerOverview.reviewers;

    console.log('ro:', ro);

    let total = 0;
    let accepted = 0;
    let rejected = 0;
    let waitlisted = 0;

    //     export interface ReviewerOverviewReviewer {
    //   reviewerId: string;
    //   reviewerFirstName: string;
    //   reviewerLastName: string;
    //   applicants: ReviewerOverviewApplicant[];

    //   total: number;
    //   accept: number;
    //   reject: number;
    //   waitlist: number;
    //   noDecision: number;
    //   /** Number of accepted applicants who are non-UCSD. */
    //   acceptedNonUcsd: number;
    //   /** Percentage of accepted applicants who are non-UCSD (null if no accepted with non-null university). */
    //   acceptedNonUcsdPercentage: number | null;
    // }
    const reviewerToUse = reviewer;
    for (const reviewer of ro) {
      if (reviewer.reviewerId !== reviewerToUse.id) continue;

      total += reviewer.total;
      accepted += reviewer.accept;
      rejected += reviewer.reject;
      waitlisted += reviewer.waitlist;
    }

    // const total = safeNum(ro?.total ?? ro?.stats?.total, stats.total);
    // const accepted = safeNum(ro?.accepted ?? ro?.stats?.accepted, stats.accepted);
    // const rejected = safeNum(ro?.rejected ?? ro?.stats?.rejected, stats.rejected);
    // const waitlisted = safeNum(ro?.waitlisted ?? ro?.stats?.waitlisted, stats.waitlisted);

    const acceptedPct =
      total > 0
        ? Math.round((accepted / total) * 100)
        : safeNum(ro?.acceptedPct ?? ro?.stats?.acceptedPct, stats.acceptedPct);

    return { total, accepted, rejected, waitlisted, acceptedPct };
  })();

  return (
    // back to dashboard link + search bar
    <div className={styles.container}>

      {/* stats */}
      <div className={styles.stats}>
        <p className={styles.statsLeft}>
          {computedStats.accepted}
          <span className={styles.accepted}> Accepted </span>
          <span className={styles.gray}> | </span>
          {computedStats.rejected}
          <span className={styles.rejected}> Rejected </span>
          <span className={styles.gray}> | </span>
          {computedStats.waitlisted}
          <span className={styles.waitlisted}> Waitlisted</span>
        </p>
        <p className={styles.statsRight}>
          <span className={styles.gray}> Total applications: </span>
          {computedStats.total}
          <span className={styles.gray}> | Accepted: </span>
          {' ' + computedStats.acceptedPct + '%'}
        </p>
      </div>
      <hr className={styles.divider} />
      {/* back to dashboard */}
      <div className={styles.backBtnContainer}>
        <Link href="/manageUsers" className={styles.backLink}>
          {'< '}
          <span className={styles.backText}>Back to Dashboard</span>
        </Link>
      </div>
      {/* summary of fields */}
      <div className={styles.applicationContainer}>
        <Card gap={2}>
          <h1 className={styles.heading}>Summary of Important Fields</h1>
          <dl className={styles.responseList}>
            <dt className={styles.question}>Name </dt>
            <dd className={styles.response}>
              {user.firstName} {user.lastName}
            </dd>
            <dt className={styles.question}>University</dt>
            <dd className={styles.response}>{application.data.university ?? NO_RESPONSE}</dd>
            <dt className={styles.question}>Age</dt>
            <dd className={styles.response}>{application.data.age ?? NO_RESPONSE}</dd>
            <dt className={styles.question}>Race/Ethnicity</dt>
            <dd className={styles.response}>
              {application.data.ethnicity?.length > 0
                ? application.data.ethnicity.join(', ')
                : NO_RESPONSE}
            </dd>
            <span className={styles.interestQuestion}>
              <dt className={styles.question}>Filled out interest form: </dt>
              <dd className={styles.response}>
                <StatusTag
                  status={
                    liabilitySubmitted
                      ? ApplicationStatus.SUBMITTED
                      : ApplicationStatus.NOT_SUBMITTED
                  }
                ></StatusTag>
              </dd>
            </span>
          </dl>
        </Card>
        <Card gap={2}>
          <div className={styles.submissionHeader}>
            <h1 className={styles.heading}>Application Submission</h1>
          </div>
          <dl className={styles.responseList}>
            {appQuestions
              .flatMap(step => step.questions)
              .map(({ id, question }) => (
                <Fragment key={id}>
                  <dt className={styles.question}>{question}</dt>
                  <dd className={styles.response}>
                    {typeof responses[id] === 'string' ? (
                      id === 'resumeLink' ? (
                        <Button variant="secondary" href={responses[id]}>
                          View Resume
                        </Button>
                      ) : (
                        responses[id]
                      )
                    ) : Array.isArray(responses[id]) ? (
                      responses[id].join(', ')
                    ) : (
                      <em>{NO_RESPONSE}</em>
                    )}
                  </dd>
                </Fragment>
              ))}
          </dl>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationView;
