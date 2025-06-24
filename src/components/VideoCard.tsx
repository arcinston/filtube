'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { create as createBlockie } from 'ethereum-blockies';
import { formatDistanceToNow } from 'date-fns';
interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelAvatar: string;
  views: number;
  uploadedAt: Date;
  duration: string;
  mock: boolean;
}
const generateBlockie = (address: string) => {
  const canvas = createBlockie({
    seed: address.toLowerCase(),
    size: 8,
    scale: 4.5, // results in 36x36 px image
  });
  return canvas.toDataURL();
};
export function VideoCard({
  id,
  title,
  thumbnail,
  channelName,
  channelAvatar,
  views,
  uploadedAt,
  duration,
  mock,
}: VideoCardProps) {
  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (mock) {
    channelAvatar = generateBlockie(channelAvatar);
  }

  return (
    <Link href={`/watch/${id}`} className="block group">
      <Card className="overflow-hidden border-none shadow-none bg-transparent hover:bg-accent/50 transition-colors">
        <CardContent className="p-0">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={thumbnail}
              alt={title}
              // fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {duration}
            </div>
          </div>

          {/* Video info */}
          <div className="flex gap-3 mt-3">
            {/* Channel avatar */}
            <div className="flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-muted overflow-hidden">
                {channelAvatar ? (
                  <img
                    src={channelAvatar}
                    alt={channelName}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                    {channelName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Video details */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="font-medium text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>

              {/* Channel name */}
              <p className="text-sm text-muted-foreground mt-1 hover:text-foreground transition-colors">
                {channelName}
              </p>

              {/* Views and date */}
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <span>{formatViews(views)} views</span>
                <span className="mx-1">•</span>
                <span>
                  {formatDistanceToNow(uploadedAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
