import Image from 'next/image';
import { useEffect, useState } from 'react';

const ShimmerMessage = () => {
  const message = [
    'Thinking...',
    'Loading...',
    'Generating...',
    'Analyzing your request...',
    'Processing your request...',
    'Building your website...',
    'Crafting Components...',
    'Optimizing Layout...',
    'Adding final touches...',
    'Almost there...!!',
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % message.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="flex items-center justify-start gap-2">
      <span className="text-base text-muted-foreground animate-pulse transition-all duration-300">
        {message[currentMessageIndex]}
      </span>
    </div>
  );
};

const MessageLoading = () => {
  return (
    <div className="flex flex-col group pb-4 px-2">
      <div className="flex items-center pl-2 gap-2 mb-2">
        <Image
          src="/logo.svg"
          alt="Volt"
          width={18}
          height={18}
          className="shrink-0 rotate-180"
        />
        <span className="text-base font-semibold">Volt</span>
      </div>
      <div className="flex flex-col pl-6.5 gap-y-4">
        <ShimmerMessage />
      </div>
    </div>
  );
};

export default MessageLoading;
