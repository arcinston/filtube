import { relations } from 'drizzle-orm';
import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core';

export const Users = sqliteTable('users', {
  walletAddress: text('walletAddress').notNull().primaryKey(),
});

export const Videos = sqliteTable('videos', {
  id: text('id').notNull().primaryKey(),
  title: text('title').notNull(),
  duration: int('duration').default(0),
  description: text('description').notNull(),
  likes: int('likes').default(0),
  dislikes: int('dislikes').default(0),
  uploaded_at: text('uploaded_at').notNull(),
  views: int('views').default(0),
  walletAddress: text('walletAddress')
    .notNull()
    .references(() => Users.walletAddress, { onDelete: 'cascade' }),
  videoCommp: text('videoCommp').notNull(),
  thumbnailCommp: text('thumbnailCommp').notNull(),
  category: text('category').notNull(),
});

export const UsersRelations = relations(Users, ({ many }) => ({
  videos: many(Videos),
}));

export const VideosRelations = relations(Videos, ({ one }) => ({
  user: one(Users, {
    fields: [Videos.walletAddress],
    references: [Users.walletAddress],
  }),
}));
