// Property management functions
import { createProperty, updateProperty, deleteProperty, createTempProperty } from '@/utils/firestoreDb';
import { storage } from '@/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

/**
 * Create a new property with image uploads
 * 
 * @param {Object} propertyData - Property data without images
 * @param {Array} imageUris - Array of local image URIs to upload
 * @param {string} userId - Current user ID
 * @returns {Object} Created property with image URLs
 */
export const createPropertyWithImages = async (propertyData, imageUris, userId) => {
  try {
    // Upload images first
    const imageUrls = await Promise.all(
      imageUris.map(uri => uploadPropertyImage(uri, userId))
    );
    
    // Create property with image URLs
    const newProperty = await createProperty({
      ...propertyData,
      images: imageUrls,
      ownerId: userId
    });
    
    return newProperty;
  } catch (error) {
    console.error('Error creating property with images:', error);
    throw error;
  }
};

/**
 * Create a temporary property (for approval flow)
 * 
 * @param {Object} propertyData - Property data without images
 * @param {Array} imageUris - Array of local image URIs to upload
 * @param {string} userId - Current user ID
 * @returns {Object} Created temp property with image URLs
 */
export const createTempPropertyWithImages = async (propertyData, imageUris, userId) => {
  try {
    // Upload images first
    const imageUrls = await Promise.all(
      imageUris.map(uri => uploadPropertyImage(uri, userId))
    );
    
    // Create temporary property with image URLs
    const newTempProperty = await createTempProperty({
      ...propertyData,
      images: imageUrls,
      ownerId: userId
    });
    
    return newTempProperty;
  } catch (error) {
    console.error('Error creating temp property with images:', error);
    throw error;
  }
};

/**
 * Upload a property image to Firebase Storage
 * 
 * @param {string} uri - Local file URI
 * @param {string} userId - Current user ID for folder structure
 * @returns {string} Download URL of uploaded image
 */
export const uploadPropertyImage = async (uri, userId) => {
  try {
    // Generate a unique filename
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const storagePath = `properties/${userId}/${filename}`;
    
    // Fetch the image as a blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Create a reference to Firebase Storage
    const storageRef = ref(storage, storagePath);
    
    // Upload the blob
    const uploadTask = await uploadBytesResumable(storageRef, blob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(uploadTask.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Update property with new images
 * 
 * @param {string} propertyId - Property ID to update
 * @param {Object} propertyData - Updated property data
 * @param {Array} newImageUris - New local image URIs to upload
 * @param {Array} existingImageUrls - Existing image URLs to keep
 * @param {string} userId - Current user ID
 * @returns {Object} Updated property
 */
export const updatePropertyWithImages = async (
  propertyId,
  propertyData,
  newImageUris = [],
  existingImageUrls = [],
  userId
) => {
  try {
    // Upload any new images
    const newImageUrls = await Promise.all(
      newImageUris.map(uri => uploadPropertyImage(uri, userId))
    );
    
    // Combine existing and new image URLs
    const allImageUrls = [...existingImageUrls, ...newImageUrls];
    
    // Update the property with new data and images
    const updatedProperty = await updateProperty(propertyId, {
      ...propertyData,
      images: allImageUrls,
      updatedAt: new Date()
    });
    
    return updatedProperty;
  } catch (error) {
    console.error('Error updating property with images:', error);
    throw error;
  }
};
