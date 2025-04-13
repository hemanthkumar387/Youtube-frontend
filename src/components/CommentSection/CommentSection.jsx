import { useEffect, useState } from "react";
import "./CommentSection.css";

const CommentSection = ({ videoId, user }) => {
  const [comments, setComments] = useState([]); // Stores the list of comments
  const [newComment, setNewComment] = useState(""); // Stores the new comment input

  // Fetch all comments for the current video
  const fetchComments = async () => {
    try {
      const res = await fetch(`https://youtube-backend-wjcl.onrender.com/api/comments/${videoId}`);
      const data = await res.json();
      setComments(data); // Set the fetched comments to state
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // Handle posting a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Prevent posting empty comments
    try {
      const token = localStorage.getItem("token"); // Get auth token from localStorage
      const res = await fetch(`https://youtube-backend-wjcl.onrender.com/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ videoId, comment: newComment }),
      });
      const data = await res.json();
      setComments([data, ...comments]); // Add new comment to the top of the list
      setNewComment(""); // Clear input
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Handle deleting a comment
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://youtube-backend-wjcl.onrender.com/api/comments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter((c) => c._id !== id)); // Remove deleted comment from UI
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // Handle updating a comment
  const handleUpdate = async (id, updatedComment) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://youtube-backend-wjcl.onrender.com/api/comments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: updatedComment }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      // Update comment in state
      setComments(comments.map((c) => (c._id === id ? updated : c)));
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  // Fetch comments when component mounts or videoId changes
  useEffect(() => {
    fetchComments();
  }, [videoId]);

  return (
    <div className="comments-section">
      <h3>{comments.length.toLocaleString()} Comments</h3>

      {/* Render input field only if user is logged in */}
      {user && (
        <div className="add-comment">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>Post</button>
        </div>
      )}

      {/* List of comments */}
      <div className="comment-list">
        {comments.map((c) => (
          <CommentItem
            key={c._id}
            comment={c}
            currentUserId={user?._id}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};


const CommentItem = ({ comment, currentUserId, onDelete, onUpdate }) => {
  const [editMode, setEditMode] = useState(false); // Toggle between view/edit mode
  const [updatedText, setUpdatedText] = useState(comment.comment); // Store updated comment text

  // Save updated comment
  const handleSave = () => {
    if (!updatedText.trim()) return; // Prevent saving empty comments
    onUpdate(comment._id, updatedText);
    setEditMode(false); // Exit edit mode
  };

  return (
    <div className="comment-item">
      <div className="comment-content">
        <div className="comment-header">
          <span className="username">@{comment.username || "user"}</span>
        </div>

        {/* If in edit mode, show textarea */}
        {editMode ? (
          <>
            <textarea
              value={updatedText}
              onChange={(e) => setUpdatedText(e.target.value)}
            />
            <div className="comment-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p>{comment.comment}</p>
            <div className="comment-actions">
              <button>👍</button> {/* Placeholder like button */}
              <button>👎</button> {/* Placeholder dislike button */}

              {/* Only show edit/delete for the owner of the comment */}
              {currentUserId === comment.userId && (
                <>
                  <button onClick={() => setEditMode(true)}>Edit</button>
                  <button onClick={() => onDelete(comment._id)}>Delete</button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
