import { db } from '@/db';

/**
 * Creates context for an incoming request.
 *
 * This is the place to add things that are needed in every single procedure,
 * like database connections, authentication information, etc.
 *
 * @see https://trpc.io/docs/v11/server/context
 */
export async function createContext() {
  return {
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
