import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateChannel.css";

const CreateChannel = () => {
    // Form state to hold channel info (name, about, images)
    const [formData, setFormData] = useState({ name: "", about: "", profileImg: "", bannerImg: "" });

    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Get the logged-in user from local storage
    const user = JSON.parse(localStorage.getItem("user"));

    // Handle form submission to create a new channel
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form behavior
        try {
            const res = await fetch("https://youtube-backend-wjcl.onrender.com/api/channels", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`, // Pass token for authentication
                },
                body: JSON.stringify(formData),
            });

            const text = await res.text(); // Read raw response text
            console.log("Status:", res.status);
            console.log("Response Text:", text);

            if (res.ok) {
                // Redirect to the user's channel page if successful
                navigate(`/channel/${user._id}`);
            } else {
                // Show error alert on failure
                const errText = await res.text();
                console.error("Error:", errText);
                alert("Failed to create channel");
            }
        } catch (err) {
            console.error(err); // Log any unexpected error
        }
    };

    // Helper function to convert image file to base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    // Handle image file input changes
    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await toBase64(file);
            setFormData(prev => ({ ...prev, [type]: base64 })); // Set base64 to corresponding type (banner/profile)
        }
    };

    return (
        <div className="create-channel-ui">
            <div className="modal">
                <h2>How you'll appear</h2>

                {/* Banner image section */}
                <div className="banner-section">
                    {formData.bannerImg ? (
                        <img className="banner-img" src={formData.bannerImg} alt="Banner" />
                    ) : (
                        <div className="banner-placeholder">Banner Preview</div>
                    )}
                    <input
                        className="banner-input"
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, "bannerImg")}
                    />
                </div>

                {/* Profile avatar section */}
                <div className="avatar-section">
                    {formData.profileImg ? (
                        <img className="avatar-img" src={formData.profileImg} alt="Profile" />
                    ) : (
                        <div className="avatar-placeholder"></div>
                    )}
                    <input
                        className="avatar-input"
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, "profileImg")}
                    />
                </div>

                {/* Form for entering channel name and description */}
                <form onSubmit={handleSubmit} className="channel-form">
                    <input
                        type="text"
                        name="channelName"
                        placeholder="Channel Name"
                        required
                        value={formData.channelName}
                        onChange={e => setFormData({ ...formData, channelName: e.target.value })}
                    />
                    <input
                        type="text"
                        name="about"
                        placeholder="Description"
                        value={formData.about}
                        onChange={e => setFormData({ ...formData, about: e.target.value })}
                    />

                    {/* Action buttons */}
                    <div className="form-actions">
                        {/* Go back to the previous page */}
                        <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                            Cancel
                        </button>

                        {/* Submit to create channel */}
                        <button type="submit" className="create-btn">
                            Create channel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateChannel;
