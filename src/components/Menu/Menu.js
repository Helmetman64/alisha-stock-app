import { useState } from "react";
import styles from "./Menu.module.css"; // Ensure this path is correct
import { Link } from "react-router-dom";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
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
            <li className={styles.navItem}>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/stock" onClick={closeMenu}>
                Stock
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/history" onClick={closeMenu}>
                History
              </Link>
            </li>
            <li className={styles.navItem}>
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
