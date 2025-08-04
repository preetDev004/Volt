'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const trpc = useTRPC();
  const rounter = useRouter();
  const [userPrompt, setUserPrompt] = useState('');

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: data => {
        toast.success('Invoke was successfull!', {
          description: 'Woohoo!',
        });
        rounter.push(`/projects/${data.id}`);
      },
      onError: error => {
        toast.error('Invoke was unsuccessfull!', {
          description: error.message,
        });
      },
    })
  );
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex max-w-7xl mx-auto flex-col items-center justify-center h-full">
          <Input
            className="m-4 p-2"
            value={userPrompt}
            onChange={e => setUserPrompt(e.target.value)}
          />
          <Button
            disabled={createProject.isPending}
            className="m-4 p-2"
            onClick={() => createProject.mutate({ prompt: userPrompt })}
          >
            Create project
          </Button>
          {createProject.data && (
            <div className="m-4 p-2">{createProject.data.name}</div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
