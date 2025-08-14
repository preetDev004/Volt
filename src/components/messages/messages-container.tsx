'use client';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import MessageCard from './message-card';
import MessageForm from './message-form';

interface MessagesContainerProps {
  projectId: string;
}

const MessagesContainer = ({ projectId }: MessagesContainerProps) => {
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-1.5">
          {messages.map(message => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              type={message.type}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={false}
              onFragmentClick={() => {}}
            />
          ))}
        </div>
        <div ref={bottomRef} className="pointer-events-none" />
      </div>
      <div className="relative p-3 pt-0.5">
        <div className="absolute -top-6 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-background pointer-events-none blur-sm" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};

export default MessagesContainer;
