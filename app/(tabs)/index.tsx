import { FlatList, SafeAreaView, StatusBar, TextInput, TouchableOpacity, ScrollView, View as RNView } from 'react-native';
import { Text, View, useThemeColor } from '@/components/Themed';
import React, { useState, useEffect } from 'react';
import PropertyCard, { PropertyType } from '@/components/PropertyCard';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { DUMMY_PROPERTIES } from '@/constants/DummyData';
import FilterModal from '@/components/FilterModal';
import CircularGradient from '@/components/CircularGradient';
import { useAuth } from '@/contexts/AuthContext';

// Category data
const categories = [
  { id: '1', name: 'Nearby me', icon: 'location-arrow' as const },
  { id: '2', name: '1BHK', icon: 'bed' as const },
  { id: '3', name: 'Furnished', icon: 'home' as const },
  { id: '4', name: 'Unfurnished', icon: 'building' as const },
  { id: '5', name: 'Trending', icon: 'fire' as const },
];

// Create styled components
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledRNView = styled(RNView);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
// Don't style LinearGradient with nativewind as it causes compatibility issues
// const StyledLinearGradient = styled(LinearGradient);

export default function HomeScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  


  function redirect(arg0: string) {
    throw new Error('Function not implemented.');
  }

  // If user is not yet loaded or not logged in, show minimal content
  if (!user) {
    return <StyledView className="flex-1 items-center justify-center"><StyledText className="text-white">Loading...</StyledText></StyledView>;
  }
  
  return (
    <StyledSafeAreaView className="flex-1 pt-2">
      <CircularGradient />
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <StyledView className="flex-row items-center px-4 py-4 bg-transparent">
        <StyledText className="text-2xl font-bold mr-2 text-white">Leazzy</StyledText>
        <StyledTouchableOpacity 
          className="flex-1 flex-row items-center bg-[#262626] backdrop-blur-sm rounded-full pl-5 h-[54px] shadow-lg"
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.7}
        >
          <FontAwesome name="search" size={20} color="#aaa" className="mr-2" />
          <StyledTextInput
            className="flex-1 h-16 text-base text-white"
            placeholder="Search for 2bhk"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setFilterModalVisible(true)}
          />
        </StyledTouchableOpacity>
        <StyledTouchableOpacity 
          className="w-12 h-12 rounded-full bg-[#262626] backdrop-blur-sm ml-2 items-center justify-center shadow-lg"
          onPress={() => setFilterModalVisible(true)}
        >
          <FontAwesome name="sliders" size={20} color="#fff" />
        </StyledTouchableOpacity>
      </StyledView>

      {/* Categories */}
      <StyledView className="h-15 bg-transparent mt-2">
        <StyledScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4 h-15">
          {categories.map((category) => (
            <StyledTouchableOpacity 
              key={category.id}
              className={`items-center mr-4 pb-2 h-15 ${
                selectedCategory === category.id ? 'border-b-2 border-primary' : ''
              } 'bg-white/5'rounded-t-lg px-3 pt-1`}
              onPress={() => setSelectedCategory(category.id)}
            >
              <FontAwesome 
                name={category.icon} 
                size={20} 
                color={selectedCategory === category.id ? '#9370db' : '#999'} 
                className="mb-1" 
              />
              <StyledText 
                className={`text-sm ${
                  selectedCategory === category.id ? 'text-primary font-bold' : 'text-white'
                }`}
              >
                {category.name}
              </StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledScrollView>
      </StyledView>

      {/* Main ScrollView for sections */}
      <StyledScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-transparent">
        {/* Property Listings Section - Horizontal Scroll */}
        <StyledView className="my-5 bg-transparent">
          <StyledText className="text-2xl font-bold ml-4 mb-2 text-dark-text">What we found for you</StyledText>
          <StyledScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="pl-4"
            contentContainerStyle={{paddingRight: 16}}
          >
            {DUMMY_PROPERTIES.map((item) => (
              <StyledView key={item.id} className="w-300 mr-4 bg-transparent">
                <PropertyCard
                  property={item} 
                  onPress={() => router.push(`/property/${item.id}`)}
                  classese='w-[75vw]'
                />
              </StyledView>
            ))}
          </StyledScrollView>
        </StyledView>
       
        {/* Section for Near Kharar area */}
        <StyledView className="mb-5 bg-transparent">
          <StyledText className="text-2xl font-bold ml-4 mb-2 text-dark-text">Near Kharar area</StyledText>
            {DUMMY_PROPERTIES.filter(prop => prop.location.includes('Kharar')).map((item) => (
              <StyledView key={item.id} className="flex-1 items-center bg-transparent">
                <PropertyCard
                  property={item} 
                  onPress={() => router.push(`/property/${item.id}`)}
                  classese='w-[88vw]'
                />
              </StyledView>
            ))}
        </StyledView>
      </StyledScrollView>
      
      {/* Filter Modal */}
      <FilterModal 
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      />
    </StyledSafeAreaView>
  );
}
