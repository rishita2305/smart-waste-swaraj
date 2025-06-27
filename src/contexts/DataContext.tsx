// src/contexts/DataContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, WasteListing, WasteListingLocation, Comment } from '../types'; // Import all necessary types

// Define the type for your DataContext
export interface DataContextType {
  currentUser: User | null;
  loading: boolean; // Correctly named 'loading'
  wasteListings: WasteListing[];
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (user: Omit<User, 'id'>) => Promise<boolean>; // Assuming you have a signup function
  logout: () => void;
  assignCollectorToListing: (listingId: string, collectorId: string) => Promise<void>;
  completeListing: (listingId: string) => Promise<void>;
  createWasteListing: (listing: Omit<WasteListing, 'id' | 'createdAt' | 'status' | 'comments' | 'assignedCollectorId' | 'completedAt'>) => Promise<WasteListing>;
  addCommentToListing: (listingId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [wasteListings, setWasteListings] = useState<WasteListing[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Simulate initial data load and authentication status
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call delay

      // Updated Dummy Users with names
      const dummyUsers: User[] = [
        { id: 'gen1', email: 'generator@example.com', name: 'Alice Generator', userType: 'generator', location: { latitude: 28.7041, longitude: 77.1025 } }, // Delhi
        { id: 'col1', email: 'collector@example.com', name: 'Bob Collector', userType: 'collector', location: { latitude: 28.5355, longitude: 77.3910 } }, // Noida
        { id: 'gen2', email: 'testgen@example.com', name: 'Charlie Gen', userType: 'generator', location: { latitude: 28.4595, longitude: 77.0266 } }, // Gurgaon
        { id: 'buyer1', email: 'buyer@example.com', name: 'Diana Buyer', userType: 'generator', location: { latitude: 28.6000, longitude: 77.0500 } }, // Another generator/buyer
      ];
      setUsers(dummyUsers);

      // More comprehensive Dummy Waste Listings with new fields
      const dummyListings: WasteListing[] = [
        {
          id: 'wl1', userId: 'gen1', wasteType: 'Vegetable Peels', quantity: '2', unit: 'kg', description: 'Fresh kitchen waste, suitable for composting',
          location: { latitude: 27.1751, longitude: 78.0421, address: 'Taj Ganj, Agra' }, status: 'pending', createdAt: Date.now() - 86400000 * 2,
          itemType: 'waste', wasteCategory: 'biodegradable', imageUrl: 'https://placehold.co/400x300/a8e6cf/000000?text=Biodegradable+Waste'
        },
        {
          id: 'wl2', userId: 'gen1', wasteType: 'Plastic Bottles (PET)', quantity: '500', unit: 'grams', description: 'Clean, crushed plastic bottles',
          location: { latitude: 27.1800, longitude: 77.9900, address: 'Sikandra Road, Agra' }, status: 'assigned', assignedCollectorId: 'col1', createdAt: Date.now() - 86400000 * 3,
          itemType: 'waste', wasteCategory: 'non_biodegradable', imageUrl: 'https://placehold.co/400x300/87ceeb/000000?text=Plastic+Bottles',
          comments: [{ id: 'c1', userId: 'col1', userName: 'Bob Collector', text: 'On my way to pick this up!', createdAt: Date.now() - 86400000 * 0.5 }]
        },
        {
          id: 'wl3', userId: 'gen2', wasteType: 'Old Newspapers', quantity: '10', unit: 'kg', description: 'Bundle of old newspapers and magazines',
          location: { latitude: 27.2000, longitude: 77.9800, address: 'Civil Lines, Agra' }, status: 'pending', createdAt: Date.now() - 86400000 * 1,
          itemType: 'old_item', wasteCategory: 'recyclable_paper', imageUrl: 'https://placehold.co/400x300/ffd700/000000?text=Old+Newspapers', price: 150,
          comments: [{ id: 'c2', userId: 'buyer1', userName: 'Diana Buyer', text: 'Interested! Can I pick up tomorrow?', createdAt: Date.now() - 86400000 * 0.2 }]
        },
        {
          id: 'wl4', userId: 'gen1', wasteType: 'Used Batteries', quantity: '1', unit: 'bag', description: 'Assorted used AA/AAA batteries',
          location: { latitude: 27.1950, longitude: 78.0100, address: 'Agra Cantt, Agra' }, status: 'completed', assignedCollectorId: 'col1', createdAt: Date.now() - 86400000 * 5, completedAt: Date.now() - 86400000 * 4,
          itemType: 'waste', wasteCategory: 'hazardous', imageUrl: 'https://placehold.co/400x300/ff6347/000000?text=Used+Batteries'
        },
        {
          id: 'wl5', userId: 'gen2', wasteType: 'Old Sofa', quantity: '1', unit: 'unit', description: '3-seater sofa, good condition, needs new cover.',
          location: { latitude: 27.1600, longitude: 78.0300, address: 'Taj East Gate, Agra' }, status: 'pending', createdAt: Date.now() - 86400000 * 0.8,
          itemType: 'old_item', imageUrl: 'https://placehold.co/400x300/8b4513/ffffff?text=Old+Sofa', price: 1500,
        },
        {
          id: 'wl6', userId: 'gen1', wasteType: 'Mixed Food Waste', quantity: '3', unit: 'kg', description: 'Daily kitchen scraps and leftover food',
          location: { latitude: 27.1700, longitude: 78.0000, address: 'Agra Fort Area, Agra' }, status: 'pending', createdAt: Date.now() - 86400000 * 0.1,
          itemType: 'waste', wasteCategory: 'biodegradable', imageUrl: 'https://placehold.co/400x300/98fb98/000000?text=Food+Waste'
        },
      ];
      setWasteListings(dummyListings);

      // Check for a "logged in" user in sessionStorage (for persistence across refresh)
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        // If no user is stored, default to no user logged in
        setCurrentUser(null);
      }
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true); // Indicate loading for login process
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    const foundUser = users.find(u => u.email === email && password === 'password'); // Dummy password
    if (foundUser) {
      setCurrentUser(foundUser);
      sessionStorage.setItem('currentUser', JSON.stringify(foundUser)); // Store user
      setLoading(false);
      console.log('Login successful:', foundUser.name);
      return true;
    } else {
      setLoading(false); // End loading even if login fails
      console.log('Login failed: Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser'); // Clear stored user
    setLoading(false); // Reset loading state
    console.log('User logged out.');
  };

  const assignCollectorToListing = async (listingId: string, collectorId: string) => {
    setWasteListings(prev => prev.map(l =>
      l.id === listingId ? { ...l, status: 'assigned', assignedCollectorId: collectorId } : l
    ));
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Listing ${listingId} assigned to collector ${collectorId}`);
  };

  const completeListing = async (listingId: string) => {
    setWasteListings(prev => prev.map(l =>
      l.id === listingId ? { ...l, status: 'completed', completedAt: Date.now() } : l
    ));
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Listing ${listingId} marked as completed.`);
  };

  const createWasteListing = async (newListingPartial: Omit<WasteListing, 'id' | 'createdAt' | 'status' | 'comments' | 'assignedCollectorId' | 'completedAt'>): Promise<WasteListing> => {
    const id = `wl${wasteListings.length + 1}-${Date.now()}`;
    const fullListing: WasteListing = {
      ...newListingPartial,
      id,
      createdAt: Date.now(),
      status: 'pending', // Default status for new listings
      comments: [], // Initialize comments array
      assignedCollectorId: undefined,
      completedAt: undefined,
    };
    setWasteListings(prev => [...prev, fullListing]);
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Waste listing created:', fullListing);
    return fullListing;
  };

  const addCommentToListing = async (listingId: string, newCommentPartial: Omit<Comment, 'id' | 'createdAt'>) => {
    const commentId = `comm${Date.now()}`;
    const fullComment: Comment = {
      ...newCommentPartial,
      id: commentId,
      createdAt: Date.now(),
    };

    setWasteListings(prev =>
      prev.map(listing =>
        listing.id === listingId
          ? { ...listing, comments: [...(listing.comments || []), fullComment] }
          : listing
      )
    );
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Comment added to listing ${listingId}:`, fullComment);
  };


  // Dummy signup function implementation
  const signup = async (user: Omit<User, 'id'>): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
      setLoading(false);
      console.log('Signup failed: Email already exists');
      return false;
    }
    const newUser: User = {
      ...user,
      id: `user${users.length + 1}-${Date.now()}`,
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    setLoading(false);
    console.log('Signup successful:', newUser.name);
    return true;
  };

  const value: DataContextType = {
    currentUser,
    loading,
    wasteListings,
    users,
    login,
    signup,
    logout,
    assignCollectorToListing,
    completeListing,
    createWasteListing,
    addCommentToListing,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};