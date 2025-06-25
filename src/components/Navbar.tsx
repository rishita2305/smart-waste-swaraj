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
    <nav className="bg-primary text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:text-accent transition-colors duration-200">
          <FaRecycle className="text-accent" /> Smart Waste Swaraj
        </Link>

        <div className="flex space-x-4 md:space-x-6 items-center">
          {!currentUser && (
            <>
              <Link href="/auth/login" className="text-white hover:text-accent transition-colors duration-200 flex items-center">
                <FaSignInAlt className="inline-block mr-1" /> Login
              </Link>
              <Link href="/auth/signup" className="text-white hover:text-accent transition-colors duration-200 flex items-center">
                <FaUserPlus className="inline-block mr-1" /> Signup
              </Link>
            </>
          )}

          {currentUser ? (
            <>
              {currentUser.userType === 'generator' && (
                <Link href="/list-waste" className="text-white hover:text-accent transition-colors duration-200 flex items-center">
                  <FaPlusSquare className="inline-block mr-1" /> List Waste
                </Link>
              )}
              <Link href="/map" className="text-white hover:text-accent transition-colors duration-200 flex items-center">
                <FaMapMarkedAlt className="inline-block mr-1" /> Map
              </Link>
              <Link href="/dashboard" className="text-white hover:text-accent transition-colors duration-200 flex items-center">
                <FaTachometerAlt className="inline-block mr-1" /> Dashboard
              </Link>
              <span className="text-light text-sm hidden md:block">
                Welcome, {currentUser.name || currentUser.email.split('@')[0]}
              </span>
              <button onClick={handleLogout} className="border border-white text-white font-semibold py-1.5 px-3 rounded-lg hover:bg-white hover:text-primary transition duration-200 text-sm flex items-center">
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