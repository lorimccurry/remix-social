import type { ComponentPropsWithoutRef } from 'react';

export type Props = ComponentPropsWithoutRef<'div'> & {
  title?: string;
};
