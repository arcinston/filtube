'use client';

import { Header } from '@/components/Header';
import { VideoCard } from '@/components/VideoCard';

// Mock data for demonstration
const mockVideos = [
  {
    id: '1',
    title: 'Introduction to Filecoin: The Future of Decentralized Storage',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    channelName: 'FilecoinFoundation',
    channelAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face',
    views: 125000,
    uploadedAt: new Date('2024-01-15'),
    duration: '12:34',
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
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {mockVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </main>
    </div>
  );
}
