'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const trpc = useTRPC();
  const [userPrompt, setUserPrompt] = useState('');

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions()
  );

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
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
        value={userPrompt}
        onChange={e => setUserPrompt(e.target.value)}
      />
      <Button
        disabled={createMessage.isPending}
        className="m-4 p-2"
        onClick={() => createMessage.mutate({ prompt: userPrompt })}
      >
        Create message
      </Button>
      {createMessage.data && (
        <div className="m-4 p-2">{createMessage.data.content}</div>
      )}
      <div className="m-4 p-2">{JSON.stringify(messages, null, 2)}</div>
    </Suspense>
  );
}
