'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Suspense } from 'react';
import MessagesContainer from './messages-container';

interface ProjectViewProps {
  projectId: string;
}

const ProjectView = ({ projectId }: ProjectViewProps) => {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={25} maxSize={35}>
          <Suspense fallback={<div>Loading Messages...</div>}>
            <MessagesContainer projectId={projectId} />
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
