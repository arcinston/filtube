'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoCard } from '@/components/VideoCard';
import { Video, Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface VideoLibraryProps {
  className?: string;
}

export function VideoLibrary({ className }: VideoLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // Mock data for user's uploaded videos
  const userVideos = [
    {
      id: 'user-1',
      title: 'My First Filecoin Tutorial',
      thumbnail:
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop',
      channelName: 'Your Channel',
      channelAvatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face',
      views: 1250,
      uploadedAt: new Date('2024-01-20'),
      duration: '15:32',
      status: 'published',
      storageSize: '245 MB',
    },
    {
      id: 'user-2',
      title: 'Web3 Storage Deep Dive',
      thumbnail:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      channelName: 'Your Channel',
      channelAvatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face',
      views: 3400,
      uploadedAt: new Date('2024-01-18'),
      duration: '28:15',
      status: 'published',
      storageSize: '512 MB',
    },
    {
      id: 'user-3',
      title: 'IPFS vs Traditional Storage',
      thumbnail:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
      channelName: 'Your Channel',
      channelAvatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face',
      views: 890,
      uploadedAt: new Date('2024-01-15'),
      duration: '12:45',
      status: 'draft',
      storageSize: '178 MB',
    },
  ];

  const filteredVideos = userVideos.filter((video) => {
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === 'all' || video.status === filterBy;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'draft':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'processing':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Video Library
            </CardTitle>
            <Button asChild>
              <a href="/create">
                <Plus className="w-4 h-4 mr-2" />
                Upload New Video
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search your videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
              >
                <option value="all">All Videos</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="processing">Processing</option>
              </select>
            </div>
          </div>

          {/* Videos Grid */}
          {filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <Video className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                {searchQuery || filterBy !== 'all'
                  ? 'No videos found'
                  : 'No videos uploaded yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterBy !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start building your video library by uploading your first video.'}
              </p>
              <Button asChild>
                <a href="/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Your First Video
                </a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVideos.map((video) => (
                <div key={video.id} className="relative">
                  <VideoCard {...video} />
                  {/* Status and Storage Info Overlay */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(video.status)}`}
                    >
                      {video.status.charAt(0).toUpperCase() +
                        video.status.slice(1)}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/70 text-white">
                      {video.storageSize}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          {filteredVideos.length > 0 && (
            <div className="mt-8 p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {userVideos.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Videos
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {userVideos.filter((v) => v.status === 'published').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Published</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {userVideos
                      .reduce((sum, v) => sum + v.views, 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Views
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    935 MB
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Storage Used
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
