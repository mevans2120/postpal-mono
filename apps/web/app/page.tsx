'use client';

import { Daybook } from '@postpal/ui';
import { avcUfe } from '@postpal/content';

export default function Home() {
  return <Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />;
}
