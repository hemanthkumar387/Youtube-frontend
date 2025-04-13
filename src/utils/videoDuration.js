// Utility function to get the duration of a video from its URL
export const getVideoDuration = (url) => {
  return new Promise((resolve, reject) => {
    // Create a video element in memory
    const video = document.createElement("video");
    // Preload only metadata to get duration without downloading the whole video
    video.preload = "metadata";
    // Set the video source to the provided URL
    video.src = url;
    // When metadata is loaded (including duration), resolve the promise with the duration
    video.onloadedmetadata = () => {
      resolve(video.duration); // duration is in seconds
    };
    // If there's an error loading the video metadata, reject the promise
    video.onerror = () => {
      reject("Could not load video metadata");
    };
  });
};

// Utility function to convert duration in seconds to a mm:ss format string
export const formatDuration = (seconds) => {
  // Get the full minutes
  const mins = Math.floor(seconds / 60);
  // Get the remaining seconds and ensure it’s always 2 digits (e.g., "03")
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  // Return the formatted duration string
  return `${mins}:${secs}`;
};
