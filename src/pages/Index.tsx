
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import VideoPlayer from '@/components/VideoPlayer';
import ErrorState from '@/components/ErrorState';
import { parseVideoParams } from '@/utils/urlParams';

const Index = () => {
  const [videoParams, setVideoParams] = useState(() => parseVideoParams());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for URL changes (in case user modifies URL)
    const handlePopState = () => {
      setVideoParams(parseVideoParams());
      setError(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleRetry = () => {
    setVideoParams(parseVideoParams());
    setError(null);
  };

  // Handle case where no video URL is provided
  if (!videoParams.videoUrl) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ErrorState
            title="No Video URL Provided"
            message="Please provide a video URL in the query parameters. Example: ?video_url=your-video-url.mp4&startTime=30&endTime=45"
            onRetry={handleRetry}
          />
          <div className="mt-8 p-6 bg-muted/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">How to use this video player:</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Required:</strong> video_url - The URL of the video to play</p>
              <p><strong>Optional:</strong> startTime - Start time in seconds (default: 0)</p>
              <p><strong>Optional:</strong> endTime - End time in seconds (default: 60)</p>
              <p className="mt-4 font-mono text-xs bg-muted p-2 rounded">
                Example: ?video_url=https://example.com/video.mp4&startTime=30&endTime=45
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Validate time parameters
  if (videoParams.startTime >= videoParams.endTime) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ErrorState
            title="Invalid Time Parameters"
            message="Start time must be less than end time. Please check your URL parameters."
            onRetry={handleRetry}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <VideoPlayer
            videoUrl={videoParams.videoUrl}
            startTime={videoParams.startTime}
            endTime={videoParams.endTime}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
