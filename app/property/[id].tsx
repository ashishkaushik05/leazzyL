import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { DUMMY_PROPERTIES } from '@/constants/DummyData';
import { FontAwesome, MaterialIcons, Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import PropertyCard from '@/components/PropertyCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BookVisitModal from '@/components/BookVisitModal';


// Styled components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

const PropertyDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [visitModalVisible, setVisitModalVisible] = useState(false);

    // Find the property with the matching ID
    const property = DUMMY_PROPERTIES.find(p => p.id === id);

    const handleBookVisit = (date: string, time: string) => {
        // Here you would typically send this data to your backend
        // For now, we'll just show an alert
        Alert.alert(
            "Visit Scheduled",
            `Your visit to ${property?.title} has been scheduled for ${date} at ${time}.`,
            [{ text: "OK" }]
        );
        router.navigate({
            pathname: '/(tabs)'
        });
    };

    if (!property) {
        return (
            <StyledView className="flex-1 justify-center items-center">
                <LinearGradient
                    colors={['#1e0033', '#150025', '#121212']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 0.5 }}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    }}
                />

                <StyledText className="text-xl">Property not found</StyledText>
                <StyledTouchableOpacity
                    className="mt-4 p-3 bg-primary rounded-full"
                    onPress={() => router.back()}
                >
                    <StyledText className="text-white">Go Back</StyledText>
                </StyledTouchableOpacity>
            </StyledView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-black">
            <LinearGradient
                    colors={['#1e0033', '#150025', '#121212']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 0.5 }}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    }}
                />
            <StyledScrollView className="flex-1">
                {/* Property Image with Gradient Overlay */}
                <StyledView className="relative">
                    <Image
                        source={{ uri: property.imageUrl }}
                        style={{ width: '100%', height: 300 }}
                        resizeMode="cover"
                    />

                    {/* Gradient Overlay */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)']}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            height: 100,
                            width: '100%'
                        }}
                    />

                    {/* Back Button */}
                    <StyledTouchableOpacity
                        className="absolute top-12 left-4 w-10 h-10 rounded-full bg-black/30 items-center justify-center"
                        onPress={() => router.back()}
                    >
                        <FontAwesome name="chevron-left" size={20} color="#fff" />
                    </StyledTouchableOpacity>

                    {/* Share Button */}
                    <StyledTouchableOpacity
                        className="absolute top-12 right-16 w-10 h-10 rounded-full bg-black/30 items-center justify-center"
                        onPress={() => console.log('Share')}
                    >
                        <FontAwesome name="share" size={18} color="#fff" />
                    </StyledTouchableOpacity>

                    {/* Favorite Button */}
                    <StyledTouchableOpacity
                        className="absolute top-12 right-4 w-10 h-10 rounded-full bg-black/30 items-center justify-center"
                        onPress={() => console.log('Add to favorites')}
                    >
                        <FontAwesome name="heart-o" size={18} color="#fff" />
                    </StyledTouchableOpacity>

                    {/* Image Pagination */}
                    <StyledView className="absolute bottom-4 flex-row justify-center w-full">
                        <StyledView className="flex-row bg-black/40 rounded-full px-2 py-1">
                            <StyledView className="w-2 h-2 rounded-full bg-white mx-1" />
                            <StyledView className="w-2 h-2 rounded-full bg-white/30 mx-1" />
                            <StyledView className="w-2 h-2 rounded-full bg-white/30 mx-1" />
                            <StyledView className="w-2 h-2 rounded-full bg-white/30 mx-1" />
                        </StyledView>
                    </StyledView>
                </StyledView>

                {/* Property Details */}
                <StyledView className="p-4">
                    {/* Price */}
                    <StyledView className="flex-row items-baseline mb-1">
                        <StyledText className="text-2xl font-bold text-white">₹{property.price.toLocaleString()}</StyledText>
                        <StyledText className="text-gray-400 ml-1">/month</StyledText>
                    </StyledView>

                    {/* Title and Rating */}
                    <StyledView className="flex-row justify-between items-center mb-1">
                        <StyledText className="text-2xl font-bold text-white">{property.title}</StyledText>
                        {property.rating && (
                            <StyledView className="flex-row items-center bg-purple-700 px-3 py-1 rounded-lg">
                                <FontAwesome name="star" size={14} color="#fff" />
                                <StyledText className="text-white font-medium ml-1.5">{property.rating}</StyledText>
                            </StyledView>
                        )}
                    </StyledView>

                    {/* BHK */}
                    <StyledText className="text-lg text-white mb-1">{property.bhk}</StyledText>

                    {/* Location */}
                    <StyledView className="flex-row items-center mb-4">
                        <FontAwesome5 name="map-marker-alt" size={14} color="#aaa" />
                        <StyledText className="text-gray-400 ml-2">{property.location}</StyledText>
                    </StyledView>

                    {/* Address */}
                    {property.address && (
                        <StyledText className="text-gray-300 mb-4">{property.address}</StyledText>
                    )}

                    {/* Specifications */}
                    {property.specifications && (
                        <StyledView className="py-4 border-t border-b border-gray-800 mb-6">
                            <StyledView className="flex-row justify-around">
                                {property.specifications.bedrooms && (
                                    <StyledView className="items-center">
                                        <Ionicons name="bed-outline" size={22} color="#aaa" />
                                        <StyledText className="text-gray-400 mt-1">{property.specifications.bedrooms} bedrooms</StyledText>
                                    </StyledView>
                                )}
                                {property.specifications.kitchen && (
                                    <StyledView className="items-center">
                                        <MaterialIcons name="kitchen" size={22} color="#aaa" />
                                        <StyledText className="text-gray-400 mt-1">{property.specifications.kitchen} kitchen</StyledText>
                                    </StyledView>
                                )}
                                {property.specifications.bathrooms && (
                                    <StyledView className="items-center">
                                        <FontAwesome name="bath" size={20} color="#aaa" />
                                        <StyledText className="text-gray-400 mt-1">{property.specifications.bathrooms} bathrooms</StyledText>
                                    </StyledView>
                                )}
                            </StyledView>
                        </StyledView>
                    )}

                    {/* What this flat offers */}
                    <StyledText className="text-xl font-bold text-white mb-4">What this flat offers</StyledText>

                    {/* Amenities */}
                    <StyledView className="mb-6">
                        <StyledView className="flex-row flex-wrap">
                            {property.amenities.slice(0, 6).map((amenity, index) => (
                                <StyledView key={index} className="flex-row items-center bg-[#262626] rounded-lg mr-2 mb-2 px-3 py-2">
                                    {amenity === 'Television' && <Ionicons name="tv" size={18} color="#fff" />}
                                    {amenity === 'Wifi' && <Entypo name="signal" size={18} color="#fff" />}
                                    {amenity === 'AC' && <FontAwesome5 name="snowflake" size={16} color="#fff" />}
                                    {amenity === 'Parking' && <FontAwesome5 name="parking" size={18} color="#fff" />}
                                    {amenity === 'Security' && <FontAwesome5 name="shield-alt" size={18} color="#fff" />}
                                    {amenity === 'Refrigerator' && <MaterialCommunityIcons name="fridge" size={18} color="#fff" />}
                                    {amenity === 'Gym' && <FontAwesome5 name="dumbbell" size={18} color="#fff" />}
                                    {amenity === 'Swimming Pool' && <FontAwesome5 name="swimming-pool" size={16} color="#fff" />}
                                    {amenity === 'Laundry' && <MaterialCommunityIcons name="washing-machine" size={16} color="#fff" />}
                                    <StyledText className="text-white ml-2 text-sm">{amenity}</StyledText>
                                </StyledView>
                            ))}
                        </StyledView>

                        {property.amenities.length > 6 && (
                            <StyledTouchableOpacity
                                className="mt-1 flex-row items-center"
                                onPress={() => console.log('Show more amenities')}
                            >
                                <StyledText className="text-purple-500 font-medium">+{property.amenities.length - 6} more</StyledText>
                            </StyledTouchableOpacity>
                        )}
                    </StyledView>

                    {/* See what others say */}
                    {property.reviews && property.reviews.length > 0 && (
                        <>
                            <StyledText className="text-xl font-bold text-white mb-4">See what others say</StyledText>

                            {/* Reviews */}
                            <StyledScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                                {property.reviews.map((review) => (
                                    <StyledView key={review.id} className="w-72 mr-3 p-4 bg-[#1a1a1a] rounded-xl">
                                        {/* Rating */}
                                        <StyledView className="flex-row justify-between items-center mb-2">
                                            <StyledView className="flex-row items-center bg-purple-700/20 px-2.5 py-1 rounded-md">
                                                <FontAwesome name="star" size={14} color="#bf5af2" />
                                                <StyledText className="text-purple-400 font-medium ml-1.5">{review.rating}</StyledText>
                                            </StyledView>
                                            <StyledText className="text-gray-400 text-xs">{review.date}</StyledText>
                                        </StyledView>

                                        {/* Review Text */}
                                        <StyledText className="text-white text-sm leading-5 mb-3">{review.comment}</StyledText>

                                        {/* User Info */}
                                        <StyledView className="flex-row items-center">
                                            <Image
                                                source={{ uri: review.userImg || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
                                                style={{ width: 28, height: 28, borderRadius: 14 }}
                                            />
                                            <StyledView className="ml-2">
                                                <StyledText className="text-white text-sm">{review.user}</StyledText>
                                                <StyledText className="text-gray-400 text-xs">{review.location}</StyledText>
                                            </StyledView>
                                        </StyledView>
                                    </StyledView>
                                ))}
                            </StyledScrollView>

                            {/* Show all reviews button */}
                            <StyledTouchableOpacity
                                className="mb-6 py-3 rounded-lg border border-gray-700 items-center"
                                onPress={() => console.log('Show all reviews')}
                            >
                                <StyledText className="text-white font-medium text-sm">Show all {property.reviews.length} reviews</StyledText>
                            </StyledTouchableOpacity>
                        </>
                    )}

                    {/* Recommended for you */}
                    <StyledText className="text-xl font-bold text-white mb-4">Recommended for you</StyledText>

                    {/* Recommended Properties */}
                    <StyledScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-6 -mx-4 px-4"
                    >
                        {DUMMY_PROPERTIES
                            .filter(recommendedProperty => recommendedProperty.id !== property.id)
                            .map(recommendedProperty => (
                                <PropertyCard
                                    key={recommendedProperty.id}
                                    property={recommendedProperty}
                                    onPress={() => router.push(`/property/${recommendedProperty.id}`)}
                                    classese="mr-4 w-72"
                                />
                            ))
                        }
                    </StyledScrollView>

                    {/* Cancellation Policy */}
                    {property.cancellation && (
                        <>
                            <StyledText className="text-xl font-bold text-white mb-4">Cancellation policy</StyledText>
                            <StyledText className="text-gray-400 mb-8">{property.cancellation}</StyledText>
                        </>
                    )}
                </StyledView>
            </StyledScrollView>

            {/* Book Now Button - Fixed at bottom */}
            <StyledView className="p-4 border-t border-gray-800 flex-row justify-between space-x-3 bg-black">
                {/* Make Visit Button */}
                <StyledTouchableOpacity
                    className="flex-1 py-4 rounded-xl flex-row justify-center items-center bg-gray-800"
                    onPress={() => setVisitModalVisible(true)}
                >
                    <StyledText className="text-white font-medium">Make visit</StyledText>
                </StyledTouchableOpacity>

                {/* Book Flat Button */}
                <StyledTouchableOpacity
                    className="flex-1 py-4 rounded-xl flex-row justify-center items-center bg-purple-600"
                    onPress={() => console.log('Book flat')}
                >
                    <StyledText className="text-white font-medium">Book flat</StyledText>
                    <Ionicons name="chevron-forward" size={16} color="white" style={{ marginLeft: 4 }} />
                </StyledTouchableOpacity>
            </StyledView>
            
            {/* Book Visit Modal */}
            <BookVisitModal
                visible={visitModalVisible}
                onClose={() => setVisitModalVisible(false)}
                onBookVisit={handleBookVisit}
            />
        </SafeAreaView>
    );
};

export default PropertyDetailScreen;