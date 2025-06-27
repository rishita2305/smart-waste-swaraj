// src/components/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useData } from '../contexts/DataContext';
import { useRouter } from 'next/navigation';
import { FaRecycle, FaMapMarkedAlt, FaPlusSquare, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaTachometerAlt } from 'react-icons/fa';

export default function Navbar() {
  const { currentUser, logout } = useData();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    // Replaced specific background/shadow with a custom class for more control
    // Added a subtle background color with opacity and backdrop-filter for blur effect
    <nav className="bg-transparent backdrop-blur-md bg-white/30 text-white p-4 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:text-blue-200 transition-colors duration-200">
          {/* Changed text-accent to a specific blue color to ensure contrast */}
          <FaRecycle className="text-blue-300" /> Smart Waste Swaraj
        </Link>

        <div className="flex space-x-4 md:space-x-6 items-center">
          {!currentUser && (
            <>
              <Link href="/auth/login" className="text-white hover:text-blue-200 transition-colors duration-200 flex items-center">
                <FaSignInAlt className="inline-block mr-1" /> Login
              </Link>
              <Link href="/auth/signup" className="text-white hover:text-blue-200 transition-colors duration-200 flex items-center">
                <FaUserPlus className="inline-block mr-1" /> Signup
              </Link>
            </>
          )}

          {currentUser ? (
            <>
              {currentUser.userType === 'generator' && (
                <Link href="/list-waste" className="text-white hover:text-blue-200 transition-colors duration-200 flex items-center">
                  <FaPlusSquare className="inline-block mr-1" /> List Waste
                </Link>
              )}
              
              <Link href="/map" className="text-white hover:text-blue-200 transition-colors duration-200 flex items-center">
                <FaMapMarkedAlt className="inline-block mr-1" /> Waste Map
              </Link>
              <Link href="/dashboard" className="text-white hover:text-blue-200 transition-colors duration-200 flex items-center">
                <FaTachometerAlt className="inline-block mr-1" /> Dashboard
              </Link>
              <span className="text-white text-sm hidden md:block opacity-80">
                Welcome, {currentUser.name || currentUser.email.split('@')[0]}
              </span>
              <button onClick={handleLogout} className="border border-white text-white font-semibold py-1.5 px-3 rounded-lg hover:bg-white hover:text-green-600 transition duration-200 text-sm flex items-center">
                <FaSignOutAlt className="inline-block mr-1" /> Logout
              </button>
            </>
          ) : (
            null
          )}
        </div>
      </div>
    </nav>
  );
}