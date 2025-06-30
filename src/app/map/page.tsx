// src/app/map/page.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import WasteMap from '../../components/map/WasteMap';
import ListingDetailPanel from '../../components/map/MapList';
import { WasteListingLocation, ItemType, WasteCategory } from '../../types';
import { useData } from '../../contexts/DataContext';

import { FaSpinner, FaSearch, FaFilter, FaPlusCircle } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRecycle,
  faLeaf,
  faBoxesPacking,
  faBatteryFull,
  faExclamationTriangle,
  faLightbulb,
  faArchive,
} from '@fortawesome/free-solid-svg-icons';

import styles from './map-page.module.css';

interface WasteCountCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconColor?: string;
}

const WasteCountCard: React.FC<WasteCountCardProps> = ({
  label,
  value,
  icon,
  iconColor,
}) => (
  <div className={styles.countCard}>
    <span className={styles.countIcon} style={{ color: iconColor }}>{icon}</span>
    <span className={styles.countLabel}>{label}</span>
    <span className={styles.countValue}>{value}</span>
  </div>
);

export default function MapPage() {
  const { currentUser, loading: dataContextLoading, wasteListings, users } = useData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFocusListingIdRef = useRef<string | null>(null);

  const [mapLocations, setMapLocations] = useState<WasteListingLocation[]>([]);
  const [loadingMapData, setLoadingMapData] = useState(true);
  const [errorMapData, setErrorMapData] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<WasteCategory | ItemType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState<WasteListingLocation | null>(null);

  useEffect(() => {
    const id = searchParams.get('listingId');
    if (id) initialFocusListingIdRef.current = id;
  }, [searchParams]);

  useEffect(() => {
    if (!dataContextLoading && !currentUser) {
      router.push('/auth/login');
    }
  }, [dataContextLoading, currentUser, router]);

  useEffect(() => {
    if (!dataContextLoading) {
      if (wasteListings) {
        const transformed = wasteListings.map(l => ({ ...l, comments: l.comments || [] }));
        setMapLocations(transformed);
        setLoadingMapData(false);

        const id = initialFocusListingIdRef.current;
        if (id && !selectedListing) {
          const found = transformed.find(l => l.id === id);
          if (found) setSelectedListing(found);
          initialFocusListingIdRef.current = null;
        }
      } else {
        setLoadingMapData(false);
        setErrorMapData("Could not load waste listings.");
      }
    }
  }, [dataContextLoading, wasteListings, selectedListing]);

  const filteredLocations = useMemo(() => {
    let list = mapLocations;
    if (selectedFilter !== 'all') {
      list = selectedFilter === 'waste'
        ? list.filter(l => l.itemType === 'waste')
        : selectedFilter === 'old_item'
          ? list.filter(l => l.itemType === 'old_item')
          : list.filter(l =>
              l.itemType === 'waste' && l.wasteCategory === selectedFilter
            );
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(l =>
        l.wasteType.toLowerCase().includes(term) ||
        l.description?.toLowerCase().includes(term) ||
        l.location.address?.toLowerCase().includes(term) ||
        l.location.city?.toLowerCase().includes(term)
      );
    }
    return list;
  }, [mapLocations, selectedFilter, searchTerm]);

  const totalCounts = useMemo(() => {
    const counts = {} as Record<string, { count: number; quantity: number; unit: string }>;
    filteredLocations.forEach(l => {
      let key: string | null = null;
      if (l.itemType === 'waste' && l.wasteCategory) key = l.wasteCategory;
      else if (l.itemType === 'old_item') key = 'old_item';
      if (!key) return;

      if (!counts[key]) {
        counts[key] = {
          count: 0,
          quantity: 0,
          unit: l.unit || 'units',
        };
      }
      counts[key].count++;
      counts[key].quantity += parseFloat(l.quantity.split(' ')[0]) || 0;
      counts[key].unit = l.unit || (l.quantity.split(' ').slice(1).join(' ') || 'units');
    });
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
  }, [filteredLocations]);

  const getIcon = (key: string): React.ReactNode => {
    switch (key) {
      case 'biodegradable': return <FontAwesomeIcon icon={faLeaf} />;
      case 'non_biodegradable': return <FontAwesomeIcon icon={faRecycle} />;
      case 'recyclable_plastic':
      case 'recyclable_paper': return <FontAwesomeIcon icon={faBoxesPacking} />;
      case 'recyclable_metal': return <FontAwesomeIcon icon={faRecycle} />;
      case 'e_waste': return <FontAwesomeIcon icon={faBatteryFull} />;
      case 'hazardous': return <FontAwesomeIcon icon={faExclamationTriangle} />;
      case 'old_item': return <FontAwesomeIcon icon={faLightbulb} />;
      default: return <FontAwesomeIcon icon={faRecycle} />;
    }
  };

  const getColor = (key: string): string =>
    ({
      biodegradable: '#4CAF50',
      non_biodegradable: '#2196F3',
      recyclable_plastic: '#FFC107',
      recyclable_paper: '#9C27B0',
      recyclable_metal: '#795548',
      e_waste: '#607D8B',
      hazardous: '#F44336',
      old_item: '#FF9800',
    }[key] || '#333');

  const handleMarkerClick = useCallback((loc: WasteListingLocation) => {
    setSelectedListing(loc);
    window.history.pushState(null, '', `/map?listingId=${loc.id}`);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedListing(null);
    window.history.replaceState(null, '', '/map');
  }, []);

  const handleNew = useCallback(() => router.push('/list-waste'), [router]);

  if (dataContextLoading || loadingMapData) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading map data...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={styles.unauthorizedContainer}>
        <h1>Access Denied</h1>
        <p>Please log in to view</p>
        <button
          onClick={() => router.push('/auth/login')}
          className={styles.loginRedirectButton}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.mapPageContainer}>
      <header className={styles.mapHeader}>
        <h1 className={styles.mapTitle}>Waste & Reusable Item Map</h1>
        <p className={styles.mapSubtitle}>Discover listings around you.</p>
      </header>

      <div className={styles.mapContentWrapper}>
        <div className={styles.sidebar}>
          <div className={styles.controlsSection}>
            <div className={styles.searchBar}>
              <FaSearch className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                placeholder="Search..."
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.filterDropdown}>
              <label htmlFor="category-filter">
                <FaFilter /> Filter:
              </label>
              <select
                id="category-filter"
                className={styles.selectInput}
                value={selectedFilter}
                onChange={e => setSelectedFilter(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="waste">Waste</option>
                <option value="old_item">Old Items</option>
                {/* Add rest of the categories */}
              </select>
            </div>

            <button className={styles.addWasteButton} onClick={handleNew}>
              <FaPlusCircle /> List New Waste
            </button>
          </div>

          <h3 className={styles.sidebarTitle}>Total Quantities</h3>
          <div className={styles.wasteCounts}>
            {Object.entries(totalCounts).length === 0 ? (
              <p>No items under current filters.</p>
            ) : (
              Object.entries(totalCounts).map(([key, d]) => (
                <WasteCountCard
                  key={key}
                  label={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  value={`${d.quantity} ${d.unit}`}
                  icon={getIcon(key)}
                  iconColor={getColor(key)}
                />
              ))
            )}
          </div>
        </div>

        <div className={styles.mapSection}>
          {errorMapData && <p className={styles.errorMessage}>{errorMapData}</p>}
          {filteredLocations.length === 0 && (
            <p className={styles.noListingsMessage}>
              {searchTerm || selectedFilter !== 'all' ? 'No matches found.' : 'No listings available.'}
            </p>
          )}
          <WasteMap
            locations={filteredLocations}
            onMarkerClick={handleMarkerClick}
            focusListingId={selectedListing?.id || initialFocusListingIdRef.current}
          />
        </div>
      </div>

      <ListingDetailPanel
        listing={selectedListing}
        currentUser={currentUser}
        users={users}
        onClose={handleClose}
        onUpdateListingStatus={async (...args) => {
          console.log('Update status placeholder:', args);
          alert('Implement update logic.');
        }}
      />
    </div>
  );
}
