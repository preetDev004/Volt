'use client';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

const GreetButton = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.greet.queryOptions({ text: 'world' }));
  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <Button variant={'default'}>{data.greeting}</Button>
    </main>
  );
};

export default GreetButton;
