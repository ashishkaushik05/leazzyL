import React, { useState } from 'react';
import { Modal, TouchableOpacity, View as RNView, TouchableWithoutFeedback, ScrollView  } from 'react-native';
import { Text, View } from '@/components/Themed';
import { styled } from 'nativewind';
import { FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Styled components
const StyledView = styled(View);
const StyledRNView = styled(RNView);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

type FilterOption = {
  id: string;
  selected: boolean;
};

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function FilterModal({ visible, onClose }: FilterModalProps) {
  const insets = useSafeAreaInsets();
  
  // Recommendation options
  const [recommendations, setRecommendations] = useState<FilterOption[]>([
    { id: 'instant', selected: false },
    { id: 'nearby', selected: false },
  ]);

  // Room options
  const [rooms, setRooms] = useState<FilterOption[]>([
    { id: '1bhk', selected: false },
    { id: '2bhk', selected: false },
    { id: '3bhk', selected: false },
  ]);

  // Amenity options
  const [amenities, setAmenities] = useState<FilterOption[]>([
    { id: 'wifi', selected: false },
    { id: 'sofa', selected: false },
    { id: 'tv', selected: false },
    { id: 'laundry', selected: false },
  ]);

  // Price ranges
  const [priceRanges, setPriceRanges] = useState<FilterOption[]>([
    { id: '3000-5000', selected: false },
    { id: '5000-8000', selected: false },
  ]);

  const toggleOption = (
    optionId: string, 
    options: FilterOption[], 
    setOptions: React.Dispatch<React.SetStateAction<FilterOption[]>>
  ) => {
    setOptions(
      options.map(option => 
        option.id === optionId 
          ? { ...option, selected: !option.selected }
          : option
      )
    );
  };

  const clearAllFilters = () => {
    setRecommendations(recommendations.map(r => ({ ...r, selected: false })));
    setRooms(rooms.map(r => ({ ...r, selected: false })));
    setAmenities(amenities.map(a => ({ ...a, selected: false })));
    setPriceRanges(priceRanges.map(p => ({ ...p, selected: false })));
  };

  const hasActiveFilters = () => {
    return (
      recommendations.some(r => r.selected) ||
      rooms.some(r => r.selected) ||
      amenities.some(a => a.selected) ||
      priceRanges.some(p => p.selected)
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <StyledRNView className="flex-1 bg-black/80">
        <StyledRNView 
          className="flex-1 bg-[#121212] rounded-t-3xl mt-16"
          style={{ paddingTop: insets.top }}
        >
          {/* Header - Filter & Close button */}
          <StyledView className="bg-transparent flex-row justify-between items-center px-5 py-4">
            <StyledTouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={28} color="white" />
            </StyledTouchableOpacity>
            <StyledText className="text-white text-xl font-semibold">Filter</StyledText>
            <StyledView className="w-10" />
          </StyledView>

          {/* Filter content - Scrollable */}
          <StyledScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
            {/* Recommended for you */}
            <StyledView className=" bg-transparent mb-8">
              <StyledText className="text-white text-2xl font-bold mb-4">Recommended for you</StyledText>
              <StyledRNView className="flex-row">
                <StyledTouchableOpacity 
                  onPress={() => toggleOption('instant', recommendations, setRecommendations)}
                  className={`mr-3 bg-transparent flex-1 h-60 rounded-lg overflow-hidden justify-center items-center ${
                    recommendations.find(r => r.id === 'instant')?.selected ? 'border-2 border-purple-500' : 'border border-gray-700'
                  }`}
                >
                  <StyledView className=" bg-transparent items-center justify-center">
                    <StyledRNView className="w-20 h-20 items-center justify-center">
                      <StyledRNView className="absolute w-14 h-14 bg-orange-500 opacity-20 rounded-full"></StyledRNView>
                      <FontAwesome name="bolt" size={44} color="#FF9500" />
                    </StyledRNView>
                    <StyledText className="text-white text-lg mt-3">Instantly available</StyledText>
                  </StyledView>
                </StyledTouchableOpacity>

                <StyledTouchableOpacity 
                  onPress={() => toggleOption('nearby', recommendations, setRecommendations)}
                  className={`flex-1 h-60 rounded-lg overflow-hidden justify-center items-center ${
                    recommendations.find(r => r.id === 'nearby')?.selected ? 'border-2 border-purple-500' : 'border border-gray-700'
                  }`}
                >
                  <StyledView className="bg-transparent items-center justify-center">
                    <StyledRNView className="w-20 h-20 items-center justify-center">
                      <StyledRNView className="absolute w-14 h-14 bg-green-500 opacity-20 rounded-full"></StyledRNView>
                      <FontAwesome name="map-marker" size={44} color="#4ADE80" />
                    </StyledRNView>
                    <StyledText className="text-white text-lg mt-3">Nearby you</StyledText>
                  </StyledView>
                </StyledTouchableOpacity>
              </StyledRNView>
            </StyledView>

            {/* No. of rooms */}
            <StyledView className="bg-transparent mb-8">
              <StyledText className="text-white text-2xl font-bold mb-4">No. of rooms</StyledText>
              <StyledRNView className="flex-row">
                <StyledTouchableOpacity 
                  onPress={() => toggleOption('1bhk', rooms, setRooms)}
                  className={`mr-3 flex-1 py-4 px-6 rounded-lg flex-row items-center justify-center ${
                    rooms.find(r => r.id === '1bhk')?.selected ? 'bg-purple-700/40 border border-purple-500' : 'border border-gray-700'
                  }`}
                >
                  <MaterialIcons name="king-bed" size={24} color="white" />
                  <StyledText className="text-white text-base ml-2">1BHK</StyledText>
                </StyledTouchableOpacity>

                <StyledTouchableOpacity 
                  onPress={() => toggleOption('2bhk', rooms, setRooms)}
                  className={`mr-3 flex-1 py-4 px-6 rounded-lg flex-row items-center justify-center ${
                    rooms.find(r => r.id === '2bhk')?.selected ? 'bg-purple-700/40 border border-purple-500' : 'border border-gray-700'
                  }`}
                >
                  <MaterialIcons name="king-bed" size={24} color="white" />
                  <StyledText className="text-white text-base ml-2">2BHK</StyledText>
                </StyledTouchableOpacity>

                <StyledTouchableOpacity 
                  onPress={() => toggleOption('3bhk', rooms, setRooms)}
                  className={`flex-1 py-4 px-6 rounded-lg flex-row items-center justify-center ${
                    rooms.find(r => r.id === '3bhk')?.selected ? 'bg-purple-700/40 border border-purple-500' : 'border border-gray-700'
                  }`}
                >
                  <MaterialIcons name="king-bed" size={24} color="white" />
                  <StyledText className="text-white text-base ml-2">3BHK</StyledText>
                </StyledTouchableOpacity>
              </StyledRNView>
            </StyledView>

            {/* Amenities */}
            <StyledView className="bg-transparent mb-8">
              <StyledText className="text-white text-2xl font-bold mb-4">Amenities</StyledText>
              <StyledRNView className="flex-row flex-wrap">
                <StyledTouchableOpacity 
                  onPress={() => toggleOption('wifi', amenities, setAmenities)}
                  className={`mr-3 mb-3 px-6 py-3 rounded-lg flex-row items-center ${
                    amenities.find(a => a.id === 'wifi')?.selected ? 'bg-purple-700/40 border border-purple-500' : 'border border-gray-700'
                  }`}
                >
                  <FontAwesome name="wifi" size={22} color="white" />
                  <StyledText className="text-white text-base ml-3">Wifi</StyledText>
                </StyledTouchableOpacity>

                <StyledTouchableOpacity 
                  onPress={() => toggleOption('sofa', amenities, setAmenities)}
                  className={`mr-3 mb-3 px-6 py-3 rounded-lg flex-row items-center ${
                    amenities.find(a => a.id === 'sofa')?.selected ? 'bg-purple-700/40 border border-purple-500' : 'border border-gray-700'
                  }`}
                >
                  <MaterialIcons name="weekend" size={22} color="white" />
                  <StyledText className="text-white text-base ml-3">Sofa</StyledText>
                </StyledTouchableOpacity>

                <StyledTouchableOpacity 
                  onPress={() => toggleOption('tv', amenities, setAmenities)}
                  className={`mr-3 mb-3 px-6 py-3 rounded-lg flex-row items-center ${
                    amenities.find(a => a.id === 'tv')?.selected ? 'bg-purple-700/40 border border-purple-500' : 'border border-gray-700'
                  }`}
                >
                  <MaterialIcons name="tv" size={22} color="white" />
                  <StyledText className="text-white text-base ml-3">TV</StyledText>
                </StyledTouchableOpacity>

                <StyledTouchableOpacity 
                  onPress={() => toggleOption('laundry', amenities, setAmenities)}
                  className={`mb-3 px-6 py-3 rounded-lg flex-row items-center ${
                    amenities.find(a => a.id === 'laundry')?.selected ? 'bg-purple-700/40 border border-purple-500' : 'border border-gray-700'
                  }`}
                >
                  <MaterialCommunityIcons name="washing-machine" size={22} color="white" />
                  <StyledText className="text-white text-base ml-3">Laundry</StyledText>
                </StyledTouchableOpacity>
              </StyledRNView>
            </StyledView>

            {/* Pricing */}
            <StyledView className="bg-transparent mb-10">
              <StyledText className="text-white text-2xl font-bold mb-4">Pricing</StyledText>
              <StyledRNView className="flex-row">
                <StyledTouchableOpacity 
                  onPress={() => toggleOption('3000-5000', priceRanges, setPriceRanges)}
                  className={`mr-3 flex-1 py-4 rounded-lg items-center justify-center ${
                    priceRanges.find(p => p.id === '3000-5000')?.selected ? 'bg-purple-700/40 border border-purple-500' : 'border border-gray-700'
                  }`}
                >
                  <StyledText className="text-white text-base">₹3000-₹5000</StyledText>
                </StyledTouchableOpacity>

                <StyledTouchableOpacity 
                  onPress={() => toggleOption('5000-8000', priceRanges, setPriceRanges)}
                  className={`flex-1 py-4 rounded-lg items-center justify-center ${
                    priceRanges.find(p => p.id === '5000-8000')?.selected ? 'bg-purple-700/40 border border-purple-500' : 'border border-gray-700'
                  }`}
                >
                  <StyledText className="text-white text-base">₹5000-₹8000</StyledText>
                </StyledTouchableOpacity>
              </StyledRNView>
            </StyledView>
          </StyledScrollView>

          {/* Bottom buttons */}
          <StyledRNView className="flex-row px-5 pb-8 border-t border-gray-800 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
            <StyledTouchableOpacity
              onPress={clearAllFilters}
              className="flex-1 mr-3 py-3 items-center justify-center"
              disabled={!hasActiveFilters()}
            >
              <StyledText className={`${hasActiveFilters() ? 'text-white' : 'text-gray-500'} font-medium text-base`}>
                clear all
              </StyledText>
            </StyledTouchableOpacity>
            
            <StyledTouchableOpacity 
              className="flex-2 flex-grow bg-purple-600 py-4 rounded-full items-center justify-center"
              onPress={onClose}
            >
              <StyledText className="text-white font-bold text-base">Show 1000+ flats</StyledText>
            </StyledTouchableOpacity>
          </StyledRNView>
        </StyledRNView>
      </StyledRNView>
    </Modal>
  );
}
