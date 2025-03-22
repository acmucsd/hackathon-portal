// import { Typography } from '@/components/common';
// import CalendarButtons from '@/components/events/CalendarButtons';
// import { config } from '@/lib';
// import CloseIcon from '@/public/assets/icons/close-icon.svg';
// import Image from 'next/image';
// import Link from 'next/link';
// import { VscFeedback } from 'react-icons/vsc';
// import styles from './style.module.scss';

// interface ResourceDetailProps {
//   resource: PublicResource;
//   inModal?: boolean;
// }

// const ResourceDetail = ({ resource, inModal = false }: ResourceDetailProps) => {
//   const { cover, title, start, end, location, description } = resource;

//   const displayCover = getDefaultEventCover(cover);
//   const isUpcomingEvent = new Date(start) > new Date();

//   let buttons = null;
//   if (!isOrderPickupEvent(resource)) {
//     if (isUpcomingEvent) {
//       buttons = <CalendarButtons event={resource} />;
//     } else if (inModal) {
//       buttons = (
//         <Link href={`${config.eventsRoute}/${resource.uuid}`} className={styles.feedbackBtn}>
//           <VscFeedback aria-hidden />
//           Add Feedback
//         </Link>
//       );
//     }
//   }

//   return (
//     <div className={`${styles.container} ${inModal ? '' : styles.standalone}`}>
//       {inModal ? (
//         <button type="submit" aria-label="Close" className={styles.close}>
//           <CloseIcon aria-hidden className={styles.closeIcon} />
//         </button>
//       ) : null}
//       <div className={`${styles.image} ${inModal ? '' : styles.standalone}`}>
//         <Image src={displayCover} alt="Event Cover Image" style={{ objectFit: 'cover' }} fill />
//       </div>
//       <div className={`${styles.header} ${inModal ? '' : styles.standalone}`}>
//         <div className={styles.eventDetails}>
//           <div>
//             <Typography
//               className={styles.eventTitle}
//               variant="title/large"
//               style={{ fontWeight: 700 }}
//             >
//               {title}
//             </Typography>
//             <Typography className={styles.eventInfo} variant="title/small" suppressHydrationWarning>
//               {formatEventDate(start, end, true)}
//             </Typography>
//             <Typography className={styles.eventInfo} variant="title/small">
//               {location}
//             </Typography>
//           </div>
//         </div>

//         {buttons}
//       </div>

//       <Typography
//         variant="h5/regular"
//         style={{ wordBreak: 'break-word' }}
//         className={`${styles.description} ${inModal ? '' : styles.standalone}`}
//       >
//         {description}
//       </Typography>
//     </div>
//   );
// };

// export default ResourceDetail;
