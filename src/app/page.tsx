import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import GreetButton from './GreetButton';
import { Suspense } from 'react';

export default async function Home() {
  prefetch(trpc.greet.queryOptions({ text: 'world' }));
  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
        <GreetButton />
      </Suspense>
    </HydrateClient>
  );
}
