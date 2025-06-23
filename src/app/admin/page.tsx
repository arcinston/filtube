'use client';

import { useState, useId } from 'react';
import { toast } from 'sonner';

import { api } from '@/trpc/provider';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AdminPage() {
  // State for the user form
  const [walletAddress, setWalletAddress] = useState('');

  // State for the video form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoCommp, setVideoCommp] = useState('');
  const [thumbnailCommp, setThumbnailCommp] = useState('');
  const [authorAddress, setAuthorAddress] = useState('');
  const [category, setCategory] = useState('');

  // IDs for form elements
  const walletAddressId = useId();
  const titleId = useId();
  const descriptionId = useId();
  const videoCommpId = useId();
  const thumbnailCommpId = useId();
  const authorAddressId = useId();
  const categoryId = useId();

  // tRPC mutations
  const createUserMutation = api.user.create.useMutation({
    onSuccess: (data) => {
      toast.success('User created successfully!', {
        description: `Wallet Address: ${data.walletAddress}`,
      });
      setWalletAddress('');
    },
    onError: (error) => {
      toast.error('Failed to create user', {
        description: error.message,
      });
    },
  });

  const createVideoMutation = api.admin.createVideo.useMutation({
    onSuccess: (data) => {
      toast.success('Video created successfully!', {
        description: `Title: ${data.title}`,
      });
      // Reset video form fields
      setTitle('');
      setDescription('');
      setVideoCommp('');
      setThumbnailCommp('');
      setAuthorAddress('');
      setCategory('');
    },
    onError: (error) => {
      toast.error('Failed to create video', {
        description: error.message,
      });
    },
  });

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) {
      toast.error('Wallet address cannot be empty.');
      return;
    }
    createUserMutation.mutate({
      walletAddress: walletAddress.trim().toLowerCase(),
    });
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !title.trim() ||
      !videoCommp.trim() ||
      !thumbnailCommp.trim() ||
      !authorAddress.trim() ||
      !category.trim()
    ) {
      toast.error('Please fill out all required video fields.');
      return;
    }
    createVideoMutation.mutate({
      title,
      description,
      videoCommp,
      thumbnailCommp,
      authorAddress: authorAddress.trim().toLowerCase(),
      category,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Admin Panel</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Create User Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={walletAddressId}>Wallet Address</Label>
                  <Input
                    id={walletAddressId}
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createUserMutation.isPending}
                >
                  {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Create Video Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Create New Video</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVideoSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={titleId}>Title</Label>
                  <Input
                    id={titleId}
                    placeholder="Enter video title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={descriptionId}>Description</Label>
                  <Textarea
                    id={descriptionId}
                    placeholder="Tell viewers about your video"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={videoCommpId}>Video CommP</Label>
                    <Input
                      id={videoCommpId}
                      placeholder="baga..."
                      value={videoCommp}
                      onChange={(e) => setVideoCommp(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={thumbnailCommpId}>Thumbnail CommP</Label>
                    <Input
                      id={thumbnailCommpId}
                      placeholder="baga..."
                      value={thumbnailCommp}
                      onChange={(e) => setThumbnailCommp(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={authorAddressId}>
                      Author Wallet Address
                    </Label>
                    <Input
                      id={authorAddressId}
                      placeholder="0x..."
                      value={authorAddress}
                      onChange={(e) => setAuthorAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={categoryId}>Category</Label>
                    <select
                      id={categoryId}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="blockchain">Blockchain</option>
                      <option value="web3">Web3</option>
                      <option value="defi">DeFi</option>
                      <option value="nft">NFT</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="gaming">Gaming</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="education">Education</option>
                      <option value="technology">Technology</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createVideoMutation.isPending}
                >
                  {createVideoMutation.isPending
                    ? 'Creating...'
                    : 'Create Video'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
