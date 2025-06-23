import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Videos } from '@/db/schema';
import { createId } from '@paralleldrive/cuid2';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  video: t.router({
    create: t.procedure
      .input(
        z.object({
          title: z.string().min(1, 'Title is required'),
          description: z.string().optional(),
          videoCommp: z.string().min(1, 'Video URL is required'),
          thumbnailCommp: z.string().min(1, 'Thumbnail URL is required'),
          authorAddress: z.string().min(1, 'Author address is required'),
          category: z.string().min(1, 'Category is required'),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const {
          title,
          description,
          videoCommp,
          thumbnailCommp,
          authorAddress,
          category,
        } = input;

        const [newVideo] = await ctx.db
          .insert(Videos)
          .values({
            id: createId(),
            title,
            description: description || '',
            videoCommp,
            thumbnailCommp,
            walletAddress: authorAddress,
            uploaded_at: new Date().toISOString(),
            category,
            // duration, likes, dislikes, and views have default values in the schema
          })
          .returning();

        return newVideo;
      }),
  }),
});

export type AppRouter = typeof appRouter;
