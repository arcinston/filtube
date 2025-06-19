'use client';

import { useState, useId } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletStats } from '@/components/WalletStats';
import { VideoLibrary } from '@/components/VideoLibrary';
import {
  Upload,
  X,
  Play,
  Image as ImageIcon,
  BarChart3,
  Library,
} from 'lucide-react';
import Image from 'next/image';

interface VideoMetadata {
  title: string;
  description: string;
  thumbnail: File | null;
  video: File | null;
  category: string;
  tags: string[];
}

export default function CreatePage() {
  const [metadata, setMetadata] = useState<VideoMetadata>({
    title: '',
    description: '',
    thumbnail: null,
    video: null,
    category: '',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const videoUploadId = useId();
  const thumbnailUploadId = useId();
  const titleId = useId();
  const descriptionId = useId();
  const categoryId = useId();

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMetadata((prev) => ({ ...prev, video: file }));
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    }
  };

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setMetadata((prev) => ({ ...prev, thumbnail: file }));
      const imageUrl = URL.createObjectURL(file);
      setThumbnailPreview(imageUrl);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      setMetadata((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMetadata((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUploading(true);

    try {
      // Here you would implement the actual upload logic
      // For now, we'll just simulate an upload
      // TODO: Implement actual upload to IPFS/Filecoin

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, you would:
      // 1. Upload video to IPFS/Filecoin
      // 2. Upload thumbnail to IPFS/Filecoin
      // 3. Store metadata on blockchain
      // 4. Navigate to the video page

      alert('Video uploaded successfully!');
    } catch (_error) {
      // TODO: Implement proper error handling and logging
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Creator Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your content, monitor your wallet, and track your uploads.
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Library className="w-4 h-4" />
              Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-6">
            <WalletStats />
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Upload Video
              </h2>
              <p className="text-muted-foreground">
                Share your content with the FilTube community. Upload your video
                and add details to help viewers discover it.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Video Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Video File
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {!videoPreview ? (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <div className="mt-4">
                              <Label
                                htmlFor={videoUploadId}
                                className="cursor-pointer"
                              >
                                <span className="text-sm font-medium text-primary hover:text-primary/80">
                                  Click to upload video
                                </span>
                                <Input
                                  id={videoUploadId}
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={handleVideoUpload}
                                />
                              </Label>
                              <p className="mt-1 text-xs text-muted-foreground">
                                MP4, WebM, or MOV (MAX. 1GB)
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <video
                            src={videoPreview}
                            controls
                            className="w-full aspect-video rounded-lg bg-black"
                          >
                            <track
                              kind="captions"
                              srcLang="en"
                              label="English captions"
                            />
                          </video>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setVideoPreview(null);
                              setMetadata((prev) => ({ ...prev, video: null }));
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Thumbnail Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Thumbnail
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {!thumbnailPreview ? (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 aspect-video">
                          <div className="text-center h-full flex flex-col justify-center">
                            <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                            <div className="mt-2">
                              <Label
                                htmlFor={thumbnailUploadId}
                                className="cursor-pointer"
                              >
                                <span className="text-sm font-medium text-primary hover:text-primary/80">
                                  Upload thumbnail
                                </span>
                                <Input
                                  id={thumbnailUploadId}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleThumbnailUpload}
                                />
                              </Label>
                              <p className="mt-1 text-xs text-muted-foreground">
                                JPG, PNG, or GIF (16:9 ratio recommended)
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <Image
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            width={400}
                            height={225}
                            className="w-full aspect-video object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setThumbnailPreview(null);
                              setMetadata((prev) => ({
                                ...prev,
                                thumbnail: null,
                              }));
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Video Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Video Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor={titleId}>Title</Label>
                    <Input
                      id={titleId}
                      placeholder="Enter video title"
                      value={metadata.title}
                      onChange={(e) =>
                        setMetadata((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor={descriptionId}>Description</Label>
                    <Textarea
                      id={descriptionId}
                      placeholder="Tell viewers about your video"
                      value={metadata.description}
                      onChange={(e) =>
                        setMetadata((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor={categoryId}>Category</Label>
                    <select
                      id={categoryId}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={metadata.category}
                      onChange={(e) =>
                        setMetadata((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
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

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    {metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {metadata.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                          >
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-secondary-foreground/20"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  disabled={!metadata.video || !metadata.title || isUploading}
                  className="min-w-[120px]"
                >
                  {isUploading ? 'Uploading...' : 'Publish Video'}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="library" className="mt-6">
            <VideoLibrary />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
