import Card from '@/components/Card';
import styles from './page.module.scss';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import Typography from '@/components/Typography';

export default function Home() {
  return (
    <main className={styles.main}>
      <Card gap={1}>
        <Heading centered>Hello gamers</Heading>
        <Typography variant="body/medium" component="p">
          The Association for Computing Machinery (ACM) is the world’s largest society for
          computing. Created during the beginning of the Computer Revolution, the organization has
          played a strong role in the development of the eld. With over 100,000 members, ACM’s
          members span the entire globe and are leaders throughout industry and research. The
          organization aims to advance the eld of computing as both a science and as a profession,
          so that its members can use their knowledge for the greater social good.
        </Typography>
        <Typography variant="body/medium" component="p">
          Chapters of ACM exist at many universities around the world, creating a vast global
          network connecting thousands of students together. In 2019, ACM at UC San Diego has been
          revived in an effort to foster a diverse community for all students interested in the eld
          of computing. This constitution serves to govern its operations. It denes the Chapter’s
          goals, its moral code, its membership requirements, its Activity specications, its
          organizational structure, its Board responsibilities, its nancial duties, its Advisor’s
          role, and its constitutional amendment process. This shall be an all binding document
          governing the Chapter’s functions and the actions of its members.
        </Typography>
        <Typography variant="body/medium" component="p">
          Finally, due to the ever-changing nature of the organization, every year the new Executive
          board may make changes to the constitution as they see t based on what they feel is
          necessary to better lead the organization. These changes should be discussed openly with
          the rest of board.
        </Typography>
        <div className={styles.buttonRow}>
          <Button variant="tertiary">Discard Changes</Button>
          <Button variant="secondary" href="/">
            Save Changes
          </Button>
          <Button variant="primary">Next</Button>
        </div>
      </Card>
    </main>
  );
}
