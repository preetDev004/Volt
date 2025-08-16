import { Inngest } from 'inngest';

// Create a client to send and receive events
export const inngest = new Inngest({
  id: 'volt',
  // Configure polling interval to reduce frequency
  pollingIntervalMs: 5000, // Poll every 5 seconds instead of default 1 second
});
