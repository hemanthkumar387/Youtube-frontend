import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ViewChannel.css";
import formatTimeAgo from "../../utils/formatTimeAgo";
import { getVideoDuration, formatDuration } from "../../utils/videoDuration";
import sampleAvatar from '../../assets/avatar-profile.png';
import ReactPlayer from "react-player";

const ViewChannel = () => {
  const { userId } = useParams(); // Extract userId from URL
  const navigate = useNavigate();

  // State hooks
  const [channel, setChannel] = useState(null); // Channel info
  const [videos, setVideos] = useState([]); // All videos
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [hoveredVideo, setHoveredVideo] = useState(null); // Track video being hovered
  const [durations, setDurations] = useState({}); // Video durations
  const [dropdownVisibleId, setDropdownVisibleId] = useState(null); // Dropdown toggle by video ID

  // Video form data (used for both uploading and editing)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    category: ""
  });

  // Retrieve current user from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Redirect to login if user or token is missing
  useEffect(() => {
    if (!user || !user.token) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch channel info and all videos
  useEffect(() => {
    fetch(`https://youtube-backend-wjcl.onrender.com/api/channels/${userId}`)
      .then((res) => res.json())
      .then((data) => setChannel(data))
      .catch((err) => console.error(err));

    fetch("https://youtube-backend-wjcl.onrender.com/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error(err));
  }, [userId]);

  // Compute durations for this channel's videos
  useEffect(() => {
    const loadDurations = async () => {
      const newDurations = {};
      const channelVideos = videos.filter((v) => v.userId === userId);
      await Promise.all(
        channelVideos.map(async (video) => {
          try {
            const duration = await getVideoDuration(video.videoUrl);
            newDurations[video._id] = formatDuration(duration);
          } catch {
            newDurations[video._id] = "0:00";
          }
        })
      );
      setDurations(newDurations);
    };

    if (videos.length > 0) loadDurations();
  }, [videos, userId]);

  // Handle uploading or editing a video
  const handleVideoSubmit = async (e) => {
    e.preventDefault();

    const isEditing = !!formData._id;
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `https://youtube-backend-wjcl.onrender.com/api/videos/${formData._id}`
      : "https://youtube-backend-wjcl.onrender.com/api/videos";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...formData,
          userId,
          channel: channel.channelName,
          profileImage: channel.profileImg,
        }),
      });

      // Token expired or unauthorized
      if (res.status === 401) {
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        alert(isEditing ? "Failed to update video" : "Video upload failed");
        return;
      }

      const updatedVideo = await res.json();

      // Update video list depending on action
      if (isEditing) {
        setVideos((prev) =>
          prev.map((v) => (v._id === updatedVideo._id ? updatedVideo : v))
        );
      } else {
        setVideos([updatedVideo, ...videos]);
      }

      // Reset form and close modal
      setFormData({ title: "", description: "", thumbnailUrl: "", videoUrl: "", category: "", _id: "" });
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!channel) return <p>Loading...</p>;

  const channelVideos = videos.filter((video) => video.userId === userId);

  return (
    <div className="channel-container">
      {/* Channel banner */}
      <img src={channel.bannerImg} alt="Banner" className="channel-banner" />

      {/* Profile and about section */}
      <div className="channel-profile-section">
        <img src={channel.profileImg} alt="Profile" className="channel-profile-img" />
        <div>
          <h2>{channel.channelName}</h2>
          <p>{channel.about}</p>
        </div>
      </div>

      {/* Channel videos */}
      <div className="channel-videos-section">
        <div className="channel-videos-header">
          <h3>Videos</h3>

          {/* Add video button only visible for the owner */}
          {userId === user._id && (
            <div className="channel-add-video" onClick={() => setShowModal(true)}>
              <p>Add Video</p>
            </div>
          )}
        </div>

        <div className="channel-video-grid">
          {channelVideos.length === 0 ? (
            <p className="channel-no-videos-message">No videos uploaded yet.</p>
          ) : (
            channelVideos.map((video) => (
              <div
                key={video._id}
                className="channel-video-card"
                onMouseEnter={() => setHoveredVideo(video._id)}
                onMouseLeave={() => setHoveredVideo(null)}
              >
                {/* Thumbnail or preview player */}
                <div className="channel-video-frame" onClick={() => navigate(`/video/${video._id}`)}>
                  {hoveredVideo === video._id ? (
                    <ReactPlayer
                      url={video.videoUrl}
                      playing
                      controls
                      muted
                      width="100%"
                      height="100%"
                      className="channel-video-thumb"
                    />
                  ) : (
                    <img
                      src={video.thumbnailUrl}
                      alt="thumbnail"
                      className="channel-thumbnail"
                    />
                  )}
                  <span className="channel-video-duration">
                    {durations[video._id] || "00:00:00"}
                  </span>
                </div>

                {/* Video info and owner options */}
                <div className="channel-video-info">
                  <img src={video.profileImage || sampleAvatar} alt="avatar" className="channel-avatar" />
                  <div className="channel-video-meta">
                    {/* Edit/Delete options (visible to owner) */}
                    {user._id === video.userId && (
                      <div className="video-options-container">
                        <button
                          className="video-options-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownVisibleId(dropdownVisibleId === video._id ? null : video._id);
                          }}
                        >
                          ⋮
                        </button>
                        {dropdownVisibleId === video._id && (
                          <div className="video-dropdown">
                            <button
                              className="dropdown-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData({
                                  ...video,
                                  _id: video._id
                                });
                                setShowModal(true);
                                setDropdownVisibleId(null);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="dropdown-item delete"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm("Are you sure you want to delete this video?")) {
                                  try {
                                    const res = await fetch(`http://localhost:5000/api/videos/${video._id}`, {
                                      method: "DELETE",
                                      headers: {
                                        Authorization: `Bearer ${user.token}`,
                                      },
                                    });
                                    if (res.ok) {
                                      setVideos(videos.filter(v => v._id !== video._id));
                                    } else {
                                      alert("Failed to delete video.");
                                    }
                                  } catch (err) {
                                    console.error("Delete error:", err);
                                  }
                                }
                                setDropdownVisibleId(null);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    <h4 className="channel-video-title">{video.title}</h4>
                    <p className="channel-name">{video.channel}</p>
                    <p className="channel-video-stats">
                      {video.views || "100 views"} • {formatTimeAgo(video.uploadTime)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Video upload/edit modal */}
      {showModal && (
        <div className="channel-modal-overlay">
          <div className="channel-modal-content">
            <h3>Upload Video</h3>
            <form onSubmit={handleVideoSubmit} className="channel-modal-form">
              <input
                type="text"
                placeholder="Video Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Thumbnail URL"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Video URL"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                required
              />
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="" disabled>Select category</option>
                <option value="Music">Music</option>
                <option value="Gaming">Gaming</option>
                <option value="Education">Education</option>
                <option value="News">News</option>
                <option value="Movies">Movies</option>
                <option value="Fashion">Fashion</option>
                <option value="Podcasts">Podcasts</option>
                <option value="Live">Live</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>

              <div className="channel-form-actions">
                <button type="submit">Upload</button>
                <button type="button" onClick={() => { 
                  setShowModal(false);
                  setFormData({
                    title: "",
                    description: "",
                    thumbnailUrl: "",
                    videoUrl: "",
                    category: "",
                    _id: ""
                  });
                }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewChannel;
