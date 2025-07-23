
export interface VideoParams {
  videoUrl: string | null;
  startTime: number;
  endTime: number;
}

export const parseVideoParams = (): VideoParams => {
  const urlParams = new URLSearchParams(window.location.search);
  
  const videoUrl = urlParams.get('video_url');
  const startTimeParam = urlParams.get('startTime');
  const endTimeParam = urlParams.get('endTime');
  
  const startTime = startTimeParam ? parseInt(startTimeParam, 10) : 0;
  const endTime = endTimeParam ? parseInt(endTimeParam, 10) : 60; // Default 60 seconds if not specified
  
  console.log('Parsed URL parameters:', {
    videoUrl,
    startTime,
    endTime
  });
  
  return {
    videoUrl,
    startTime: Math.max(0, startTime), // Ensure non-negative
    endTime: Math.max(startTime + 1, endTime) // Ensure end time is after start time
  };
};
