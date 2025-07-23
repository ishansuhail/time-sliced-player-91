
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  videoUrl: string;
  startTime: number;
  endTime: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, startTime, endTime }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      video.currentTime = startTime;
      setDuration(video.duration);
      console.log(`Video loaded. Setting start time to: ${startTime}s`);
    };

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      setCurrentTime(current);
      
      // Pause when reaching end time
      if (current >= endTime) {
        video.pause();
        setIsPlaying(false);
        console.log(`Reached end time: ${endTime}s. Pausing video.`);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [startTime, endTime]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      // Reset to start time if we're at or past the end time
      if (video.currentTime >= endTime) {
        video.currentTime = startTime;
      }
      video.play();
    }
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.max(startTime, video.currentTime - 10);
    video.currentTime = newTime;
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.min(endTime, video.currentTime + 10);
    video.currentTime = newTime;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((currentTime - startTime) / (endTime - startTime)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto"
          preload="metadata"
        />
        
        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-white/30 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-200"
                style={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
              />
            </div>
            <div className="flex justify-between text-white text-sm mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(endTime - startTime)} (clip duration)</span>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={skipBackward}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="text-white hover:bg-white/20 h-12 w-12"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={skipForward}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Video Info */}
      <div className="p-4 bg-muted/10">
        <div className="text-sm text-muted-foreground">
          Playing from {formatTime(startTime)} to {formatTime(endTime)}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
