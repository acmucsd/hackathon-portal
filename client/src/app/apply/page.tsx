'use client';

import Card from '@/components/Card';
import Checkbox from '@/components/Checkbox';
import Heading from '@/components/Heading';
import Typography from '@/components/Typography';
import Link from 'next/link';

export default function Application() {
  return (
    <Card gap={2}>
      <Link href="/">&lt; Back</Link>
      <Heading>Demographic Information</Heading>
      <Typography variant="body/large">
        Welcome to DiamondHacks! Our mission at DiamondHacks is to bring together hackers from
        diverse backgrounds to develop innovative solutions to real world problems. All experience
        levels are welcome. Your information will not be publicly shared other than for collecting
        statistics and logistics about DiamondHacks hackathon. We hope to see you there!
      </Typography>
      <Typography variant="body/large">* indicates a required field.</Typography>
      <hr />
      <fieldset>
        <legend>
          <Typography variant="body/large">What is your expected graduation date?*</Typography>
        </legend>
        <Checkbox name="gradYear" value="2025" checked={false} onChecked={console.log} type="radio">
          2025
        </Checkbox>
        <Checkbox name="gradYear" value="2026" checked={false} onChecked={console.log} type="radio">
          2026
        </Checkbox>
        <Checkbox name="gradYear" value="2027" checked={false} onChecked={console.log} type="radio">
          2027
        </Checkbox>
        <Checkbox name="gradYear" value="2028" checked={false} onChecked={console.log} type="radio">
          2028
        </Checkbox>
      </fieldset>
    </Card>
  );
}
