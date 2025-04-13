import './Category.css'; // Importing the CSS file for styling the Category component

// Functional component 'Category' with props:
// - videos: array of video objects (default to empty array if not provided)
// - selectedCategory: the currently selected category
// - onSelectCategory: callback function to handle category selection
const Category = ({ videos = [], selectedCategory, onSelectCategory }) => {
    // Extract unique categories from video data
    // - Get 'category' from each video
    // - Use Set to remove duplicates
    // - Add 'All' at the beginning
    const uniqueCategories = [
        "All",
        ...new Set(
            videos
                .map((video) => video.category)
                .filter((category) => category && category.trim() !== "")
        ),
    ];

    return (
        <div className="category-bar"> {/* Container for category buttons */}
            {uniqueCategories.map((category, idx) => (
                <button
                    key={idx} // Unique key for each button
                    className={`category-item ${selectedCategory === category ? "active" : ""}`} // Add 'active' class if selected
                    onClick={() => onSelectCategory(category)} // Handle button click to select category
                >
                    {category} {/* Display category name */}
                </button>
            ))}
        </div>
    );
};

export default Category; // Export the component for use in other parts of the app
