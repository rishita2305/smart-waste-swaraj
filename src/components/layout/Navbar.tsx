// src/components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import { useData } from '../../contexts/DataContext';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaTachometerAlt,
  FaMapMarkedAlt,
  FaPlusCircle, // Add Waste icon
  FaBookOpen,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle // User profile icon (if you want to use it later)
} from 'react-icons/fa';

import styles from './navbar.module.css';

export default function Navbar() {
  const { currentUser, logout } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter(); // Initialize useRouter hook

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

  // Handle click on "Add Waste" link: redirect to login if not authenticated
  const handleAddWasteClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!currentUser) {
      e.preventDefault(); // Prevent default link behavior
      // Redirect to login page, with a 'redirect' query parameter to return after login
      router.push('/auth/login?redirect=/add-waste');
      setIsMobileMenuOpen(false); // Close menu
    } else {
      handleNavLinkClick(); // If logged in, proceed and close mobile menu
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo and Site Title */}
        <Link href="/" className={styles.logo} onClick={handleNavLinkClick}>
          <span className={styles.logoIcon}>♻️</span> Smart Waste Swaraj
        </Link>

        {/* Mobile Menu Toggle Button (Hamburger/X icon) */}
        <div className={styles.menuToggle} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation Links - Dynamically apply 'active' class for mobile */}
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
          {/* "Add Waste" link: visible to all, but requires login for access */}
          <Link href="/list-waste" className={styles.navLink} onClick={handleAddWasteClick}>
            <FaPlusCircle className={styles.navIcon} /> Add Waste
          </Link>
          <Link href="/learn" className={styles.navLink} onClick={handleNavLinkClick}>
            <FaBookOpen className={styles.navIcon} /> Learn
          </Link>

          {/* Conditional rendering for Login/Signup or Logout button */}
          {currentUser ? (
            // User is logged in
            <button onClick={handleLogout} className={`${styles.logoutButton} ${styles.navLink}`}>
              <FaSignOutAlt className={styles.navIcon} /> Logout ({currentUser.email.split('@')[0]})
            </button>
          ) : (
            // User is not logged in
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