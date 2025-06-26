// src/components/map/WasteMap.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ScaleControl } from 'react-leaflet';
import L, { Map } from 'leaflet';
// FaMapMarkerAlt is not directly used in custom marker HTML, but kept if needed elsewhere
import { FaMapMarkerAlt } from 'react-icons/fa';
import { WasteListingLocation, User, WasteStatus } from '../../types'; // Ensure correct imports
import styles from './waste-map.module.css'; // Import module CSS

// Define the colors for the custom markers
const statusColors = {
  pending: 'var(--status-pending, #FFC107)', // Yellow/Orange, with fallback
  assigned: 'var(--status-assigned, #2196F3)', // Blue, with fallback
  completed: 'var(--status-completed, #4CAF50)', // Green, with fallback
};

// Custom Icon creation
const createCustomMarkerIcon = (color: string) => {
  return L.divIcon({
    html: `<div class="${styles.customMapMarker}" style="color: ${color};">
             <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
               <path d="M172.268 501.67C26.177 348.659 0 327.97 0 240C0 107.453 107.453 0 240 0s240 107.453 240 240c0 87.97-26.177 108.659-172.268 259.67-16.483 24.908-43.208 24.908-59.69 0zM240 272c-22.091 0-40-17.909-40-40s17.909-40 40-40s40 17.909 40 40s-17.909 40-40 40z"></path>
             </svg>
           </div>`,
    className: '', // Crucial: Set to empty string to avoid Leaflet's default marker icon classes
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40]
  });
};

// Memoize icons to prevent re-creation on every render
const pendingIcon = createCustomMarkerIcon(statusColors.pending);
const assignedIcon = createCustomMarkerIcon(statusColors.assigned);
const completedIcon = createCustomMarkerIcon(statusColors.completed);

interface WasteMapProps {
  locations: WasteListingLocation[];
  onMarkerClick?: (location: WasteListingLocation) => void;
  initialViewState?: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}

export default function WasteMap({ locations, onMarkerClick, initialViewState }: WasteMapProps) {
  // Use a more specific type for mapRef
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (mapRef.current && locations.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      const listingIdFromUrl = searchParams.get('listingId');
      const preSelectedLocation = locations.find(loc => loc.id === listingIdFromUrl);

      if (preSelectedLocation) {
        mapRef.current.setView([preSelectedLocation.location.latitude, preSelectedLocation.location.longitude], 13);
        // Optional: Open popup automatically for pre-selected marker
        // You'd need a ref for each Marker and access to its methods
      } else {
        // Only fit bounds if there are locations to fit
        if (locations.length > 0) {
          const bounds = L.latLngBounds(locations.map(loc => [loc.location.latitude, loc.location.longitude]));
          mapRef.current.fitBounds(bounds.pad(0.2)); // Pad to ensure markers aren't right on the edge
        }
      }
    } else if (mapRef.current && locations.length === 0 && initialViewState) {
      // If no locations but initial view state is provided, use that
      mapRef.current.setView([initialViewState.latitude, initialViewState.longitude], initialViewState.zoom);
    }
  }, [locations, initialViewState]); // Depend on locations and initialViewState

  // Default to a suitable center if no initialViewState is provided
  const defaultCenter: [number, number] = [27.1767, 78.0081]; // Agra, India coordinates
  const defaultZoom = 10;

  return (
    <MapContainer
      center={initialViewState ? [initialViewState.latitude, initialViewState.longitude] : defaultCenter}
      zoom={initialViewState?.zoom || defaultZoom}
      scrollWheelZoom={true}
      className={styles.mapContainer}
      // Correct way to assign Leaflet Map instance to ref
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ScaleControl position="bottomleft" imperial={false} metric={true} />

      {locations.map((loc) => {
        let markerIcon: L.DivIcon; // Specify type

        switch (loc.status) {
          case 'pending':
            markerIcon = pendingIcon;
            break;
          case 'assigned':
            markerIcon = assignedIcon;
            break;
          case 'completed':
            markerIcon = completedIcon;
            break;
          default:
            markerIcon = pendingIcon; // Fallback for undefined status
        }

        return (
          <Marker
            key={loc.id}
            position={[loc.location.latitude, loc.location.longitude]}
            icon={markerIcon}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(loc);
                }
              },
            }}
          >
            <Popup>
              <div className={styles.popupContent}>
                <h4 className={styles.popupTitle}>{loc.wasteType} - {loc.quantity}</h4>
                <p className={styles.popupDescription}>{loc.description || 'No description provided.'}</p>
                <p className={`${styles.popupStatus} ${
                  loc.status === 'pending' ? styles.statusPending :
                  loc.status === 'assigned' ? styles.statusAssigned :
                  styles.statusCompleted
                }`}>Status: {loc.status.charAt(0).toUpperCase() + loc.status.slice(1)}</p> {/* Capitalize status */}
                <button
                  onClick={() => onMarkerClick && onMarkerClick(loc)}
                  className={styles.popupDetailsButton}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}