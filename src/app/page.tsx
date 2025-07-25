'use client';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { Suspense } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.inngest_test.mutationOptions({
      onSuccess: (data, variables, context) => {
        toast.success('Invoke was successfull!', {
          description: 'Woohoo!',
        });
      },
      onError: (error, variables, context) => {
        toast.error('Invoke was unsuccessfull!', {
          description: 'try again!',
        });
      },
    })
  );
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Button
        disabled={invoke.isPending}
        className="m-4 p-2"
        onClick={() => invoke.mutate({ text: 'preet' })}
      >
        Invoke test
      </Button>
    </Suspense>
  );
}
