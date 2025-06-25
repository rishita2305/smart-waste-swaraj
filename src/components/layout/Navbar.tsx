// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useData } from '../../contexts/DataContext'; // Adjust path if necessary
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaHome, FaInfoCircle, FaBookOpen } from 'react-icons/fa';
import styles from './navbar.module.css';

export default function Navbar() {
  const { currentUser, logout, loading } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Close menu on logout
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link href="/" className={styles.navbarBrand}>
          <span className={styles.brandIcon}>♻️</span> Smart Waste Swaraj
        </Link>

        <div className={styles.menuToggle} onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`${styles.navbarNav} ${isOpen ? styles.navOpen : ''}`}>
          <li>
            <Link href="/" className={styles.navLink} onClick={() => setIsOpen(false)}>
              <FaHome className={styles.navIcon} /> Home
            </Link>
          </li>
          <li>
            <Link href="/learn" className={styles.navLink} onClick={() => setIsOpen(false)}>
              <FaBookOpen className={styles.navIcon} /> Learn
            </Link>
          </li>
          <li>
            <Link href="/about" className={styles.navLink} onClick={() => setIsOpen(false)}>
              <FaInfoCircle className={styles.navIcon} /> About Us
            </Link>
          </li>

          {loading ? (
            // Optional: Show a subtle loader or nothing while checking auth status
            <li className={styles.loadingState}>Checking Auth...</li>
          ) : (
            <>
              {currentUser ? (
                <>
                  <li>
                    <Link href="/dashboard" className={styles.navLink} onClick={() => setIsOpen(false)}>
                      <FaUserCircle className={styles.navIcon} /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className={styles.navLinkButton}>
                      <FaSignOutAlt className={styles.navIcon} /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/auth/login" className={styles.navLink} onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/signup" className={`${styles.navLink} ${styles.signupButton}`} onClick={() => setIsOpen(false)}>
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}