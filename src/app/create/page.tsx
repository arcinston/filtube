'use client';

import { useState, useId, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletStats } from '@/components/WalletStats';
import { VideoLibrary } from '@/components/VideoLibrary';
import { useFileUpload, type UploadedInfo } from '@/hooks/useFileUpload';
import {
  Upload,
  X,
  Play,
  Image as ImageIcon,
  BarChart3,
  Library,
} from 'lucide-react';

interface UploadState {
  uploading: boolean;
  completed?: boolean;
  error?: boolean;
  info?: UploadedInfo;
}

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
  const [videoUploadInfo, setVideoUploadInfo] = useState<UploadState | null>(
    null,
  );
  const [thumbnailUploadInfo, setThumbnailUploadInfo] =
    useState<UploadState | null>(null);
  const [videoDragActive, setVideoDragActive] = useState(false);
  const [thumbnailDragActive, setThumbnailDragActive] = useState(false);

  const {
    uploadFileMutation: videoUploadMutation,
    progress: videoProgress,
    uploadedInfo: videoUploadedInfo,
    handleReset: handleVideoReset,
    status: videoStatus,
  } = useFileUpload();

  const {
    uploadFileMutation: thumbnailUploadMutation,
    progress: thumbnailProgress,
    uploadedInfo: thumbnailUploadedInfo,
    handleReset: handleThumbnailReset,
    status: thumbnailStatus,
  } = useFileUpload();

  // Capture videoUploadedInfo when video upload completes
  useEffect(() => {
    if (videoUploadedInfo && videoUploadMutation.isSuccess) {
      setVideoUploadInfo({
        uploading: false,
        completed: true,
        info: videoUploadedInfo,
      });
    }
  }, [videoUploadedInfo, videoUploadMutation.isSuccess]);

  // Capture thumbnailUploadedInfo when thumbnail upload completes
  useEffect(() => {
    if (thumbnailUploadedInfo && thumbnailUploadMutation.isSuccess) {
      setThumbnailUploadInfo({
        uploading: false,
        completed: true,
        info: thumbnailUploadedInfo,
      });
    }
  }, [thumbnailUploadedInfo, thumbnailUploadMutation.isSuccess]);

  const videoUploadId = useId();
  const thumbnailUploadId = useId();
  const titleId = useId();
  const descriptionId = useId();
  const categoryId = useId();

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 1024) {
        // 1GB limit
        alert('Video file must be smaller than 1GB');
        return;
      }
      await handleVideoFile(file);
    }
  };

  const handleThumbnailUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit for images
        alert('Image file must be smaller than 10MB');
        return;
      }
      await handleThumbnailFile(file);
    }
  };

  const handleVideoFile = async (file: File) => {
    setMetadata((prev) => ({ ...prev, video: file }));
    const videoUrl = URL.createObjectURL(file);
    setVideoPreview(videoUrl);

    // Upload to Filecoin
    setVideoUploadInfo({ uploading: true });
    handleVideoReset();
    try {
      await videoUploadMutation.mutateAsync(file);
      // videoUploadedInfo will be captured in useEffect
    } catch (error) {
      console.error('Video upload failed:', error);
      setVideoUploadInfo({ uploading: false, error: true });
    }
  };

  const handleThumbnailFile = async (file: File) => {
    setMetadata((prev) => ({ ...prev, thumbnail: file }));
    const imageUrl = URL.createObjectURL(file);
    setThumbnailPreview(imageUrl);

    // Upload to Filecoin
    setThumbnailUploadInfo({ uploading: true });
    handleThumbnailReset();
    try {
      await thumbnailUploadMutation.mutateAsync(file);
      // thumbnailUploadedInfo will be captured in useEffect
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      setThumbnailUploadInfo({ uploading: false, error: true });
    }
  };

  const handleVideoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVideoDragActive(true);
  };

  const handleVideoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVideoDragActive(false);
  };

  const handleVideoDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVideoDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find((file) => file.type.startsWith('video/'));

    if (!videoFile) {
      alert('Please drop a valid video file (MP4, WebM, or MOV)');
      return;
    }

    if (videoFile.size > 1024 * 1024 * 1024) {
      // 1GB limit
      alert('Video file must be smaller than 1GB');
      return;
    }

    if (!videoUploadMutation.isPending) {
      await handleVideoFile(videoFile);
    }
  };

  const handleThumbnailDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setThumbnailDragActive(true);
  };

  const handleThumbnailDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setThumbnailDragActive(false);
  };

  const handleThumbnailDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setThumbnailDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));

    if (!imageFile) {
      alert('Please drop a valid image file (JPG, PNG, or GIF)');
      return;
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      // 10MB limit for images
      alert('Image file must be smaller than 10MB');
      return;
    }

    if (!thumbnailUploadMutation.isPending) {
      await handleThumbnailFile(imageFile);
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

    try {
      // Check if video file exists and has been uploaded
      if (!metadata.video) {
        alert('Please select a video file');
        return;
      }

      if (videoUploadInfo?.uploading || videoUploadMutation.isPending) {
        alert('Please wait for file upload to complete');
        return;
      }

      if (!videoUploadInfo?.completed) {
        alert('Please upload video to Filecoin first');
        return;
      }

      // In a real implementation, you would:
      // 1. Store metadata on blockchain with CommP references
      // 2. Navigate to the video page

      const videoData = {
        title: metadata.title,
        description: metadata.description,
        category: metadata.category,
        tags: metadata.tags,
        videoCommP: videoUploadInfo?.info?.commp,
        thumbnailCommP: thumbnailUploadInfo?.info?.commp,
        videoUploadInfo: videoUploadInfo,
        thumbnailUploadInfo: thumbnailUploadInfo,
      };

      console.log('Submitting video data:', videoData);
      alert('Video metadata prepared for blockchain storage!');
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Submit failed. Please try again.');
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
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 aspect-video transition-colors cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
                            videoDragActive
                              ? 'border-primary bg-primary/5'
                              : 'border-muted-foreground/25'
                          }`}
                          onDragOver={handleVideoDragOver}
                          onDragLeave={handleVideoDragLeave}
                          onDrop={handleVideoDrop}
                          role="button"
                          tabIndex={0}
                          aria-label="Upload video file by clicking or dragging and dropping"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              document.getElementById(videoUploadId)?.click();
                            }
                          }}
                        >
                          <div className="text-center h-full flex flex-col justify-center">
                            <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                            <div className="mt-2">
                              <Label
                                htmlFor={videoUploadId}
                                className="cursor-pointer"
                              >
                                <span className="text-sm font-medium text-primary hover:text-primary/80">
                                  Click to upload video or drag and drop
                                </span>
                                <Input
                                  id={videoUploadId}
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={handleVideoUpload}
                                  disabled={videoUploadMutation.isPending}
                                />
                              </Label>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Drag and drop or click to upload
                              </p>
                              <p className="text-xs text-muted-foreground">
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
                              setMetadata((prev) => ({
                                ...prev,
                                video: null,
                              }));
                              setVideoUploadInfo(null);
                              handleVideoReset();
                            }}
                            disabled={videoUploadInfo?.uploading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          {videoUploadInfo?.completed && (
                            <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                              ✓ Stored on Filecoin
                            </div>
                          )}
                        </div>
                      )}

                      {/* Upload Progress for Video */}
                      {videoUploadInfo?.uploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Uploading video to Filecoin...</span>
                            <span>{videoProgress}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${videoProgress}%` }}
                            />
                          </div>
                          {videoStatus && (
                            <p className="text-xs text-muted-foreground">
                              {videoStatus}
                            </p>
                          )}
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
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 aspect-video transition-colors cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
                            thumbnailDragActive
                              ? 'border-primary bg-primary/5'
                              : 'border-muted-foreground/25'
                          }`}
                          onDragOver={handleThumbnailDragOver}
                          onDragLeave={handleThumbnailDragLeave}
                          onDrop={handleThumbnailDrop}
                          role="button"
                          tabIndex={0}
                          aria-label="Upload thumbnail image by clicking or dragging and dropping"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              document
                                .getElementById(thumbnailUploadId)
                                ?.click();
                            }
                          }}
                        >
                          <div className="text-center h-full flex flex-col justify-center">
                            <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                            <div className="mt-2">
                              <Label
                                htmlFor={thumbnailUploadId}
                                className="cursor-pointer"
                              >
                                <span className="text-sm font-medium text-primary hover:text-primary/80">
                                  Upload thumbnail or drag and drop
                                </span>
                                <Input
                                  id={thumbnailUploadId}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleThumbnailUpload}
                                  disabled={thumbnailUploadMutation.isPending}
                                />
                              </Label>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Drag and drop or click to upload
                              </p>
                              <p className="text-xs text-muted-foreground">
                                JPG, PNG, or GIF (MAX. 10MB, 16:9 ratio
                                recommended)
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
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
                              setThumbnailUploadInfo(null);
                              handleThumbnailReset();
                            }}
                            disabled={thumbnailUploadInfo?.uploading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          {thumbnailUploadInfo?.completed && (
                            <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                              ✓ Stored on Filecoin
                            </div>
                          )}
                        </div>
                      )}

                      {/* Upload Progress for Thumbnail */}
                      {thumbnailUploadInfo?.uploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Uploading thumbnail to Filecoin...</span>
                            <span>{thumbnailProgress}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${thumbnailProgress}%` }}
                            />
                          </div>
                          {thumbnailStatus && (
                            <p className="text-xs text-muted-foreground">
                              {thumbnailStatus}
                            </p>
                          )}
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
                  disabled={
                    !metadata.video ||
                    !metadata.title ||
                    videoUploadInfo?.uploading ||
                    !videoUploadInfo?.completed
                  }
                  className="min-w-[120px]"
                >
                  {videoUploadInfo?.uploading
                    ? 'Uploading...'
                    : 'Publish Video'}
                </Button>
              </div>
            </form>

            {/* Upload Status Display */}
            {(videoUploadInfo?.completed || thumbnailUploadInfo?.completed) && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Upload Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {videoUploadInfo?.completed && (
                      <div>
                        <h4 className="font-semibold mb-2">Video Upload</h4>
                        <div className="space-y-1 text-sm">
                          {videoUploadInfo.info?.fileName && (
                            <p>
                              <strong>File:</strong>{' '}
                              {videoUploadInfo.info.fileName}
                            </p>
                          )}
                          {videoUploadInfo.info?.fileSize && (
                            <p>
                              <strong>Size:</strong>{' '}
                              {(
                                videoUploadInfo.info.fileSize /
                                1024 /
                                1024
                              ).toFixed(2)}{' '}
                              MB
                            </p>
                          )}
                          {videoUploadInfo.info?.commp && (
                            <p>
                              <strong>CommP:</strong>{' '}
                              <code className="text-xs">
                                {videoUploadInfo.info.commp}
                              </code>
                            </p>
                          )}
                          {videoUploadInfo.info?.txHash && (
                            <p>
                              <strong>Transaction:</strong>{' '}
                              <code className="text-xs">
                                {videoUploadInfo.info.txHash}
                              </code>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {thumbnailUploadInfo?.completed && (
                      <div>
                        <h4 className="font-semibold mb-2">Thumbnail Upload</h4>
                        <div className="space-y-1 text-sm">
                          {thumbnailUploadInfo.info?.fileName && (
                            <p>
                              <strong>File:</strong>{' '}
                              {thumbnailUploadInfo.info.fileName}
                            </p>
                          )}
                          {thumbnailUploadInfo.info?.fileSize && (
                            <p>
                              <strong>Size:</strong>{' '}
                              {(
                                thumbnailUploadInfo.info.fileSize /
                                1024 /
                                1024
                              ).toFixed(2)}{' '}
                              MB
                            </p>
                          )}
                          {thumbnailUploadInfo.info?.commp && (
                            <p>
                              <strong>CommP:</strong>{' '}
                              <code className="text-xs">
                                {thumbnailUploadInfo.info.commp}
                              </code>
                            </p>
                          )}
                          {thumbnailUploadInfo.info?.txHash && (
                            <p>
                              <strong>Transaction:</strong>{' '}
                              <code className="text-xs">
                                {thumbnailUploadInfo.info.txHash}
                              </code>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="library" className="mt-6">
            <VideoLibrary />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
