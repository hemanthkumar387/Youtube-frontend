// Import necessary hooks and components
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// Import styles and assets
import "./Navbar.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import sampleImage from '../../assets/avatar-profile.png';

// Navbar component accepts props for user info, channel state, sidebar toggle, and search handlers
const Navbar = ({ user, hasChannel, toggleSidebar, setUser, searchTerm, setSearchTerm }) => {
  // Local state for toggling search bar and user dropdown menu
  const [showSearch, setShowSearch] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const avatarRef = useRef(); // Ref to detect outside clicks

  // Toggles search input visibility
  const toggleSearch = () => setShowSearch(prev => !prev);

  // Toggles dropdown menu visibility
  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  // Clears user data and redirects to homepage on logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  // Close dropdown when clicking outside of the avatar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`navbar ${showSearch ? "show-search" : ""}`}>
      
      {/* Left section: Menu icon and YouTube logo */}
      <div className="navbar-left">
        <i className="fas fa-bars menu-icon desktop-only" onClick={toggleSidebar}></i>
        <Link to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
            alt="YouTube Logo"
            className="logo"
          />
        </Link>
      </div>

      {/* Center section: Search bar */}
      <div className={`navbar-center ${showSearch ? "show" : ""}`}>
        {showSearch && (
          <button className="back-button" onClick={toggleSearch}>
            <i className="fas fa-arrow-left"></i>
          </button>
        )}
        <input
          type="text"
          className="search-input"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </div>

      {/* Right section: Mobile search icon, login button or avatar */}
      <div className="navbar-right">
        {!showSearch && (
          <button className="mobile-search-icon" onClick={toggleSearch}>
            <i className="fas fa-search"></i>
          </button>
        )}

        {/* Show Sign In if not logged in */}
        {!user ? (
          <button className="signin-button" onClick={() => navigate("/login")}>
            <i className="fas fa-user-circle"></i> Sign in
          </button>
        ) : (
          // If logged in, show avatar and dropdown
          <div className="user-avatar-container" ref={avatarRef}>
            <span className="username-desktop">{user.username}</span>
            <img
              className="avatar"
              src={user.avatar || sampleImage}
              alt={user.username}
              onClick={toggleDropdown}
            />

            {/* Dropdown menu for logged-in user actions */}
            {dropdownOpen && (
              <div className="dropdown-menu">
                <p className="dropdown-username username-mobile-only">{user.username}</p>
                {hasChannel ? (
                  <button onClick={() => {
                    setDropdownOpen(false);
                    navigate(`/channel/${user._id}`);
                  }}>
                    View Channel
                  </button>
                ) : (
                  <button onClick={() => {
                    setDropdownOpen(false);
                    navigate("/create-channel");
                  }}>
                    Create Channel
                  </button>
                )}
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
