import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';

import { appRouter } from '@/trpc/router';
import { createContext } from '@/trpc/context';

/**
 * This wraps the `appRouter` and creates a `fetch` compliant handler for it.
 */
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
