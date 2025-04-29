import { useState, useEffect } from 'react';
import { FaHome, FaMusic, FaPlus, FaSearch, FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set active tab based on current route
    const path = location.pathname.split('/')[1];
    setActiveTab(path || 'home');
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY && currentScrollY > 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const tabs = [
    { id: 'home', icon: <FaHome />, label: 'Home' },
    { id: 'playlists', icon: <FaMusic />, label: 'Playlists' },
    { id: 'search', icon: <FaSearch />, label: 'Search' },
    { id: 'create', icon: <FaPlus />, label: 'Create' },
    { id: 'profile', icon: <FaUser />, label: 'Profile' }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'create') {
      // Handle create action directly
      console.log('Create new playlist');
    } else {
      navigate(`/${tabId}`);
    }
  };

  return (
    <nav className={`navbar ${isScrollingUp ? 'visible' : ''}`}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => handleTabClick(tab.id)}
        >
          <div className="nav-icon">{tab.icon}</div>
          <span className="nav-label">{tab.label}</span>
          <div className="active-indicator"></div>
        </div>
      ))}
    </nav>
  );
};

export default NavBar;