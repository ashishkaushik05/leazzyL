// Database seeder for Firebase Firestore
import {
  createUser,
  createProperty,
  getUserByEmail,
  ROLES
} from '@/utils/firestoreDb';
import { Timestamp } from 'firebase/firestore';

// Function to generate random coordinates within a radius
const generateRandomCoordinatesWithinRadius = (centerLat, centerLng, radiusInKm) => {
  // Earth's radius in kilometers
  const earthRadius = 6371;
  
  // Convert radius from kilometers to radians
  const radiusInRad = radiusInKm / earthRadius;
  
  // Generate a random distance within the radius
  const randomDistance = Math.random() * radiusInRad;
  
  // Generate a random angle in radians
  const randomAngle = Math.random() * 2 * Math.PI;
  
  // Convert center coordinates from degrees to radians
  const centerLatRad = centerLat * Math.PI / 180;
  const centerLngRad = centerLng * Math.PI / 180;
  
  // Calculate new latitude in radians
  const newLatRad = Math.asin(
    Math.sin(centerLatRad) * Math.cos(randomDistance) +
    Math.cos(centerLatRad) * Math.sin(randomDistance) * Math.cos(randomAngle)
  );
  
  // Calculate new longitude in radians
  const newLngRad = centerLngRad + Math.atan2(
    Math.sin(randomAngle) * Math.sin(randomDistance) * Math.cos(centerLatRad),
    Math.cos(randomDistance) - Math.sin(centerLatRad) * Math.sin(newLatRad)
  );
  
  // Convert back to degrees
  const newLat = newLatRad * 180 / Math.PI;
  const newLng = newLngRad * 180 / Math.PI;
  
  return { latitude: newLat, longitude: newLng };
};

export const seedDatabase = async (userLocation) => {
  try {
    console.log('Starting database seeding...');
    
    // Use default New York coordinates if user location not provided
    const centerLocation = userLocation || { 
      latitude: 40.7128, 
      longitude: -74.0060 // New York City center
    };
    console.log(`Seeding properties around location: ${centerLocation.latitude}, ${centerLocation.longitude}`);
    
    // Create sample users
    const currentTime = Timestamp.now();
    
    const user1Data = {
      email: 'john@example.com',
      name: 'John Doe',
      phone: '+1234567890',
      profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      role: ROLES.USER,
      createdAt: currentTime,
      updatedAt: currentTime
    };
    
    const user2Data = {
      email: 'jane@example.com',
      name: 'Jane Smith',
      phone: '+1987654321',
      profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
      role: ROLES.USER,
      createdAt: currentTime,
      updatedAt: currentTime
    };
    
    // Check if users already exist
    let user1 = await getUserByEmail('john@example.com');
    let user2 = await getUserByEmail('jane@example.com');
    
    // Create users if they don't exist - with retry mechanism
    if (!user1) {
      try {
        user1 = await createUser(user1Data);
        console.log('Created user:', user1.email);
      } catch (error) {
        console.error('Error creating user1, retrying once...', error);
        user1 = await getUserByEmail('john@example.com');
        if (!user1) {
          user1 = await createUser(user1Data);
        }
      }
    } else {
      console.log('User already exists:', user1.email);
    }
    
    if (!user2) {
      try {
        user2 = await createUser(user2Data);
        console.log('Created user:', user2.email);
      } catch (error) {
        console.error('Error creating user2, retrying once...', error);
        user2 = await getUserByEmail('jane@example.com');
        if (!user2) {
          user2 = await createUser(user2Data);
        }
      }
    } else {
      console.log('User already exists:', user2.email);
    }
    
    // Generate random coordinates for properties within 50km radius
    const locations = [];
    for (let i = 0; i < 7; i++) {
      locations.push(generateRandomCoordinatesWithinRadius(
        centerLocation.latitude, 
        centerLocation.longitude, 
        40 // 40km radius (up to 50km)
      ));
    }
    
    // Create sample properties with random coordinates
    const propertyTemplates = [
      {
        title: 'Modern Apartment',
        description: 'Beautiful modern apartment with stunning city views.',
        bedrooms: 2,
        price: 2800,
        priceRange: [2500, 3000],
        kitchenCount: 1,
        washroomCount: 2,
        balconyCount: 1,
        amenities: {
          parking: true,
          gym: true,
          pool: false,
          doorman: true
        },
        features: ['modern', 'central', 'view', 'elevator'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
        ],
        ownerId: user1.id,
        createdAt: currentTime,
        updatedAt: currentTime
      },
      {
        title: 'Cozy Studio',
        description: 'Charming studio apartment in a quiet neighborhood.',
        bedrooms: 1,
        price: 1800,
        priceRange: [1500, 2000],
        kitchenCount: 1,
        washroomCount: 1,
        balconyCount: 0,
        amenities: {
          parking: false,
          gym: false,
          pool: false,
          doorman: false
        },
        features: ['cozy', 'quiet', 'renovated', 'bright'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
        ],
        ownerId: user2.id,
        createdAt: currentTime,
        updatedAt: currentTime
      },
      {
        title: 'Luxury Loft',
        description: 'Spacious loft with high ceilings and industrial design.',
        bedrooms: 3,
        price: 3500,
        priceRange: [3000, 4000],
        kitchenCount: 1,
        washroomCount: 2,
        balconyCount: 2,
        amenities: {
          parking: true,
          gym: true,
          pool: true,
          doorman: true
        },
        features: ['luxury', 'spacious', 'loft', 'modern'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
        ],
        ownerId: user1.id,
        createdAt: currentTime,
        updatedAt: currentTime
      }
    ];
    
    // Generate different property combinations using the templates
    const propertiesData = [];
    
    // Generate property data with random locations
    locations.forEach((location, index) => {
      const template = propertyTemplates[index % propertyTemplates.length];
      const neighborhood = Math.random() > 0.5 ? 'Downtown' : 'Uptown';
      const distanceKm = Math.floor(Math.random() * 30) + 1;
      
      propertiesData.push({
        ...template,
        title: `${template.title} in ${neighborhood}`,
        location: `${distanceKm} km away`, // Random nearby location string
        latitude: location.latitude,
        longitude: location.longitude,
        addressLine1: `${Math.floor(Math.random() * 999) + 1} Main St`,
        addressLine2: `Apt ${Math.floor(Math.random() * 99) + 1}`,
        addressLine3: neighborhood,
      });
    });
    
    // Create properties with individual try-catch blocks and longer delays
    for (const propertyData of propertiesData) {
      try {
        // Add a longer delay between operations to prevent overloading Firestore
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const property = await createProperty(propertyData);
        console.log('Created property:', property.title, 'at', property.location);
      } catch (error) {
        console.log('Error creating property:', propertyData.title);
        console.error(error);
        
        // Wait a bit longer and try again once
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const property = await createProperty(propertyData);
          console.log('Created property on second attempt:', property.title);
        } catch (retryError) {
          console.log('Failed to create property after retry:', propertyData.title);
        }
      }
    }
    
    console.log('Database has been seeded successfully with location-based properties! 🌱');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error; // Rethrow so we can handle it in the calling function
  }
};
