// src/types/index.ts



export type WasteStatus = 'pending' | 'assigned' | 'completed';
export type Location = {
  latitude: number;
  longitude: number;
};

export type WasteListingLocation = { // This is the type WasteMap expects
  id: string;
  location: Location; // It has a 'location' property which is the 'Location' type
  status: 'pending' | 'assigned' | 'completed';
  wasteType: string;
  quantity: string;
  description?: string;
  createdAt: string;
  userId: string;
};
export interface User {
  id: string;
  email: string;
  name?: string; // Optional for name if not always provided
  userType: 'generator' | 'collector';
  // Add any other user properties like profile picture, location, etc.
}

export interface WasteListing {
  id: string;
  userId: string; // ID of the waste generator
  wasteType: string; // e.g., "Plastic", "Organic", "Paper"
  quantity: string; // e.g., "5 kg", "2 large bags"
   unit: string; 
  location: string; // Pickup location
  description?: string; // Optional detailed description
  status: 'pending' | 'assigned' | 'completed';
  assignedCollectorId?: string; // ID of the collector if assigned
  createdAt: number; // Timestamp of creation (Date.now())
  // Add coordinates if you plan to use maps
  latitude?: number;
  longitude?: number;
}

// DataContext types
export interface DataContextType {
  currentUser: User | null;
  loading: boolean;
  wasteListings: WasteListing[];
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id'> & { password?: string }) => Promise<boolean>;
  logout: () => void;
  createWasteListing: (newListing: Omit<WasteListing, 'id' | 'status' | 'createdAt' | 'userId'>) => Promise<boolean>;
  assignCollectorToListing: (listingId: string, collectorId: string) => Promise<boolean>;
  completeListing: (listingId: string) => Promise<boolean>;
}