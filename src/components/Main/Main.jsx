// Import necessary hooks and components
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom"; // Allows nested routes to be rendered
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./Main.css";

const MainLayout = () => {
  // Sidebar toggle state (expanded/collapsed)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  // User state to store logged-in user info
  const [user, setUser] = useState(null);
  // Boolean to check if user has a channel
  const [hasChannel, setHasChannel] = useState(false);
  // Search term state to pass between components
  const [searchTerm, setSearchTerm] = useState("");
  // Toggle the sidebar open/closed
  const toggleSidebar = () => setIsSidebarExpanded(prev => !prev);

  // Check for user data in local storage and fetch channel info if user exists
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);

      // Fetch user's channel details
      fetch(`https://youtube-backend-wjcl.onrender.com/api/channels/${storedUser._id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setHasChannel(true); // Set channel flag if channel data exists
        })
        .catch(() => setHasChannel(false)); // If fetch fails, assume no channel
    }
  }, []);

  return (
    <div className={`app-wrapper ${isSidebarExpanded ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Navbar with user info, sidebar toggle, and search handling */}
      <Navbar
        user={user}
        hasChannel={hasChannel}
        toggleSidebar={toggleSidebar}
        setUser={setUser}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Sidebar with expand/collapse toggle */}
      <Sidebar isSidebarExpanded={isSidebarExpanded} />

      {/* Main content area where nested routes will render */}
      <main className="content-area">
        {/* Outlet lets child routes access `searchTerm` via context */}
        <Outlet context={{ searchTerm }} />
      </main>
    </div>
  );
};

export default MainLayout;
