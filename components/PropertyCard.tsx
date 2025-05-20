import React from 'react';
import {Image, TouchableOpacity, View as RNView, Text as RNText } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';


export type PropertyType = {
  id: string;
  price: number;
  title: string;
  location: string;
  imageUrl: string;
  bhk: string;
  amenities: string[];
};

interface PropertyCardProps {
  property: PropertyType;
  onPress?: () => void;
  classese?: string; // Keep as-is for backwards compatibility
  className?: string; // Add standard React prop name
  onLike?: (property: PropertyType, isLiked: boolean) => void;
  isFavorite?: boolean;
}

// Styled components
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledView = styled(View);
const StyledRNView = styled(RNView);
const StyledText = styled(Text);
const StyledRNText = styled(RNText);
// Don't style LinearGradient with nativewind as it causes compatibility issues
// const StyledLinearGradient = styled(LinearGradient);

export default function PropertyCard({ property, onPress, classese, className, onLike, isFavorite = false }: PropertyCardProps) {
  // Local state to track if a property is liked (for immediate UI feedback)
  const [isLiked, setIsLiked] = React.useState(isFavorite);
  
  // Update local state when props change
  React.useEffect(() => {
    setIsLiked(isFavorite);
  }, [isFavorite]);

  // Handle like button press
  const handleLikePress = (event: any) => {
    // Prevent triggering the card's onPress
    event.stopPropagation();
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // Call the parent component's onLike handler if provided
    if (onLike) {
      onLike(property, newLikedState);
    }
  };
  
  return (
    <StyledTouchableOpacity 
      className={'rounded-xl overflow-hidden my-2.5 w-80 shadow-md bg-transparent '+(className || classese || '')}
      onPress={onPress} 
      activeOpacity={0.9}
    >
      <StyledRNView className="relative">
        <StyledImage 
          className="w-full h-52" 
          source={{ uri: property.imageUrl }}
          resizeMode="cover"
        />
        
        {/* Like Button */}
        <StyledTouchableOpacity 
          className="absolute top-2 right-2 bg-black/30 p-2 rounded-full z-10"
          onPress={handleLikePress}
          activeOpacity={0.7}
        >
          <FontAwesome 
            name={isLiked ? "heart" : "heart-o"} 
            size={20} 
            color={isLiked ? "#9370db" : "white"} 
          />
        </StyledTouchableOpacity>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 80,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12
          }}
        />
      </StyledRNView>

      <StyledView className="p-4 bg-dark-card">
        {/* Price section */}
        <StyledRNView className="flex-row items-baseline mb-2">
          <StyledRNText className="text-lg font-bold text-dark-text">₹</StyledRNText>
          <StyledRNText className="text-2xl font-bold text-dark-text">{property.price.toLocaleString()}</StyledRNText>
          <StyledRNText className="text-sm text-dark-muted"> /month</StyledRNText>
        </StyledRNView>

        {/* Title and BHK */}
        <StyledRNView className="flex-row justify-between items-center mb-1">
          <StyledText className="text-lg font-bold flex-1 text-dark-text">{property.title}</StyledText>
          <StyledView className="px-2 py-0.5 rounded bg-opacity-5 bg-transparent ml-2.5">
            <StyledText className="text-sm font-medium">{property.bhk}</StyledText>
          </StyledView>
        </StyledRNView>
        
        {/* Location */}
        <StyledText className="text-sm text-dark-muted mb-2">{property.location}</StyledText>
        
        {/* Amenities */}
        <StyledRNView className="flex-row items-center flex-wrap mt-1">
          {property.amenities.slice(0, 2).map((amenity, index) => (
            <StyledRNView key={index} className="flex-row items-center mr-4 mb-1">
              {amenity === 'Television' && <FontAwesome name="tv" size={16} color={"white"} className="text-dark-text" />}
              {amenity === 'Wifi' && <FontAwesome name="wifi" size={16} color={"white"}  className="text-dark-text" />}
              {amenity === 'AC' && <FontAwesome name="snowflake-o" size={16} color={"white"}  className="text-dark-text" />}
              {amenity === 'Parking' && <FontAwesome name="car" size={16} color={"white"}  className="text-dark-text" />}
              {amenity === 'Security' && <FontAwesome name="shield" size={16} color={"white"}  className="text-dark-text" />}
              {amenity === 'Refrigerator' && <FontAwesome name="cube" size={16} color={"white"}  className="text-dark-text" />}
              {amenity === 'Gym' && <FontAwesome name="heartbeat" size={16} color={"white"}  className="text-dark-text" />}
              {amenity === 'Swimming Pool' && <FontAwesome name="tint" size={16} color={"white"}  className="text-dark-text" />}
              <StyledRNText className="ml-1 text-sm text-dark-text">{amenity}</StyledRNText>
            </StyledRNView>
          ))}
          {property.amenities.length > 2 && (
            <StyledRNText className="text-sm font-medium text-primary">
              +{property.amenities.length - 2} more
            </StyledRNText>
          )}
        </StyledRNView>
      </StyledView>
    </StyledTouchableOpacity>
  );
}