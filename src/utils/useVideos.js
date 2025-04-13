import { useState, useEffect } from "react";

// Custom hook to fetch video data from the backend API
const useVideos = () => {
  // State to hold the list of videos
  const [videos, setVideos] = useState([]);
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // State to store any error messages from the fetch operation
  const [error, setError] = useState(null);
  // useEffect hook runs once on component mount (empty dependency array)
  useEffect(() => {
    // Async function to fetch video data
    const fetchVideos = async () => {
      try {
        // Call the API endpoint to get videos
        const response = await fetch("https://youtube-backend-wjcl.onrender.com/api/videos");

        // If the response is not OK (e.g., status code is not 2xx), throw an error
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }

        // Parse the response JSON
        const data = await response.json();

        // Update the videos state with the fetched data
        setVideos(data);
      } catch (err) {
        // If an error occurs, save the error message in state
        setError(err.message);
      } finally {
        // Whether successful or failed, set loading to false
        setLoading(false);
      }
    };

    // Invoke the async function to fetch data
    fetchVideos();
  }, []); // Dependency array is empty, so this runs once on mount

  // Return the videos, loading status, and any error to the component that uses this hook
  return { videos, loading, error };
};

export default useVideos;
