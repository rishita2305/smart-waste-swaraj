// src/components/map/WasteMap.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ScaleControl } from 'react-leaflet';
import L, { Map } from 'leaflet';
// FaMapMarkerAlt is not directly used in custom marker HTML, but kept if needed elsewhere
import { FaMapMarkerAlt } from 'react-icons/fa'; // Retain FaMapMarkerAlt import for consistency, though SVG is hardcoded
import { WasteListingLocation, User, WasteStatus } from '../../types'; // Ensure correct imports
import styles from './waste-map.module.css'; // Import module CSS

// Define the colors for the custom markers (ensure these match your globals.css variables)
const statusColors = {
  pending: 'var(--status-pending, #FFC107)',   // Yellow/Orange, with fallback
  assigned: 'var(--status-assigned, #2196F3)',  // Blue, with fallback
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
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (mapRef.current && locations.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      const listingIdFromUrl = searchParams.get('listingId');
      const preSelectedLocation = locations.find(loc => loc.id === listingIdFromUrl);

      if (preSelectedLocation) {
        mapRef.current.setView([preSelectedLocation.location.latitude, preSelectedLocation.location.longitude], 13);
      } else {
        if (locations.length > 0) {
          const bounds = L.latLngBounds(locations.map(loc => [loc.location.latitude, loc.location.longitude]));
          mapRef.current.fitBounds(bounds.pad(0.2));
        }
      }
    } else if (mapRef.current && locations.length === 0 && initialViewState) {
      mapRef.current.setView([initialViewState.latitude, initialViewState.longitude], initialViewState.zoom);
    }
  }, [locations, initialViewState]);

  const defaultCenter: [number, number] = [27.1767, 78.0081]; // Agra, India coordinates
  const defaultZoom = 10;

  return (
    <MapContainer
      center={initialViewState ? [initialViewState.latitude, initialViewState.longitude] : defaultCenter}
      zoom={initialViewState?.zoom || defaultZoom}
      scrollWheelZoom={true}
      className={styles.mapContainer}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ScaleControl position="bottomleft" imperial={false} metric={true} />

      {locations.map((loc) => {
        let markerIcon: L.DivIcon;
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
            markerIcon = pendingIcon;
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
                <h4 className={styles.popupTitle}>
                  {loc.itemType === 'waste' ? loc.wasteType : `Old Item: ${loc.wasteType}`}
                </h4>
                <p className={styles.popupDescription}>
                  Quantity: {loc.quantity} {loc.unit}
                  {loc.price !== undefined && loc.itemType === 'old_item' && ` - Price: ₹${loc.price.toFixed(2)}`}
                </p>
                <p className={styles.popupDescription}>
                  {loc.description || 'No description provided.'}
                </p>
                <p className={`${styles.popupStatus} ${
                  loc.status === 'pending' ? styles.statusPending :
                  loc.status === 'assigned' ? styles.statusAssigned :
                  styles.statusCompleted
                }`}>Status: {loc.status.charAt(0).toUpperCase() + loc.status.slice(1)}</p>
                {loc.imageUrl && (
                  <img src={loc.imageUrl} alt={loc.wasteType} className={styles.popupImage} onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x75/e0e0e0/555555?text=No+Img'; }} />
                )}
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