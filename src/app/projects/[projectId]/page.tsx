import ProjectView from '@/components/projects/project-view';
import { getQueryClient, HydrateClient, trpc } from '@/trpc/server';
import { Suspense } from 'react';

const page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );
  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading Project...</div>}>
        <ProjectView projectId={projectId} />
      </Suspense>
    </HydrateClient>
  );
};

export default page;
