import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    // Add server-side environment variables here when needed
  },
  client: {
    NEXT_PUBLIC_PROJECT_ID: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
  },
});
