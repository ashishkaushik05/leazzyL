// Property utilities for working with Firestore
import { db } from '@/firebaseConfig';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  getDoc,
  doc,
  orderBy,
  limit,
  startAfter,
  documentSnapshot
} from 'firebase/firestore';
import { COLLECTIONS } from './firestoreDb';

/**
 * Get all properties with pagination
 * 
 * @param {number} pageSize - Number of properties per page
 * @param {DocumentSnapshot} startAfterDoc - Document to start after for pagination
 * @param {object} filters - Optional filters like location, price range, etc.
 * @returns {array} Array of properties and the last document for pagination
 */
export const getProperties = async (
  pageSize = 10,
  startAfterDoc = null,
  filters = {}
) => {
  try {
    // Start building the query
    let propertiesQuery = collection(db, COLLECTIONS.PROPERTIES);
    let queryConstraints = [orderBy('createdAt', 'desc')];
    
    // Add filters if provided
    if (filters.location) {
      queryConstraints.push(where('location', '==', filters.location));
    }
    
    if (filters.minPrice && filters.maxPrice) {
      // For price range filters, we need to use price field directly
      queryConstraints.push(where('price', '>=', filters.minPrice));
      queryConstraints.push(where('price', '<=', filters.maxPrice));
    }
    
    if (filters.bedrooms) {
      queryConstraints.push(where('bedrooms', '>=', filters.bedrooms));
    }
    
    if (filters.ownerId) {
      queryConstraints.push(where('ownerId', '==', filters.ownerId));
    }
    
    // Add pagination
    queryConstraints.push(limit(pageSize));
    if (startAfterDoc) {
      queryConstraints.push(startAfter(startAfterDoc));
    }
    
    // Execute the query
    const q = query(propertiesQuery, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    // Process the results
    const properties = [];
    let lastDoc = null;
    
    querySnapshot.forEach((doc) => {
      properties.push({
        id: doc.id,
        ...doc.data()
      });
      lastDoc = doc;
    });
    
    // If we have location-based filtering, we need to filter results post-query
    // since Firestore doesn't support geospatial queries directly
    if (filters.nearLocation) {
      const { latitude, longitude, radiusKm } = filters.nearLocation;
      
      // Helper function to calculate distance between two coordinates using Haversine formula
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return R * c;
      };
      
      // Filter properties within the radius
      const filteredProperties = properties.filter(property => {
        if (!property.latitude || !property.longitude) return false;
        
        const distance = calculateDistance(
          latitude, 
          longitude, 
          property.latitude, 
          property.longitude
        );
        
        // Add the calculated distance to the property object
        property.distanceKm = parseFloat(distance.toFixed(1));
        
        return distance <= radiusKm;
      });
      
      // Sort by distance
      filteredProperties.sort((a, b) => a.distanceKm - b.distanceKm);
      
      // Update location display for each property
      filteredProperties.forEach(property => {
        property.location = `${property.distanceKm} km away`;
      });
      
      return { properties: filteredProperties, lastDoc };
    }
    
    return { properties, lastDoc };
  } catch (error) {
    console.error('Error getting properties:', error);
    throw error;
  }
};

/**
 * Get properties by owner ID
 * 
 * @param {string} ownerId - ID of the property owner
 * @returns {array} Array of properties owned by the user
 */
export const getPropertiesByOwner = async (ownerId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROPERTIES),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const properties = [];
    
    querySnapshot.forEach((doc) => {
      properties.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return properties;
  } catch (error) {
    console.error('Error getting properties by owner:', error);
    throw error;
  }
};

/**
 * Get temp properties by owner ID
 * 
 * @param {string} ownerId - ID of the property owner
 * @returns {array} Array of temp properties owned by the user
 */
export const getTempPropertiesByOwner = async (ownerId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.TEMP_PROPERTIES),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const properties = [];
    
    querySnapshot.forEach((doc) => {
      properties.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return properties;
  } catch (error) {
    console.error('Error getting temp properties by owner:', error);
    throw error;
  }
};

/**
 * Search properties by keyword in title or description
 * 
 * @param {string} keyword - Search keyword
 * @returns {array} Array of matching properties
 */
export const searchProperties = async (keyword) => {
  try {
    // Note: Firestore doesn't support native full-text search
    // For a production app, consider using Algolia, Elasticsearch, or Firebase Extensions
    
    // This is a simple implementation - for full text search, a different approach would be needed
    const propertiesSnapshot = await getDocs(collection(db, COLLECTIONS.PROPERTIES));
    const properties = [];
    
    propertiesSnapshot.forEach((doc) => {
      const data = doc.data();
      const title = data.title?.toLowerCase() || '';
      const description = data.description?.toLowerCase() || '';
      const location = data.location?.toLowerCase() || '';
      
      if (
        title.includes(keyword.toLowerCase()) || 
        description.includes(keyword.toLowerCase()) ||
        location.includes(keyword.toLowerCase())
      ) {
        properties.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    return properties;
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
};
