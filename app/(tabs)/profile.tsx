import * as React from 'react';
import { Image, ScrollView, TouchableOpacity, StyleSheet, View as RNView, SafeAreaView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { styled } from 'nativewind';
import { DUMMY_USER } from '@/constants/DummyData';
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import CircularGradient from '@/components/CircularGradient';
import { router, usePathname } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

// Styled components
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledRNView = styled(RNView);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledImage = styled(Image);

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();
  // Fallback to DUMMY_USER for development if user is not logged in
  const profileData = user || DUMMY_USER;
  console.log("Profile Data: ", profileData);
  
  return (
    <StyledSafeAreaView className="flex-1 bg-black">
           <CircularGradient />
     
      {/* Header */}
      <StyledView className="bg-transparent flex-row items-center justify-between px-5 pb-4 pt-3">
        <StyledText className="text-white text-3xl font-bold">Your Profile</StyledText>
        <StyledTouchableOpacity className="w-12 h-12 rounded-full bg-zinc-800 items-center justify-center">
          <FontAwesome name="bell" size={20} color="#fff" />
        </StyledTouchableOpacity>
      </StyledView>
      
      <StyledScrollView showsVerticalScrollIndicator={false} className="flex-1 pb-96">
        {/* Profile Information */}
        <StyledView className="bg-transparent p-5 pb-4">
          <StyledView className="bg-transparent flex-row items-center">
            <StyledView className="bg-transparent mr-4">
              <StyledImage
                source={{ uri: profileData.photoURL }}
                className="w-16 h-16 rounded-full"
                style={{ backgroundColor: 'lavender' }}
              />
            </StyledView>
            
            <StyledView className='bg-transparent'>
              <StyledText className="text-white text-xl font-semibold">{profileData.displayName}</StyledText>
              <StyledText className="text-gray-400 text-base mt-1">{profileData?.phone ?   profileData.phone  : profileData.email }</StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
        
        {/* Rent your home banner */}
        <StyledView className="scale-90 mt-3 bg-transparent mx-3 mb-6 "> 
          <StyledTouchableOpacity 
          onPress={() => router.push("add-property")}
          className="bg-[#5b2a81] rounded-xl p-4 flex-row items-center justify-between">
            <StyledView className=" flex-row items-center bg-transparent">
              <StyledView className="  rounded-lg mr-3 bg-transparent">
                <Image source={require('@/public/profile_home_icon.png')} style={{ width: 40, height: 40 }} />
              </StyledView>
              <StyledText className="text-white bg-transparent text-lg font-medium">Rent your home and earn</StyledText>
            </StyledView>
            <FontAwesome name="chevron-right" size={16} color="white" />
          </StyledTouchableOpacity>
          <StyledView className="bg-transparent flex-row items-center mt-2">
            <StyledText className="text-gray-400">500+ users are already </StyledText>
            <StyledText className="text-white">earning </StyledText>
            <FontAwesome5 name="money-bill-wave" size={14} color="#4ADE80" />
          </StyledView>
        </StyledView>
        
        {/* Settings Section */}
        <StyledView className="bg-transparent px-5 mb-8">
          <StyledText className="text-white text-3xl font-bold mb-4">Settings</StyledText>
          
          <StyledView className="bg-transparent bg-zinc-900 rounded-2xl overflow-hidden">
            {/* Personal Information */}
            <StyledTouchableOpacity 
              onPress={() => router.push("/profileOptions/personal-information")}
              className="flex-row items-center justify-between p-4 border-b border-zinc-800">
              <StyledView className="bg-transparent flex-row items-center">
                <StyledView className="w-10 h-10 rounded-full bg-transparent mr-4 items-center justify-center">
                  <FontAwesome name="user" size={20} color="#7e7e7e" />
                </StyledView>
                <StyledText className="text-white text-lg">Personal information</StyledText>
              </StyledView>
              <FontAwesome name="chevron-right" size={16} color="#7e7e7e" />
            </StyledTouchableOpacity>
            
            {/* Payments and payouts */}
            <StyledTouchableOpacity className="flex-row items-center justify-between p-4 border-b border-zinc-800">
              <StyledView className="bg-transparent flex-row items-center">
                <StyledView className=" w-10 h-10 rounded-full bg-transparent mr-4 items-center justify-center">
                  <FontAwesome name="credit-card" size={18} color="#7e7e7e" />
                </StyledView>
                <StyledText className="text-white text-lg">Payments and payouts</StyledText>
              </StyledView>
              <FontAwesome name="chevron-right" size={16} color="#7e7e7e" />
            </StyledTouchableOpacity>
            
            {/* Login & account */}
            <StyledTouchableOpacity 
              onPress={() => router.push("/profileOptions/account-settings")}
              className="flex-row items-center justify-between p-4">
              <StyledView className="bg-transparent flex-row items-center">
                <StyledView className=" w-10 h-10 rounded-full bg-transparent mr-4 items-center justify-center">
                  <FontAwesome name="key" size={18} color="#7e7e7e" />
                </StyledView>
                <StyledText className="text-white text-lg">Login & account</StyledText>
              </StyledView>
              <FontAwesome name="chevron-right" size={16} color="#7e7e7e" />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
        
        {/* Support Section */}
        <StyledView className="bg-transparent px-5 mb-16">
          <StyledText className="text-white text-3xl font-bold mb-4">Support</StyledText>
          
          <StyledView className="bg-transparent bg-zinc-900 rounded-2xl overflow-hidden">
            {/* Visit the Help Center */}
            <StyledTouchableOpacity className="flex-row items-center justify-between p-4 border-b border-zinc-800">
              <StyledView className="bg-transparent flex-row items-center">
                <StyledView className=" w-10 h-10 rounded-full bg-transparent mr-4 items-center justify-center">
                  <FontAwesome name="user" size={20} color="#7e7e7e" />
                </StyledView>
                <StyledText className="text-white text-lg">Visit the Help Center</StyledText>
              </StyledView>
              <FontAwesome name="chevron-right" size={16} color="#7e7e7e" />
            </StyledTouchableOpacity>
            
            {/* Give us feedback */}
            <StyledTouchableOpacity className="flex-row items-center justify-between p-4">
              <StyledView className="bg-transparent flex-row items-center">
                <StyledView className=" w-10 h-10 rounded-full bg-transparent mr-4 items-center justify-center">
                  <FontAwesome name="credit-card" size={18} color="#7e7e7e" />
                </StyledView>
                <StyledText className="text-white text-lg">Give us feedback</StyledText>
              </StyledView>
              <FontAwesome name="chevron-right" size={16} color="#7e7e7e" />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
        
       
      </StyledScrollView>
    </StyledSafeAreaView>
  );
}
