'use client';
import { Fragment } from '@/generated/prisma';
import { Check, Copy, ExternalLink, RotateCw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import Hint from '../ui/hint';

interface FragmentWebViewProps {
  fragment: Fragment;
}

const FragmentWebView = ({ fragment }: FragmentWebViewProps) => {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleRefresh = () => {
    setFragmentKey(prev => prev + 1);
  };

  const handleCopy = () => {
    if (fragment.sandboxUrl) {
      navigator.clipboard.writeText(fragment.sandboxUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center p-2 gap-x-2 bg-foreground-muted">
        <Hint content="Refresh Page">
          <Button
            aria-label="Refresh"
            variant="outline"
            size="sm"
            disabled={!fragment.sandboxUrl}
            onClick={handleRefresh}
          >
            <RotateCw className="size-3" />
          </Button>
        </Hint>
        <Hint content="Copy URL">
          <Button
            aria-label="app url"
            variant="outline"
            size="sm"
            className="flex-1 justify-start text-start font-normal"
            disabled={!fragment.sandboxUrl || copied}
            onClick={handleCopy}
          >
            <span className="truncate flex items-center gap-2">
              {copied ? (
                <Check className="size-3" />
              ) : (
                <Copy className="size-3" />
              )}
              {fragment.sandboxUrl}
            </span>
          </Button>
        </Hint>
        <Hint content="Open Preview in new tab">
          <Button
            aria-label="Open in new tab"
            variant="outline"
            size="sm"
            disabled={!fragment.sandboxUrl}
            onClick={() => {
              if (fragment.sandboxUrl) {
                window.open(fragment.sandboxUrl, '_blank');
              }
            }}
          >
            <ExternalLink className="size-3" />
          </Button>
        </Hint>
      </div>
      <div className="flex-1 px-2 pb-2">
        <iframe
          key={fragmentKey}
          src={fragment.sandboxUrl}
          className="w-full h-full rounded-xl"
          sandbox="allow-scripts allow-forms allow-same-origin"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default FragmentWebView;
