// src/app/list-waste/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '../../contexts/DataContext';
import { WasteListing, User, Location } from '../../types'; // Corrected: Import Location if you prefer to use its type directly
import { FaPlusCircle, FaMapMarkerAlt, FaSpinner, FaTimesCircle } from 'react-icons/fa';

export default function ListWastePage() {
  const { currentUser, loading: dataContextLoading, createWasteListing } = useData();
  const router = useRouter();

  const [wasteType, setWasteType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  // Use the 'Location' type from src/types.ts for better consistency and readability
  const [location, setLocation] = useState<Location | null>(null);
  const [errorMessage, setErrorMessage] = useState(''); // Unified error message state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');


  useEffect(() => {
    // Redirect if not loaded or not logged in, or not a generator
    if (!dataContextLoading && (!currentUser || currentUser.userType !== 'generator')) {
      router.push('/auth/login');
    }
  }, [currentUser, dataContextLoading, router]);

  const fetchCurrentLocation = () => {
    setErrorMessage(''); // Clear previous errors
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser. Please enter location manually if an alternative is provided or contact support.');
      setLocationStatus('error');
      return;
    }

    setLocationStatus('fetching');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('success');
        setErrorMessage(''); // Clear location-specific error
      },
      (geoError) => {
        console.error('Geolocation error:', geoError);
        let msg = 'Unable to retrieve your location. ';
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            msg += 'Please grant location access in your browser settings.';
            break;
          case geoError.POSITION_UNAVAILABLE:
            msg += 'Location information is unavailable.';
            break;
          case geoError.TIMEOUT:
            msg += 'The request to get user location timed out.';
            break;
          default:
            msg += 'An unknown error occurred.';
        }
        setErrorMessage(msg);
        setLocationStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Options for geolocation
    );
  };

  const handleClearLocation = () => {
    setLocation(null);
    setLocationStatus('idle');
    setErrorMessage(''); // Clear error when location is cleared
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Clear general error message

    if (!currentUser) {
      setErrorMessage('You must be logged in to list waste.');
      router.push('/auth/login'); // Ensure immediate redirect logic
      return;
    }

    if (!location) {
      setErrorMessage('Please provide a location for the waste.');
      return;
    }

    if (!wasteType.trim() || !quantity.trim()) { // Trim to check for empty strings
      setErrorMessage('Waste Type and Quantity are required.');
      return;
    }

    setIsSubmitting(true);

    const newListing: Omit<WasteListing, 'id' | 'createdAt' | 'status'> = {
      userId: currentUser.id,
      wasteType,
      quantity,
      description: description.trim(), // Trim description
      location: JSON.stringify(location), // Serialize location object to string
    };

    try {
      await createWasteListing(newListing);
      console.log('Waste listing created successfully!'); // Log success
      router.push('/dashboard'); // Redirect to dashboard after successful listing
    } catch (submitError) {
      console.error('Failed to create waste listing:', submitError);
      setErrorMessage('Failed to create waste listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading state while data context is loading or user is being redirected
  if (dataContextLoading || (!currentUser && !dataContextLoading) || (currentUser && currentUser.userType !== 'generator' && !dataContextLoading)) {
    return (
      <div className="loader">
        <FaSpinner className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="list-waste-container">
      <h1 className="list-waste-title">List New Waste</h1>
      <form onSubmit={handleSubmit} className="form"> {/* 'form' class for general form styling */}
        <div className="form-group">
          <label htmlFor="wasteType" className="form-label">Waste Type</label>
          <input
            type="text"
            id="wasteType"
            className="form-input"
            placeholder="e.g., Plastic Bottles, Organic Waste"
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="text"
            id="quantity"
            className="form-input"
            placeholder="e.g., 5 kg, 2 bags, 1 unit"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description (Optional)</label>
          <textarea
            id="description"
            className="form-textarea"
            rows={3}
            placeholder="Any specific details about the waste (e.g., mixed, soiled, fragile)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Waste Location</label>
          {!location ? (
            <button
              type="button"
              onClick={fetchCurrentLocation}
              className="btn btn-secondary w-full" // Use custom button classes
              disabled={locationStatus === 'fetching'}
            >
              {locationStatus === 'fetching' ? (
                <>
                  <FaSpinner className="spinner mr-2" /> Fetching Location...
                </>
              ) : (
                <>
                  <FaMapMarkerAlt className="mr-2" /> Use Current Location
                </>
              )}
            </button>
          ) : (
            <div className="location-info-box"> {/* Custom class for location info display */}
              <FaMapMarkerAlt />
              <span>
                Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
              </span>
              <button type="button" onClick={handleClearLocation} className="location-clear-btn">
                <FaTimesCircle /> Clear
              </button>
            </div>
          )}
          {locationStatus === 'error' && ( // Show location-specific errors here
            <p className="text-error">{errorMessage}</p>
          )}
        </div>

        {errorMessage && locationStatus !== 'error' && ( // Show general errors here, excluding location-specific ones
          <p className="text-error">{errorMessage}</p>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full mt-6" // Use custom button classes
          disabled={isSubmitting || !location || !wasteType.trim() || !quantity.trim()} // Disable if no location or empty fields
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="spinner mr-2" /> Submitting...
            </>
          ) : (
            <>
              <FaPlusCircle className="mr-2" /> List Waste
            </>
          )}
        </button>
      </form>
    </div>
  );
}