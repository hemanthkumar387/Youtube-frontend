// Sidebar component to show navigation links on the left or bottom (mobile)
// Uses conditional rendering to expand or collapse based on `isSidebarExpanded` prop
import React from "react";
import { Link } from "react-router-dom"; // Enables client-side routing
import './Sidebar.css';

const Sidebar = ({ isSidebarExpanded }) => {
    return (
        <>
            {/* Main sidebar for desktop */}
            <aside className={`sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
                <ul className="sidebar-menu">
                    {/* Home Link */}
                    <Link to="/">
                        <li>
                            <i className="fas fa-home"></i>
                            {/* Only show text when sidebar is expanded */}
                            {isSidebarExpanded && <span>Home</span>}
                        </li>
                    </Link>

                    {/* Placeholder links for other sections */}
                    <Link>
                        <li>
                            <i className="fas fa-fire"></i>
                            {isSidebarExpanded && <span>Trending</span>}
                        </li>
                    </Link>

                    <Link>
                        <li>
                            <i className="fas fa-photo-video"></i>
                            {isSidebarExpanded && <span>Shorts</span>}
                        </li>
                    </Link>

                    <Link>
                        <li>
                            <i className="fas fa-th-list"></i>
                            {isSidebarExpanded && <span>Subscriptions</span>}
                        </li>
                    </Link>

                    <hr /> {/* Divider */}

                    {/* More navigation items */}
                    <li>
                        <Link>
                            <i className="fas fa-photo-video"></i>
                            {isSidebarExpanded && <span>Library</span>}
                        </Link>
                    </li>
                    <li>
                        <Link>
                            <i className="fas fa-history"></i>
                            {isSidebarExpanded && <span>History</span>}
                        </Link>
                    </li>
                </ul>
            </aside>

            {/* Mobile bottom navigation footer */}
            <footer className="mobile-footer-menu">
                <nav>
                    <ul>
                        <li>
                            <Link to="/">
                                <i className="fas fa-home"></i><span>Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link>
                                <i className="fas fa-fire"></i><span>Trending</span>
                            </Link>
                        </li>
                        <li>
                            <Link>
                                <i className="fas fa-photo-video"></i><span>Shorts</span>
                            </Link>
                        </li>
                        <li>
                            <Link>
                                <i className="fas fa-th-list"></i><span>Subscriptions</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </footer>
        </>
    );
};

export default Sidebar;
