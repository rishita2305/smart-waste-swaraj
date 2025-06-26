// src/components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react'; // Import useState for the mobile menu toggle
import { useData } from '../../contexts/DataContext';
import {
  FaBars,        // Hamburger icon
  FaTimes,       // Close icon (X)
  FaHome,
  FaTachometerAlt, // Dashboard icon
  FaMapMarkedAlt,  // Waste Map icon
  FaPlusCircle,    // List Waste icon
  FaBookOpen,      // Learn icon
  FaSignInAlt,     // Login icon
  FaUserPlus,      // Signup icon
  FaSignOutAlt,    // Logout icon
  FaUserCircle     // User profile icon
} from 'react-icons/fa'; // Import React Icons

import styles from './navbar.module.css'; // Import module CSS

export default function Navbar() {
  const { currentUser, logout } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false); // Close mobile menu when a link is clicked
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false); // Close mobile menu on logout
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={handleNavLinkClick}>
          <span className={styles.logoIcon}>♻️</span> Smart Waste Swaraj
        </Link>

        {/* Mobile Menu Toggle Button */}
        <div className={styles.menuToggle} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation Links - Conditional class for mobile view */}
        <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.active : ''}`}>
          <Link href="/" className={styles.navLink} onClick={handleNavLinkClick}>
            <FaHome className={styles.navIcon} /> Home
          </Link>
          <Link href="/dashboard" className={styles.navLink} onClick={handleNavLinkClick}>
            <FaTachometerAlt className={styles.navIcon} /> Dashboard
          </Link>
          <Link href="/map" className={styles.navLink} onClick={handleNavLinkClick}>
            <FaMapMarkedAlt className={styles.navIcon} /> Waste Map
          </Link>
          {currentUser?.userType === 'generator' && (
            <Link href="/list-waste" className={styles.navLink} onClick={handleNavLinkClick}>
              <FaPlusCircle className={styles.navIcon} /> List Waste
            </Link>
          )}
          <Link href="/learn" className={styles.navLink} onClick={handleNavLinkClick}>
            <FaBookOpen className={styles.navIcon} /> Learn
          </Link>

          {/* Conditional rendering for Auth buttons */}
          {currentUser ? (
            <button onClick={handleLogout} className={`${styles.logoutButton} ${styles.navLink}`}>
              <FaSignOutAlt className={styles.navIcon} /> Logout ({currentUser.email.split('@')[0]})
            </button>
          ) : (
            <>
              <Link href="/auth/login" className={`${styles.authButton} ${styles.navLink}`} onClick={handleNavLinkClick}>
                <FaSignInAlt className={styles.navIcon} /> Login
              </Link>
              <Link href="/auth/signup" className={`${styles.authButton} ${styles.navLink}`} onClick={handleNavLinkClick}>
                <FaUserPlus className={styles.navIcon} /> Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}