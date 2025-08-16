'use client';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import MessageCard from './message-card';
import MessageForm from './message-form';
import { Fragment, MessageRole } from '@/generated/prisma';
import MessageLoading from './message-loading';

interface MessagesContainerProps {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: MessagesContainerProps) => {
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      { projectId },
      {
        // TODO: Remove this once we have a better way to handle Live message updates
        refetchInterval: 5000,
      }
    )
  );
  // TODO!: This is causing issues as it updates the active fragment every 5000ms
  // useEffect(() => {
  //   const lastAssistantMessageWithFragment = messages.findLast(
  //     msg => msg.role === MessageRole.ASSISTANT && !!msg.fragment
  //   );

  //   if (lastAssistantMessageWithFragment) {
  //     setActiveFragment(lastAssistantMessageWithFragment.fragment);
  //   }
  // }, [messages, setActiveFragment]);

  const isLastMessageUser =
    messages[messages.length - 1].role === MessageRole.USER;

  const bottomRef = useRef<HTMLDivElement>(null);
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
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
              isActiveFragment={activeFragment?.id === message.fragment?.id}
              onFragmentClick={() => {
                setActiveFragment(message.fragment);
              }}
            />
          ))}
        </div>
        {isLastMessageUser && <MessageLoading />}
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
