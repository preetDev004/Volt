'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const trpc = useTRPC();
  const [text, setText] = useState('');

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
      <Input
        className="m-4 p-2 w-full"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <Button
        disabled={invoke.isPending}
        className="m-4 p-2"
        onClick={() => invoke.mutate({ text: text })}
      >
        Invoke test
      </Button>
      {invoke.data && <div className="m-4 p-2">{invoke.data.message}</div>}
    </Suspense>
  );
}
