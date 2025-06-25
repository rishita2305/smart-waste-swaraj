// src/contexts/DataContext.tsx (Mock example for hackathon)
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, WasteListing, DataContextType } from '../types'; // Adjust path if needed
import { v4 as uuidv4 } from 'uuid'; // npm install uuid @types/uuid

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [wasteListings, setWasteListings] = useState<WasteListing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from local storage or initial data
    const storedUser = localStorage.getItem('currentUser');
    const storedListings = localStorage.getItem('wasteListings');
    const storedUsers = localStorage.getItem('users');

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    if (storedListings) {
      setWasteListings(JSON.parse(storedListings));
    } else {
      // Initial mock listings if none exist
      setWasteListings([
        { id: uuidv4(), userId: 'generator1', wasteType: 'Plastic Bottles', quantity: '5 kg', location: '123 Main St', description: 'Clear plastic bottles, cleaned.', status: 'pending', createdAt: Date.now() },
        { id: uuidv4(), userId: 'generator2', wasteType: 'Organic Food Waste', quantity: '2 kg', location: '456 Elm St', description: 'Daily kitchen scraps.', status: 'pending', createdAt: Date.now() - 86400000 },
        { id: uuidv4(), userId: 'generator1', wasteType: 'Cardboard Boxes', quantity: '10 kg', location: '123 Main St', description: 'Flattened cardboard boxes.', status: 'assigned', assignedCollectorId: 'collector1', createdAt: Date.now() - 172800000 },
        { id: uuidv4(), userId: 'generator3', wasteType: 'Newspaper', quantity: '3 kg', location: '789 Oak Ave', description: 'Old newspapers bundled.', status: 'completed', assignedCollectorId: 'collector2', createdAt: Date.now() - 259200000 },
      ]);
    }
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
        // Initial mock users
        setUsers([
            { id: 'generator1', email: 'gen@example.com', name: 'Alice Waste', userType: 'generator' },
            { id: 'generator2', email: 'bob@example.com', name: 'Bob Eco', userType: 'generator' },
            { id: 'generator3', email: 'charlie@example.com', name: 'Charlie Green', userType: 'generator' },
            { id: 'collector1', email: 'col@example.com', name: 'David Clean', userType: 'collector' },
            { id: 'collector2', email: 'emma@example.com', name: 'Emma Recycle', userType: 'collector' },
        ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Persist data to local storage (for hackathon demo persistence)
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('wasteListings', JSON.stringify(wasteListings));
    localStorage.setItem('users', JSON.stringify(users));
  }, [currentUser, wasteListings, users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    const userFound = users.find(u => u.email === email && password === 'password'); // Simple password check for mock
    if (userFound) {
      setCurrentUser(userFound);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const signup = async (userData: Omit<User, 'id'> & { password?: string }): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    if (users.some(u => u.email === userData.email)) {
      setLoading(false);
      return false; // Email already in use
    }
    const newUser: User = { id: uuidv4(), ...userData };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser); // Log in new user automatically
    setLoading(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser'); // Clear from storage
  };

  const createWasteListing = async (newListing: Omit<WasteListing, 'id' | 'status' | 'createdAt' | 'userId'>): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!currentUser) return false;
    const listing: WasteListing = {
      id: uuidv4(),
      userId: currentUser.id,
      status: 'pending',
      createdAt: Date.now(),
      ...newListing,
    };
    setWasteListings(prev => [listing, ...prev]); // Add to top
    setLoading(false);
    return true;
  };

  const assignCollectorToListing = async (listingId: string, collectorId: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setWasteListings(prev => prev.map(listing =>
      listing.id === listingId
        ? { ...listing, status: 'assigned', assignedCollectorId: collectorId }
        : listing
    ));
    setLoading(false);
    return true;
  };

  const completeListing = async (listingId: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setWasteListings(prev => prev.map(listing =>
      listing.id === listingId
        ? { ...listing, status: 'completed' }
        : listing
    ));
    setLoading(false);
    return true;
  };


  // Adjust your DataContextType in types/index.ts to match these functions
  const value: DataContextType = {
    currentUser,
    loading,
    wasteListings,
    users, // Provide users array
    login,
    signup,
    logout,
    createWasteListing,
    assignCollectorToListing,
    completeListing,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}