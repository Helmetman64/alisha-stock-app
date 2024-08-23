import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./Menu.module.css"; // Ensure this path is correct

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? styles.activeNavItem : "";
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.navWrapper}>
        <nav className={styles.navbar}>
          <h1>Alishas Secret Garden</h1>
          <div
            className={`${styles.menuToggle} ${isOpen ? styles.isActive : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            role="button"
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </div>
          <ul className={`${styles.nav} ${isOpen ? styles.mobileNav : ""}`}>
            <li className={`${styles.navItem} ${isActive("/")}`}>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li className={`${styles.navItem} ${isActive("/stock")}`}>
              <Link to="/stock" onClick={closeMenu}>
                Stock
              </Link>
            </li>
            <li className={`${styles.navItem} ${isActive("/history")}`}>
              <Link to="/history" onClick={closeMenu}>
                History
              </Link>
            </li>
            <li className={`${styles.navItem} ${isActive("/dashboard")}`}>
              <Link to="/dashboard" onClick={closeMenu}>
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Menu;
