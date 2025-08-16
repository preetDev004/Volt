'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Suspense, useState } from 'react';
import MessagesContainer from '@/components/messages/messages-container';
import { Fragment } from '@/generated/prisma';
import ProjectHeader from './project-header';

interface ProjectViewProps {
  projectId: string;
}

const ProjectView = ({ projectId }: ProjectViewProps) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={30}
          minSize={25}
          maxSize={35}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<div>Loading Project Header...</div>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<div>Loading Messages...</div>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={70}
          minSize={65}
          maxSize={75}
          className="flex flex-col min-h-0"
        >
          <div>TODO: Add project view</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
