// src/components/map/WasteMap.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ScaleControl } from 'react-leaflet';
import L, { Map } from 'leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { WasteListing, WasteListingLocation, User  } from '../../types'; // CORRECTED: Import from src/types
import styles from './waste-map.module.css'; // Import module CSS

// This custom icon creation completely bypasses Leaflet's default image loading for markers.
const createCustomMarkerIcon = (color: string) => {
  return L.divIcon({
    html: `<div class="${styles.customMapMarker}" style="color: ${color};"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" class="svg-inline--fa fa-map-marker-alt fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="fill: currentColor;"><path d="M172.268 501.67C26.177 348.659 0 327.97 0 240C0 107.453 107.453 0 240 0s240 107.453 240 240c0 87.97-26.177 108.659-172.268 259.67-16.483 24.908-43.208 24.908-59.69 0zM240 272c-22.091 0-40-17.909-40-40s17.909-40 40-40s40 17.909 40 40s-17.909 40-40 40z"></path></svg></div>`,
    className: '', // Crucial: Set to empty string to avoid Leaflet's default marker icon classes (which have background images)
    iconSize: [30, 42], // Approximate size of your icon
    iconAnchor: [15, 42], // Point of the icon that corresponds to the marker's location
    popupAnchor: [0, -40] // Point from which the popup should open relative to the iconAnchor
  });
};

// Define icons based on status using the custom creator
const pendingIcon = createCustomMarkerIcon('var(--status-pending)');
const assignedIcon = createCustomMarkerIcon('var(--status-assigned)');
const completedIcon = createCustomMarkerIcon('var(--status-completed)');

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
        const bounds = L.latLngBounds(locations.map(loc => [loc.location.latitude, loc.location.longitude]));
        mapRef.current.fitBounds(bounds.pad(0.2));
      }
    }
  }, [locations, initialViewState]);

  return (
    <MapContainer
      center={initialViewState ? [initialViewState.latitude, initialViewState.longitude] : [27.1767, 78.0081]} // Default to Agra
      zoom={initialViewState?.zoom || 10}
      scrollWheelZoom={true}
      className={styles.mapContainer} // Apply module class
      ref={(node) => {
        // node is a Leaflet Map instance or null
        // @ts-ignore: MapContainer's ref is not typed correctly or requires explicit type
        if (node) {
          // @ts-ignore
          mapRef.current = node;
        }
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ScaleControl position="bottomleft" imperial={false} metric={true} />

      {locations.map((loc) => {
        let markerIcon;
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
            markerIcon = pendingIcon; // Fallback
        }

        return (
          <Marker
            key={loc.id}
            position={[loc.location.latitude, loc.location.longitude]} // CORRECTED: Access location.latitude/longitude
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
                }`}>Status: {loc.status}</p>
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