import styles from './main.navbar.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function MainNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Define icons + paths here — easily scalable later
  const iconLinks = [
    { icon: ["fas", "bag-shopping"], path: "/dashboard/catalog", label: "Bag" },
    { icon: ["fas", "shopping-cart"], path: "/dashboard/cart", label: "Cart" },
    { icon: ["fas", "heart"], path: "/dashboard/wishlist", label: "Wishlist" },
    { icon: ["fas", "user-circle"], path: "/dashboard/settings", label: "Account" },
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    // Sanitize query: only allow letters and spaces, normalize multiple spaces, limit length
    const sanitized = value
      .replace(/[^a-zA-Z\s]/g, '') // Remove all non-letter characters except spaces
      .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
      .slice(0, 64);
    setSearchQuery(sanitized);
    // Store sanitized and trimmed search query in sessionStorage for the catalogue page to use
    sessionStorage.setItem('apparel_search_query', sanitized.trim());
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Navigate to catalogue page with search query
      navigate('/dashboard/catalog', { state: { searchQuery } });
    }
  };

  const handleSearchIcon = () => {
    if (searchQuery.trim()) {
      navigate('/dashboard/catalog', { state: { searchQuery } });
    }
  };

  const handleLogout = () => {
    // Ensure server-side session is invalidated then replace history to prevent back-navigation
    Promise.resolve(logout()).finally(() => {
      navigate('/login', { replace: true });
    });
  };

  return (
    <div className={styles.navbarWrapper}>
      <Link to="/dashboard"><span className="logo" style={{ cursor: "pointer" }}>
        corethreads®
      </span></Link>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search Apparel...." 
          value={searchQuery}
          onChange={handleSearch}
          onKeyPress={handleSearchSubmit}
          maxLength={64}
          aria-label="Search Apparel"
        />
        <FontAwesomeIcon
          icon={["fas", "magnifying-glass"]}
          size="sm"
          color="#385040"
          style={{ 
            position: 'absolute', 
            right: '12px', 
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
          onClick={handleSearchIcon}
        />
      </div>

      <div className={styles.navbarIconWrapper}>
        {iconLinks.map(({ icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${styles.iconLink} ${isActive ? styles.active : ""}`
            }
            title={label}
          >
            <FontAwesomeIcon
              icon={icon}
              size="lg"
              color="var(--color-accent)"
              className="icon"
            />
          </NavLink>
        ))}
        
        {/* User info */}
        {user && (
          <div className={styles.userBadge} title={user.username}>
            <FontAwesomeIcon 
              icon={["fas", "user"]} 
              size="sm" 
              className={styles.userIcon}
            />
            <span className={styles.userName}>{user.firstName}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainNavbar;