// src/app/map/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import WasteMap from '../../components/map/WasteMap';
import MapControls from '../../components/map/MapControls';
import ListingDetailPanel from '../../components/map/MapList';
import { WasteListingLocation, ItemType, WasteCategory } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import styles from './map-page.module.css'; // NEW: Import module CSS for MapPage layout

// Removed metadata export because it's not allowed in client components.

export default function MapPage() {
  const { currentUser, loading: dataContextLoading, wasteListings, users } = useData();
  const router = useRouter();

  const [mapLocations, setMapLocations] = useState<WasteListingLocation[]>([]);
  const [loadingMapData, setLoadingMapData] = useState(true);
  const [errorMapData, setErrorMapData] = useState<string | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<WasteCategory | ItemType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState<WasteListingLocation | null>(null);

  // Redirect if not authenticated (or if a specific user type is required for map access)
  useEffect(() => {
    if (!dataContextLoading && !currentUser) {
      router.push('/auth/login');
    }
  }, [currentUser, dataContextLoading, router]);

  // Effect to populate mapLocations from DataContext's wasteListings
  useEffect(() => {
    if (!dataContextLoading && wasteListings) { // Ensure wasteListings is not null/undefined
      const transformedLocations: WasteListingLocation[] = wasteListings.map(listing => ({
        id: listing.id,
        userId: listing.userId,
        wasteType: listing.wasteType,
        quantity: listing.quantity,
        unit: listing.unit,
        description: listing.description,
        status: listing.status,
        location: listing.location,
        itemType: listing.itemType,
        wasteCategory: listing.wasteCategory,
        imageUrl: listing.imageUrl,
        price: listing.price,
        assignedCollectorId: listing.assignedCollectorId,
        createdAt: listing.createdAt,
        comments: listing.comments || [], // Ensure comments array exists
      }));
      setMapLocations(transformedLocations);
      setLoadingMapData(false);
    } else if (!dataContextLoading && !wasteListings) {
      // Handle case where wasteListings might be explicitly null/undefined if data fetching failed
      setLoadingMapData(false);
      setErrorMapData("Could not load waste listings.");
    }
  }, [dataContextLoading, wasteListings]);

  // Filter and search logic
  const filteredLocations = useMemo(() => {
    let filtered = mapLocations;

    // Apply category filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'biodegradable' || selectedFilter === 'non_biodegradable' ||
          selectedFilter === 'recyclable_plastic' || selectedFilter === 'recyclable_paper' ||
          selectedFilter === 'recyclable_metal' || selectedFilter === 'e_waste' ||
          selectedFilter === 'hazardous' || selectedFilter === 'other') {
        filtered = filtered.filter(loc => loc.itemType === 'waste' && loc.wasteCategory === selectedFilter);
      } else if (selectedFilter === 'old_item') {
        filtered = filtered.filter(loc => loc.itemType === 'old_item');
      } else if (selectedFilter === 'waste') { // Explicitly filter only for 'waste' type
        filtered = filtered.filter(loc => loc.itemType === 'waste');
      }
    }

    // Apply search term
    if (searchTerm.trim()) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(loc =>
        loc.wasteType.toLowerCase().includes(lowerCaseSearchTerm) ||
        loc.description?.toLowerCase().includes(lowerCaseSearchTerm) ||
        loc.location.address?.toLowerCase().includes(lowerCaseSearchTerm) ||
        loc.location.city?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return filtered;
  }, [mapLocations, selectedFilter, searchTerm]);

  const handleMarkerClick = (location: WasteListingLocation) => {
    setSelectedListing(location);
  };

  const handleCloseDetailPanel = () => {
    setSelectedListing(null);
  };

  const handleListNewWaste = () => {
    router.push('/list-waste');
  };

  // Overall loading state for the page
  if (dataContextLoading || loadingMapData || !currentUser) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading Map and Data...</p>
      </div>
    );
  }

  // Handle unauthorized access (if user is null after loading)
  if (!currentUser) {
    return (
      <div className={styles.unauthorizedContainer}>
        <h1>Access Denied</h1>
        <p>Please log in to view the Waste Map.</p>
        <button className={styles.loginRedirectButton} onClick={() => router.push('/auth/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className={styles.mapPageContainer}>
      <h1 className={styles.pageTitle}>Waste & Item Map</h1>
      <p className={styles.pageSubtitle}>
        Discover waste collection points and reusable items in your area.
      </p>

      {/* Map Controls */}
      <MapControls
        onSearch={setSearchTerm}
        onFilterCategory={setSelectedFilter}
        selectedFilter={selectedFilter}
        onListNewWaste={handleListNewWaste}
      />

      {errorMapData && (
        <div className={styles.errorMessage}>
          <p>Error: {errorMapData}</p>
        </div>
      )}

      {/* Main Map Component */}
      <div className={styles.mapWrapper}>
        {filteredLocations.length === 0 && searchTerm === '' && selectedFilter === 'all' && !loadingMapData && (
          <div className={styles.noListingsMessage}>
            <p>No waste listings available. Be the first to list!</p>
          </div>
        )}
        {filteredLocations.length === 0 && (searchTerm !== '' || selectedFilter !== 'all') && !loadingMapData && (
          <div className={styles.noListingsMessage}>
            <p>No listings match your current filters or search term.</p>
          </div>
        )}
        <WasteMap locations={filteredLocations} onMarkerClick={handleMarkerClick} />
      </div>

      {/* Listing Detail Panel (Modal/Sidebar) */}
      <ListingDetailPanel
        listing={selectedListing}
        currentUser={currentUser}
        users={users}
        onClose={handleCloseDetailPanel}
      />
    </div>
  );
}