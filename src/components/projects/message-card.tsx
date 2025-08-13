import { Fragment, MessageRole, MessageType } from '@/generated/prisma';
import { cn } from '@/lib/utils';
import { formatDate } from 'date-fns';
import { ChevronRightIcon, Code2Icon, SparklesIcon } from 'lucide-react';
import Image from 'next/image';
import { Card } from '../ui/card';

interface MessageCardProps {
  content: string;
  role: MessageRole;
  type: MessageType;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const MessageCard = ({
  content,
  role,
  type,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
}: MessageCardProps) => {
  if (role === MessageRole.ASSISTANT) {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        createdAt={createdAt}
        type={type}
      />
    );
  }
  return <UserMessage content={content} />;
};
export default MessageCard;

interface MessageProps {
  content: string;
}

const UserMessage = ({ content }: MessageProps) => {
  return (
    <div className="flex justify-end pb-4 pl-10 pr-1">
      <Card className="rounded-lg bg-muted p-3 border-none shadow-none max-w-[80%] break-words">
        {content}
      </Card>
    </div>
  );
};

interface AssistantMessageProps {
  content: string;
  fragment: Fragment | null;
  isActiveFragment: boolean;
  createdAt: Date;
  type: MessageType;
  onFragmentClick: (fragment: Fragment) => void;
}
const AssistantMessage = ({
  type,
  content,
  fragment,
  isActiveFragment,
  onFragmentClick,
  createdAt,
}: AssistantMessageProps) => {
  return (
    <div
      className={cn(
        'flex flex-col group px-1 pb-4',
        type === MessageType.ERROR &&
          'text-red-700 dark:text-red-500 bg-destructive/10',
        isActiveFragment && 'bg-primary/10'
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Image
          src="/logo.svg"
          alt="Volt"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-base font-semibold">Volt</span>
        <span className="text-sm font-light text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {formatDate(createdAt, "HH:mm 'on' MMM d, yyyy")}
        </span>
      </div>
      <div className="flex flex-col pl-6.5 gap-y-4 break-words">
        <span>{content}</span>
        {fragment && type === MessageType.RESULT && (
          <FragmentCard
            fragment={fragment}
            onFragmentClick={onFragmentClick}
            isActiveFragment={isActiveFragment}
          />
        )}
      </div>
    </div>
  );
};

interface FragmentCardProps {
  fragment: Fragment;
  onFragmentClick: (fragment: Fragment) => void;
  isActiveFragment: boolean;
}

const FragmentCard = ({
  fragment,
  onFragmentClick,
  isActiveFragment,
}: FragmentCardProps) => {
  return (
    <button
      className={cn(
        'group/fragment relative w-full max-w-md rounded-xl border bg-gradient-to-br from-muted/50 to-muted/30 p-4 text-left transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30',
        'backdrop-blur-sm',
        isActiveFragment && [
          'bg-gradient-to-br from-primary/10 to-primary/5',
          'border-primary/50 shadow-lg shadow-primary/20',
          'ring-2 ring-primary/20',
        ]
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      {/* Background glow effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl bg-gradient-to-br to-primary/5 from-transparent opacity-0 transition-opacity duration-300',
          'group-hover/fragment:opacity-100',
          isActiveFragment && 'opacity-100'
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/0 to-primary/10'
              )}
            >
              <Code2Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground line-clamp-1 group-hover/fragment:text-primary transition-colors">
                {fragment.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {Object.keys(fragment.files as object).length} file
                {Object.keys(fragment.files as object).length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Action indicator */}
          {isActiveFragment ? (
            <div className="flex items-center justify-center h-8">
              <div className="flex items-center justify-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <SparklesIcon className="size-3" />
                Active
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full bg-muted/50',
                'group-hover/fragment:bg-primary/10 group-hover/fragment:scale-110 transition-all duration-300'
              )}
            >
              <ChevronRightIcon className="size-4 text-muted-foreground group-hover/fragment:text-primary transition-colors" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
