import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Form, FormField } from '../ui/form';
import { toast } from 'sonner';

interface MessageFormProps {
  projectId: string;
}

const formSchema = z.object({
  prompt: z
    .string()
    .min(1, { message: 'Prompt is required' })
    .max(10000, { message: 'Prompt is too long' }),
});

const MessageForm = ({ projectId }: MessageFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // TODO: Adding Context for AI - Previous Fragments, etc.
    await sendMessage.mutateAsync({
      projectId,
      prompt: values.prompt,
    });
  };
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const sendMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        setIsFocused(false);
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId })
        );
        // TODO: Add usage tracking
      },
      onError: error => {
        // TODO: redirect to pricing page if user is over limit
        toast.error(error.message);
      },
    })
  );
  const [isFocused, setIsFocused] = useState(false);
  const showUsage = false;
  const isPending = sendMessage.isPending;
  const isDisabled =
    isPending || form.formState.isSubmitting || !form.formState.isValid;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'relative border p-3 pt-1 rounded-xl bg-muted-foreground/5 transition-all duration-200 ease-in-out',
          form.formState.isSubmitting && 'opacity-50',
          isFocused && 'shadow-sm',
          showUsage && 'rounded-t-none'
        )}
      >
        <FormField
          disabled={isPending}
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="w-full pt-2 border-none resize-none bg-transparent outline-none"
              placeholder="Ask Volt to build..."
              disabled={form.formState.isSubmitting}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />
        <div className="flex items-end justify-between gap-x-2">
          <div className="text-[10px] font-mono text-muted-foreground ">
            <kbd className="ml-auto pointer-events-none inline-flex items-center gap-1 h-5 select-none rounded bg-muted-foreground/5 border px-1.5 text-muted-foreground font-medium">
              <span>&#8984;</span>Enter
            </kbd>
            &nbsp;to submit
          </div>
          <Button
            type="submit"
            className={cn(
              'size-8 rounded-full transition-all duration-200 ease-in-out',
              isPending && 'opacity-50',
              !isDisabled && 'bg-primary/80 hover:bg-primary/90 hover:scale-105'
            )}
            disabled={isDisabled}
          >
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MessageForm;
