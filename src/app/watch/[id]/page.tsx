'use client';

import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { RelatedVideoCard } from '@/components/RelatedVideoCard';
import { TipButton } from '@/components/TipButton';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Share, Download, Flag } from 'lucide-react';
import { create as createBlockie } from 'ethereum-blockies';
import { api } from '@/trpc/provider';

const truncateAddress = (address: string) => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const generateBlockie = (address: string) => {
  const canvas = createBlockie({
    seed: address.toLowerCase(),
    size: 8,
    scale: 5, // results in 40x40 px image
  });
  return canvas.toDataURL();
};

const relatedVideos = [
  {
    id: '2',
    title: 'Building Your First DApp on Filecoin Virtual Machine',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    channelName: 'Web3Academy',
    channelAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=36&h=36&fit=crop&crop=face',
    views: 87500,
    uploadedAt: new Date('2024-01-10'),
    duration: '25:18',
  },
  {
    id: '3',
    title: 'IPFS and Filecoin: A Perfect Match for Web3 Storage',
    thumbnail:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
    channelName: 'DecentralizedTech',
    channelAvatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=36&h=36&fit=crop&crop=face',
    views: 234000,
    uploadedAt: new Date('2024-01-08'),
    duration: '18:42',
  },
  {
    id: '4',
    title: 'Smart Contracts on Filecoin: Complete Tutorial',
    thumbnail:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop',
    channelName: 'BlockchainDev',
    channelAvatar:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=36&h=36&fit=crop&crop=face',
    views: 156000,
    uploadedAt: new Date('2024-01-05'),
    duration: '32:15',
  },
  {
    id: '5',
    title: "Filecoin Network Updates: What's New in 2024",
    thumbnail:
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=225&fit=crop',
    channelName: 'CryptoNews',
    channelAvatar:
      'https://images.unsplash.com/photo-1494790108755-2616b332c588?w=36&h=36&fit=crop&crop=face',
    views: 92000,
    uploadedAt: new Date('2024-01-03'),
    duration: '15:27',
  },
];

export default function WatchPage() {
  const params = useParams();
  const videoId = params.id as string;

  const { data: video, isLoading } = api.video.getById.useQuery(
    { id: videoId },
    {
      enabled: !!videoId,
    },
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto flex h-[calc(100vh-80px)] items-center justify-center px-4 py-6">
          <p>Loading video...</p>
        </main>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto flex h-[calc(100vh-80px)] items-center justify-center px-4 py-6">
          <p>Video not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <video
                className="w-full h-full"
                controls
                poster={`https://${video.walletAddress}.calibration.filcdn.io/${video.thumbnailCommp}`}
              >
                <source
                  src={`https://${video.walletAddress}.calibration.filcdn.io/${video.videoCommp}`}
                  type="video/mp4"
                />
                <track kind="captions" srcLang="en" label="English captions" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Title */}
            <h1 className="text-xl font-semibold mb-4 text-foreground">
              {video.title}
            </h1>

            {/* Video Stats and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{formatNumber(video.views ?? 0)} views</span>
                <span>•</span>
                <span>{formatDate(new Date(video.uploaded_at))}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-full bg-muted">
                  <Button variant="ghost" size="sm" className="rounded-l-full">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {formatNumber(video.likes ?? 0)}
                  </Button>
                  <div className="w-px h-6 bg-border" />
                  <Button variant="ghost" size="sm" className="rounded-r-full">
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    {formatNumber(video.dislikes ?? 0)}
                  </Button>
                </div>

                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>

                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                <Button variant="ghost" size="sm">
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Channel Info */}
            <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                  <img
                    src={generateBlockie(video.walletAddress)}
                    alt={video.walletAddress}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {truncateAddress(video.walletAddress)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(0)} subscribers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TipButton
                  channelName={video.walletAddress}
                  channelAvatar={generateBlockie(video.walletAddress)}
                />
                <Button>Subscribe</Button>
              </div>
            </div>

            {/* Video Description */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground whitespace-pre-line">
                {video.description}
              </div>
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-foreground">
              Related Videos
            </h2>
            <div className="space-y-2">
              {relatedVideos.map((relatedVideo) => (
                <RelatedVideoCard key={relatedVideo.id} {...relatedVideo} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
