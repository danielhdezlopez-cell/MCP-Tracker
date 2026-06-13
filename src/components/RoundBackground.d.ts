import type { ReactElement } from 'react';

declare function RoundBackground(props: {
  round: number;
  leaderId?: string | null;
  side?: 'left' | 'right';
}): ReactElement | null;

export default RoundBackground;
