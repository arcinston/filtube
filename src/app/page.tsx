'use client';

import { useMemo } from 'react';
import { create as createBlockie } from 'ethereum-blockies';
import { Header } from '@/components/Header';
import { VideoCard } from '@/components/VideoCard';
import { api } from '@/trpc/provider';

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds,
  ).padStart(2, '0')}`;
};

const truncateAddress = (address: string) => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const generateBlockie = (address: string) => {
  const canvas = createBlockie({
    seed: address.toLowerCase(),
    size: 8,
    scale: 4.5, // results in 36x36 px image
  });
  return canvas.toDataURL();
};
type TVideoData = {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelAvatar: string;
  views: number;
  uploadedAt: Date;
  duration: string;
  mock: boolean;
};

// Mock data for demonstration
const mockVideos: TVideoData[] = [
  {
    id: '1',
    title: 'Introduction to Filecoin: The Future of Decentralized Storage',
    thumbnail:
      'https://0xd77628a11b280f6b23bea5d7dc2d357f0348c741.calibration.filcdn.io/baga6ea4seaqdppvb7wymkur3ajm7akbu3tujryiyf5pn3kze725hlj3ekiehymi',
    channelName: 'FilecoinFoundation',
    channelAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face',
    views: 125000,
    uploadedAt: new Date('2024-01-15'),
    duration: '12:34',
    mock: false,
  },
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
    mock: false,
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
    mock: false,
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
    mock: false,
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
    mock: false,
  },
  {
    id: '6',
    title: 'Storing NFTs on Filecoin: Best Practices',
    thumbnail:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=225&fit=crop',
    channelName: 'NFTGuru',
    channelAvatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=36&h=36&fit=crop&crop=face',
    views: 78000,
    uploadedAt: new Date('2024-01-01'),
    duration: '22:08',
    mock: false,
  },
  {
    id: '7',
    title: 'Filecoin Mining: Complete Setup Guide',
    thumbnail:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=225&fit=crop',
    channelName: 'MiningMaster',
    channelAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face',
    views: 345000,
    uploadedAt: new Date('2023-12-28'),
    duration: '45:33',
    mock: false,
  },
  {
    id: '8',
    title: 'Web3 Storage Solutions: Comparing Filecoin vs Competitors',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    channelName: 'TechComparison',
    channelAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=36&h=36&fit=crop&crop=face',
    views: 198000,
    uploadedAt: new Date('2023-12-25'),
    duration: '28:15',
    mock: false,
  },
  {
    id: '9',
    title: 'Building a Decentralized Video Platform with Filecoin',
    thumbnail:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
    channelName: 'DevTutorials',
    channelAvatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=36&h=36&fit=crop&crop=face',
    views: 167000,
    uploadedAt: new Date('2023-12-22'),
    duration: '38:47',
    mock: false,
  },
  {
    id: '10',
    title: 'Filecoin Ecosystem Overview: Projects and Opportunities',
    thumbnail:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop',
    channelName: 'EcosystemWatch',
    channelAvatar:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=36&h=36&fit=crop&crop=face',
    views: 134000,
    uploadedAt: new Date('2023-12-20'),
    duration: '35:12',
    mock: false,
  },
  {
    id: '11',
    title: 'Filecoin Token Economics Explained',
    thumbnail:
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=225&fit=crop',
    channelName: 'TokenomicsExplained',
    channelAvatar:
      'https://images.unsplash.com/photo-1494790108755-2616b332c588?w=36&h=36&fit=crop&crop=face',
    views: 89000,
    uploadedAt: new Date('2023-12-18'),
    duration: '19:25',
    mock: false,
  },
  {
    id: '12',
    title: 'Getting Started with Lotus Node on Filecoin',
    thumbnail:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=225&fit=crop',
    channelName: 'NodeOperators',
    channelAvatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=36&h=36&fit=crop&crop=face',
    views: 112000,
    uploadedAt: new Date('2023-12-15'),
    duration: '41:18',
    mock: false,
  },
];

export default function Home() {
  const { data: dbVideos, isLoading } = api.video.getAll.useQuery();

  const videos = useMemo(() => {
    const fromDb =
      dbVideos?.map((video) => ({
        id: video.id,
        title: video.title,
        thumbnail: `https://${video.walletAddress}.calibration.filcdn.io/${video.thumbnailCommp}`,
        channelName: truncateAddress(video.walletAddress),
        channelAvatar: generateBlockie(video.walletAddress),
        views: video.views ?? 0,
        uploadedAt: new Date(video.uploaded_at),
        duration: formatDuration(video.duration ?? 0),
        mock: true,
      })) ?? [];

    return [...fromDb, ...mockVideos];
  }, [dbVideos]);
  console.log(videos);
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center">Loading videos...</div>
          ) : (
            videos.map((video) => <VideoCard key={video.id} {...video} />)
          )}
        </div>
      </main>
    </div>
  );
}
