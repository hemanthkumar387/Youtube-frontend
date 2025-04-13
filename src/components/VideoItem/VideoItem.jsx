import { useState, useEffect } from "react";
import "./VideoItem.css";
import VideoModal from "../VideoModal/VideoModal";
import useVideos from "../../utils/useVideos";
import Category from "../Category/Category";
import { getVideoDuration, formatDuration } from "../../utils/videoDuration";
import { useNavigate, useOutletContext } from "react-router-dom";
import formatTimeAgo from "../../utils/formatTimeAgo";
import sampleImage from '../../assets/avatar-profile.png';
import ReactPlayer from 'react-player';

const VideoGrid = () => {
    // State to track which video (if any) is active in the modal
    const [activeVideo, setActiveVideo] = useState(null);
    // Fetch videos, loading status, and error state using custom hook
    const { videos, loading, error } = useVideos();
    // Stores the pre-fetched durations of each video
    const [durations, setDurations] = useState({});
    // State for tracking which video is currently hovered (to autoplay)
    const [hoveredVideo, setHoveredVideo] = useState(null);
    // Selected category from category filter
    const [selectedCategory, setSelectedCategory] = useState("All");
    // Navigation hook for routing to video detail page
    const navigate = useNavigate();
    // Get the search term from parent context (likely App layout)
    const { searchTerm } = useOutletContext();

    // Fetch and store video durations when video list updates
    useEffect(() => {
        const loadDurations = async () => {
            const newDurations = {};
            await Promise.all(
                videos.map(async (video) => {
                    try {
                        // Use utility to fetch actual duration of the video
                        const duration = await getVideoDuration(video.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4");
                        newDurations[video._id] = formatDuration(duration);
                    } catch {
                        newDurations[video._id] = "0:00"; // Fallback duration
                    }
                })
            );
            setDurations(newDurations); // Update state with formatted durations
        };

        if (videos.length > 0) loadDurations();
    }, [videos]);

    // Show loading or error messages
    if (loading) return <p>Loading videos...</p>;
    if (error) return <p>Error: {error}</p>;

    // Filter videos based on search term and selected category
    const filteredVideos = videos.filter((video) => {
        const matchesSearch = video.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" || video.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            {/* Category filter UI */}
            <Category
                videos={videos}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* Grid display of filtered video items */}
            <div className="video-grid">
                {filteredVideos.length > 0 ? (
                    filteredVideos.map((video) => (
                        <div
                            key={video._id}
                            className="video-card"
                            onClick={() => navigate(`/video/${video._id}`)} // Navigate to detail
                            onMouseEnter={() => setHoveredVideo(video._id)} // Hover effect
                            onMouseLeave={() => setHoveredVideo(null)} // Stop preview
                        >
                            {/* Video thumbnail or preview */}
                            <div className="video-frame">
                                {hoveredVideo === video._id ? (
                                    // Autoplay preview when hovered
                                    <ReactPlayer
                                        url={video.videoUrl}
                                        playing
                                        controls
                                        muted
                                        width="100%"
                                        height="100%"
                                        className="video-thumb"
                                    />
                                ) : (
                                    // Default static thumbnail
                                    <img
                                        src={video.thumbnailUrl}
                                        alt="thumbnail"
                                        className="video-thumbnail"
                                    />
                                )}

                                {/* Display pre-fetched video duration */}
                                <span className="video-duration">
                                    {durations[video._id] || "00:00:00"}
                                </span>
                            </div>

                            {/* Video meta info below thumbnail */}
                            <div className="video-info">
                                <img
                                    src={video.profileImage || sampleImage}
                                    alt="avatar"
                                    className="avatar-placeholder-video"
                                />
                                <div className="video-meta">
                                    <h4 className="video-title">{video.title}</h4>
                                    <p className="channel-name">{video.channel || "Channel Name"}</p>
                                    <p className="video-stats">
                                        {video.views || "100 views"} •{" "}
                                        {formatTimeAgo(video.uploadTime)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // Fallback UI if no videos match filter
                    <p>No videos found for "{searchTerm}"</p>
                )}
            </div>

            {/* Video modal popup when a video is active */}
            {activeVideo && (
                <VideoModal videoId={activeVideo} onClose={() => setActiveVideo(null)} />
            )}
        </>
    );
};

export default VideoGrid;
