import styles from './main.navbar.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, Link } from "react-router-dom";

function MainNavbar() {
  // Define icons + paths here — easily scalable later
  const iconLinks = [
    { icon: ["fas", "bag-shopping"], path: "/dashboard/catalog", label: "Bag" },
    { icon: ["fas", "shopping-cart"], path: "/dashboard/cart", label: "Cart" },
    { icon: ["fas", "heart"], path: "/dashboard/wishlist", label: "Wishlist" },
    { icon: ["fas", "user-circle"], path: "/dashboard/settings", label: "Account" },
  ];

  return (
    <div className={styles.navbarWrapper}>
      <Link to="/dashboard"><span className="logo" style={{ cursor: "pointer" }}>
        corethreads®
      </span></Link>

      <input type="text" placeholder="Search Apparel...." />

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
      </div>
    </div>
  );
}

export default MainNavbar;