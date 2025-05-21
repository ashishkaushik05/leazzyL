// Firebase database schema and utility functions
import { db } from '@/firebaseConfig';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PROPERTIES: 'properties',
  TEMP_PROPERTIES: 'temp_properties',
  REFRESH_TOKENS: 'refresh_tokens'
};

// User roles
export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

// Temp property status
export const TEMP_PROPERTY_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

// User schema
export const createUser = async (userData) => {
  const { id, email, ...rest } = userData;
  
  // Either use a provided ID or let Firebase generate one
  const userRef = id ? doc(db, COLLECTIONS.USERS, id) : doc(collection(db, COLLECTIONS.USERS));
  
  const user = {
    email,
    name: rest.name || '',
    phone: rest.phone || null,
    profileImage: rest.profileImage || null,
    role: rest.role || ROLES.USER,
    oauthProvider: rest.oauthProvider || null,
    oauthSub: rest.oauthSub || null,
    createdAt: rest.createdAt || Timestamp.now(),
    updatedAt: rest.updatedAt || Timestamp.now(),
    ...rest
  };
  
  await setDoc(userRef, user);
  return { id: userRef.id, ...user };
};

export const getUserById = async (id) => {
  const userRef = doc(db, COLLECTIONS.USERS, id);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }
  
  return null;
};

export const getUserByEmail = async (email) => {
  const usersQuery = query(collection(db, COLLECTIONS.USERS), where("email", "==", email));
  const userSnap = await getDocs(usersQuery);
  
  if (!userSnap.empty) {
    const userData = userSnap.docs[0];
    return { id: userData.id, ...userData.data() };
  }
  
  return null;
};

export const updateUser = async (id, userData) => {
  const userRef = doc(db, COLLECTIONS.USERS, id);
  
  // Add updated timestamp
  userData.updatedAt = serverTimestamp();
  
  await updateDoc(userRef, userData);
  return { id, ...userData };
};

// Property schema
export const createProperty = async (propertyData) => {
  const { id, ...rest } = propertyData;
  
  // Either use a provided ID or let Firebase generate one
  const propertyRef = id 
    ? doc(db, COLLECTIONS.PROPERTIES, id) 
    : doc(collection(db, COLLECTIONS.PROPERTIES));
  
  const property = {
    title: rest.title,
    description: rest.description || '',
    location: rest.location || '',
    bedrooms: rest.bedrooms || 1,
    price: rest.price || 0,
    priceRange: rest.priceRange || [0, 0],
    latitude: rest.latitude || null,
    longitude: rest.longitude || null,
    addressLine1: rest.addressLine1 || null,
    addressLine2: rest.addressLine2 || null,
    addressLine3: rest.addressLine3 || null,
    kitchenCount: rest.kitchenCount || 0,
    washroomCount: rest.washroomCount || 0,
    balconyCount: rest.balconyCount || 0,
    amenities: rest.amenities || {},
    features: rest.features || [],
    images: rest.images || [],
    isAdminOwned: rest.isAdminOwned || false,
    ownerId: rest.ownerId,
    renters: rest.renters || [],
    createdAt: rest.createdAt || Timestamp.now(),
    updatedAt: rest.updatedAt || Timestamp.now(),
  };
  
  await setDoc(propertyRef, property);
  return { id: propertyRef.id, ...property };
};

export const getPropertyById = async (id) => {
  const propertyRef = doc(db, COLLECTIONS.PROPERTIES, id);
  const propertySnap = await getDoc(propertyRef);
  
  if (propertySnap.exists()) {
    return { id: propertySnap.id, ...propertySnap.data() };
  }
  
  return null;
};

export const updateProperty = async (id, propertyData) => {
  const propertyRef = doc(db, COLLECTIONS.PROPERTIES, id);
  
  // Add updated timestamp
  propertyData.updatedAt = serverTimestamp();
  
  await updateDoc(propertyRef, propertyData);
  return { id, ...propertyData };
};

