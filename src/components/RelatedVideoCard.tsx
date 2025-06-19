'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface RelatedVideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  views: number;
  uploadedAt: Date;
  duration: string;
}

export function RelatedVideoCard({
  id,
  title,
  thumbnail,
  channelName,
  views,
  uploadedAt,
  duration,
}: RelatedVideoCardProps) {
  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Link href={`/watch/${id}`} className="block group">
      <div className="flex gap-2 hover:bg-accent/50 transition-colors rounded-lg p-2">
        {/* Thumbnail */}
        <div className="relative w-40 aspect-video bg-muted rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {/* Duration badge */}
          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded text-[10px]">
            {duration}
          </div>
        </div>

        {/* Video info */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-medium text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors mb-1">
            {title}
          </h3>

          {/* Channel name */}
          <p className="text-xs text-muted-foreground mb-1">{channelName}</p>

          {/* Views and date */}
          <div className="flex flex-col text-xs text-muted-foreground">
            <span>{formatViews(views)} views</span>
            <span>{formatDistanceToNow(uploadedAt, { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
