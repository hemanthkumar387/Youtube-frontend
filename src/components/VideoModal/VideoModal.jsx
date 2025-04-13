// React hooks and router
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Custom hook to fetch videos
import useVideos from "../../utils/useVideos";
// Styles and utilities
import "./VideoModal.css";
import formatTimeAgo from "../../utils/formatTimeAgo";
// Comments section component
import CommentSection from "../CommentSection/CommentSection";

const VideoPage = () => {
  // Extract video ID from URL parameters
  const { id } = useParams();
  // Router navigation
  const navigate = useNavigate();
  // Fetch all videos
  const { videos } = useVideos();
  // Find the currently selected video by ID
  const video = videos.find((v) => v._id === id);
  // Get suggested videos by filtering out the current video
  const suggested = videos.filter((v) => v._id !== id);
  // State for like, dislike, and subscribe buttons
  const [likeState, setLikeState] = useState(false);
  const [dislikeState, setDislikeState] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user || !user.token) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [user, navigate]);

  // Handle like toggle
  const toggleLike = async () => {
    try {
      const res = await fetch(`https://youtube-backend-wjcl.onrender.com/api/videos/like/${video._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ increment: !likeState }),
      });
      if (res.ok) setLikeState(!likeState);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  // Handle dislike toggle
  const toggleDislike = async () => {
    try {
      const res = await fetch(`https://youtube-backend-wjcl.onrender.com/api/videos/dislike/${video._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ increment: !dislikeState }),
      });
      if (res.ok) setDislikeState(!dislikeState);
    } catch (err) {
      console.error("Dislike failed", err);
    }
  };

  // Handle subscribe/unsubscribe toggle
  const toggleSubscribe = async () => {
    try {
      const res = await fetch(`https://youtube-backend-wjcl.onrender.com/api/videos/subscribe/${video._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ increment: !subscribed }),
      });
      if (res.ok) setSubscribed(!subscribed);
    } catch (err) {
      console.error("Subscribe failed", err);
    }
  };

  // Show loading text while video data is not available
  if (!video) return <p style={{ color: "white" }}>Loading video...</p>;

  return (
    <>
      <div className="videoPage-main">
        {/* Left Section: Video Player + Info */}
        <div className="videoPage-video-section">
          {/* Video Player */}
          <div key={video._id} className="videoPage-videoPlayer">
            <video controls autoPlay width="100%" height="100%" style={{ borderRadius: "10px" }}>
              <source src={video.videoUrl} type="video/mp4" />
            </video>
          </div>

          {/* Video Title */}
          <div className="videoPage-title">{video.title}</div>

          {/* Channel Info and Actions */}
          <div className="videoPage-channelRow">
            <div className="videoPage-channel-left">
              {/* Channel Avatar */}
              <div className="videoPage-channel-img">
                <img
                  src={video.profileImage}
                  alt="channel avatar"
                  style={{ borderRadius: "50%", width: "48px", height: "48px" }}
                />
              </div>

              {/* Channel Details */}
              <div className="videoPage-channel-info">
                <div className="videoPage-channel-name">
                  {video.channel || "Channel Name"}{" "}
                  <i className="fas fa-check-circle videoPage-verified-icon"></i>
                </div>
                <div className="videoPage-subscribers" onClick={toggleSubscribe}>
                  {subscribed ? video.subscribers + 1 : video.subscribers} subscribers
                </div>
              </div>

              {/* Subscribe Button */}
              <div className="videoPage-channel-center">
                <button className="videoPage-subscribeBtn" onClick={toggleSubscribe}>
                  {subscribed ? "Unsubscribe" : "Subscribe"}
                </button>
              </div>
            </div>

            {/* Like, Dislike, Share, Download Actions */}
            <div className="videoPage-actionBar">
              <div className="videoPage-actionBtn" onClick={toggleLike}>
                <i className="fas fa-thumbs-up"></i> {likeState ? video.likes + 1 : video.likes}
              </div>
              <div className="videoPage-actionBtn" onClick={toggleDislike}>
                <i className="fas fa-thumbs-down"></i> {dislikeState ? video.dislikes + 1 : video.dislikes}
              </div>
              <div className="videoPage-actionBtn">
                <i className="fas fa-share"></i> Share
              </div>
              <div className="videoPage-actionBtn">
                <i className="fas fa-download"></i> Download
              </div>
            </div>
          </div>

          {/* Video Description */}
          <div className="videoPage-description">{video.description}</div>

          {/* Comments Section */}
          <CommentSection videoId={id} user={user} />
        </div>

        {/* Right Section: Suggested Videos */}
        <div className="videoPage-sidebar">
          {suggested.map((v) => (
            <div
              key={v._id}
              className="videoPage-suggestion"
              onClick={() => navigate(`/video/${v._id}`)}
            >
              <div className="videoPage-thumbnail">
                <img src={v.thumbnailUrl} alt="" />
              </div>
              <div className="videoPage-info">
                <strong>{v.title}</strong>
                <span className="videoPage-meta">
                  {v.channel || "Channel Name"} <br />
                  {v.views || "123K"} views • {formatTimeAgo(v.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoPage;