export const deleteProperty = async (id) => {
  const propertyRef = doc(db, COLLECTIONS.PROPERTIES, id);
  await deleteDoc(propertyRef);
  return id;
};

// Temp Property schema
export const createTempProperty = async (propertyData) => {
  const { id, ...rest } = propertyData;
  
  // Either use a provided ID or let Firebase generate one
  const tempPropertyRef = id 
    ? doc(db, COLLECTIONS.TEMP_PROPERTIES, id) 
    : doc(collection(db, COLLECTIONS.TEMP_PROPERTIES));
  
  const tempProperty = {
    title: rest.title,
    description: rest.description || '',
    location: rest.location || '',
    bedrooms: rest.bedrooms || 1,
    price: rest.price || 0,
    priceRange: rest.priceRange || [0, 0],
    latitude: rest.latitude || null,
    longitude: rest.longitude || null,
    addressLine1: rest.addressLine1 || null,
    addressLine2: rest.addressLine2 || null,
    addressLine3: rest.addressLine3 || null,
    kitchenCount: rest.kitchenCount || 0,
    washroomCount: rest.washroomCount || 0,
    balconyCount: rest.balconyCount || 0,
    amenities: rest.amenities || {},
    features: rest.features || [],
    images: rest.images || [],
    ownerId: rest.ownerId,
    approvedById: rest.approvedById || null,
    status: rest.status || TEMP_PROPERTY_STATUS.PENDING,
    createdAt: rest.createdAt || Timestamp.now(),
    updatedAt: rest.updatedAt || Timestamp.now(),
  };
  
  await setDoc(tempPropertyRef, tempProperty);
  return { id: tempPropertyRef.id, ...tempProperty };
};

export const getTempPropertyById = async (id) => {
  const tempPropertyRef = doc(db, COLLECTIONS.TEMP_PROPERTIES, id);
  const tempPropertySnap = await getDoc(tempPropertyRef);
  
  if (tempPropertySnap.exists()) {
    return { id: tempPropertySnap.id, ...tempPropertySnap.data() };
  }
  
  return null;
};

export const updateTempProperty = async (id, propertyData) => {
  const tempPropertyRef = doc(db, COLLECTIONS.TEMP_PROPERTIES, id);
  
  // Add updated timestamp
  propertyData.updatedAt = serverTimestamp();
  
  await updateDoc(tempPropertyRef, propertyData);
  return { id, ...propertyData };
};

// RefreshToken schema
export const createRefreshToken = async (tokenData) => {
  const { id, ...rest } = tokenData;
  
  const refreshTokenRef = id 
    ? doc(db, COLLECTIONS.REFRESH_TOKENS, id)
    : doc(collection(db, COLLECTIONS.REFRESH_TOKENS));
  
  const refreshToken = {
    token: rest.token,
    userId: rest.userId,
    family: rest.family,
    expiresAt: rest.expiresAt,
    createdAt: serverTimestamp(),
    used: false,
  };
  
  await setDoc(refreshTokenRef, refreshToken);
  return { id: refreshTokenRef.id, ...refreshToken };
};

export const getRefreshTokenByToken = async (token) => {
  const refreshTokensQuery = query(
    collection(db, COLLECTIONS.REFRESH_TOKENS), 
    where("token", "==", token)
  );
  const refreshTokenSnap = await getDocs(refreshTokensQuery);
  
  if (!refreshTokenSnap.empty) {
    const tokenData = refreshTokenSnap.docs[0];
    return { id: tokenData.id, ...tokenData.data() };
  }
  
  return null;
};

export const updateRefreshToken = async (id, tokenData) => {
  const refreshTokenRef = doc(db, COLLECTIONS.REFRESH_TOKENS, id);
  await updateDoc(refreshTokenRef, tokenData);
  return { id, ...tokenData };
};
