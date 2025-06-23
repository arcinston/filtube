import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';
import { Users, Videos } from '@/db/schema';
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
          videoCommp: z.string().min(1, 'Video is required'),
          thumbnailCommp: z.string().min(1, 'Thumbnail  is required'),
          authorAddress: z
            .string()
            .min(1, 'Author address is required')
            .toLowerCase(),
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

        // Check if user exists, if not create one
        const user = await ctx.db.query.Users.findFirst({
          where: eq(Users.walletAddress, authorAddress),
        });

        if (!user) {
          await ctx.db.insert(Users).values({
            walletAddress: authorAddress,
          });
        }

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
          })
          .returning();

        return newVideo;
      }),
    getAll: t.procedure.query(async ({ ctx }) => {
      return ctx.db.query.Videos.findMany({
        orderBy: [desc(Videos.uploaded_at)],
      });
    }),
    getById: t.procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return ctx.db.query.Videos.findFirst({
          where: eq(Videos.id, input.id),
        });
      }),
  }),
  user: t.router({
    create: t.procedure
      .input(
        z.object({
          walletAddress: z
            .string()
            .min(1, 'Wallet address is required')
            .toLowerCase(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { walletAddress } = input;
        const [newUser] = await ctx.db
          .insert(Users)
          .values({
            walletAddress,
          })
          .returning();
        return newUser;
      }),
  }),
  admin: t.router({
    createVideo: t.procedure
      .input(
        z.object({
          title: z.string().min(1, 'Title is required'),
          description: z.string().optional(),
          videoCommp: z.string().min(1, 'Video CommP is required'),
          thumbnailCommp: z.string().min(1, 'Thumbnail CommP is required'),
          authorAddress: z
            .string()
            .min(1, 'Author address is required')
            .toLowerCase(),
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
          })
          .returning();

        return newVideo;
      }),
  }),
});

export type AppRouter = typeof appRouter;
