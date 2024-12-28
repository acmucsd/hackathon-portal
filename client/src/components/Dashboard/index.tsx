import Image from 'next/image';
import Card from '../Card';
import styles from './style.module.scss';
import Banner from '@/../public/assets/banner.png';
import Typography from '../Typography';
import Link from 'next/link';
import FAQ from '../FAQAccordion';
import { QUESTIONS } from '../FAQAccordion/questions';

interface DashboardProps {}

const Dashboard = ({}: DashboardProps) => {
  return (
    <div className={styles.container}>
      <Card gap={1.5} className={styles.banner}>
        <Image
          src={Banner}
          alt="Two diamond critters find a large jewel in a vault"
          width={(350 / Banner.height) * Banner.width}
          height={350}
          className={styles.bannerImage}
        />
      </Card>
      <Card gap={1.5} className={styles.status}>
        <Typography variant="headline/heavy/small" component="h2">
          Application Status
        </Typography>
      </Card>
      <Card gap={1.5} className={styles.timeline}>
        <Typography variant="headline/heavy/small" component="h2">
          Timeline
        </Typography>
      </Card>
      <Card gap={1.5} className={styles.faq}>
        <Typography variant="headline/heavy/small" component="h2">
          Frequently Asked Questions
        </Typography>
        <div>
          <FAQ data={QUESTIONS} />
        </div>
        <Typography variant="body/large" component="p">
          Still have questions? Email{' '}
          <Link href="mailto:hackathon@acmucsd.org" className="link">
            hackathon@acmucsd.org
          </Link>{' '}
          to reach DiamondHack’s organizers!
        </Typography>
      </Card>
    </div>
  );
};

export default Dashboard;
