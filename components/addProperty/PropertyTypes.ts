// Define the property data structure for the property upload flow
export interface PropertyData {
  // Basic info
  propertyType?: string; // 1BHK, 2BHK, 3BHK, 1RK/PG
  bedCount?: number;
  
  // Amenities
  kitchens?: number;
  bathrooms?: number;
  balconies?: number;
  
  // Additional amenities
  amenities?: {
    wifi?: boolean;
    ac?: boolean;
    fridge?: boolean;
    tv?: boolean;
    washingMachine?: boolean;
    parking?: boolean;
    elevator?: boolean;
    security?: boolean;
    gym?: boolean;
    swimmingPool?: boolean;
    // Add more as needed
  };
  
  // Location
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  
  // Pricing
  rent?: number;
  securityDeposit?: number;
  maintenanceFee?: number;
  
  // Photos
  photos?: string[]; // URLs of uploaded photos
  
  // Description
  title?: string;
  description?: string;
  
  // Rules and restrictions
  rules?: {
    petsAllowed?: boolean;
    smokingAllowed?: boolean;
    familiesOnly?: boolean;
    bachelorsAllowed?: boolean;
    // Add more as needed
  };
  
  // Contact info
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  
  // Status
  isAvailable?: boolean;
  availableFrom?: string; // ISO date string
}

// Default values for the property data
export const defaultPropertyData: PropertyData = {
  amenities: {},
  rules: {},
  photos: [],
  isAvailable: true
};