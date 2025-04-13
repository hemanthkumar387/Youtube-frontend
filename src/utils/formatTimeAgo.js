// Exporting a function that returns a human-readable time difference between now and the given upload time
export default function formatTimeAgo(uploadTime) {
  // Get the current date and time
  const now = new Date();
  // Convert the provided upload time into a Date object
  const uploaded = new Date(uploadTime);
  // Calculate the difference in milliseconds
  const diff = now - uploaded;
  // Convert the time difference into days
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  // Approximate months and years from days
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Return appropriate string based on how long ago the video was uploaded
  if (days === 0) return "Today";                  // Uploaded today
  if (days === 1) return "1 day ago";              // Uploaded yesterday
  if (days < 30) return `${days} days ago`;        // Uploaded within the last 30 days
  if (months === 1) return "1 month ago";          // About one month ago
  if (months < 12) return `${months} months ago`;  // Less than a year ago
  if (years === 1) return "1 year ago";            // One year ago
  return `${years} years ago`;                     // More than a year ago
}
