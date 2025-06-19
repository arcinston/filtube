'use client';

import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { RelatedVideoCard } from '@/components/RelatedVideoCard';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Share, Download, Flag } from 'lucide-react';
import Image from 'next/image';

// Mock data for demonstration
const mockVideoDetails = {
  '1': {
    id: '1',
    title: 'Introduction to Filecoin: The Future of Decentralized Storage',
    description:
      'Learn about Filecoin, a decentralized storage network that turns cloud storage into an algorithmic market. This comprehensive introduction covers the basics of how Filecoin works, its benefits over traditional storage solutions, and how you can get started with using the network.\n\nIn this video, we cover:\n- What is Filecoin and how it works\n- The difference between IPFS and Filecoin\n- Storage deals and retrieval\n- Getting started as a user\n- Future developments and roadmap\n\nTimestamps:\n0:00 Introduction\n2:15 What is Filecoin?\n5:30 How storage deals work\n8:45 IPFS vs Filecoin\n11:20 Getting started\n\nResources:\n- Filecoin.io\n- Filecoin documentation\n- IPFS.io',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    channelName: 'FilecoinFoundation',
    channelAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face',
    subscriberCount: 125000,
    views: 125000,
    likes: 8500,
    dislikes: 120,
    uploadedAt: new Date('2024-01-15'),
    duration: '12:34',
  },
  // Add more mock videos as needed
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

  // Get video details (in a real app, this would be fetched from an API)
  const video =
    mockVideoDetails[videoId as keyof typeof mockVideoDetails] ||
    mockVideoDetails['1'];

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
                poster="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=450&fit=crop"
              >
                <source src={video.videoUrl} type="video/mp4" />
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
                <span>{formatNumber(video.views)} views</span>
                <span>•</span>
                <span>{formatDate(video.uploadedAt)}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-full bg-muted">
                  <Button variant="ghost" size="sm" className="rounded-l-full">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {formatNumber(video.likes)}
                  </Button>
                  <div className="w-px h-6 bg-border" />
                  <Button variant="ghost" size="sm" className="rounded-r-full">
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    {formatNumber(video.dislikes)}
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
                  <Image
                    src={video.channelAvatar}
                    alt={video.channelName}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {video.channelName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(video.subscriberCount)} subscribers
                  </p>
                </div>
              </div>
              <Button>Subscribe</Button>
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
