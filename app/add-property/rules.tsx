import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View as RNView, SafeAreaView, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { defaultPropertyData, PropertyData } from '@/components/addProperty/PropertyTypes';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import BackButton from '@/components/BackButton';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledRNView = styled(RNView);
const StyledScrollView = styled(ScrollView);

interface RuleOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// List of rules
const ruleOptions: RuleOption[] = [
  { id: 'petsAllowed', name: 'Pets Allowed', icon: 'paw', description: 'Tenants can keep pets in the property' },
  { id: 'smokingAllowed', name: 'Smoking Allowed', icon: 'smoking', description: 'Smoking is permitted in the property' },
  { id: 'familiesOnly', name: 'Families Only', icon: 'users', description: 'Only for families, no bachelors' },
  { id: 'bachelorsAllowed', name: 'Bachelors Allowed', icon: 'user', description: 'Single tenants/bachelors are welcome' },
];

export default function RulesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyData?: string }>();
  
  // Initialize property data from params or default
  const initialPropertyData: PropertyData = params.propertyData 
    ? JSON.parse(params.propertyData as string) 
    : defaultPropertyData;
  
  const [propertyData, setPropertyData] = useState<PropertyData>(initialPropertyData);

  // Initialize selected rules
  const [selectedRules, setSelectedRules] = useState<Record<string, boolean>>(
    propertyData.rules || {}
  );

  const toggleRule = (id: string) => {
    setSelectedRules(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleNext = () => {
    // Update property data with selected rules
    const updatedPropertyData = {
      ...propertyData,
      rules: selectedRules
    };

    // Navigate to the next screen with updated property data
    router.navigate({
      pathname: '/add-property/availability',
      params: { propertyData: JSON.stringify(updatedPropertyData) }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StyledScrollView className="flex-1 px-4 bg-black">
        <StyledText className="text-4xl font-bold text-white my-6">
          Property rules
        </StyledText>
        
        {/* Progress indicator */}
        <LinearGradient
          colors={['#9370DB', '#4B0082']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-1 mb-6 rounded-full w-8/11"
        />
        
        <StyledText className="text-2xl font-bold text-white mb-4">
          Set your house rules
        </StyledText>
        
        <StyledText className="text-gray-400 mb-8">
          Let tenants know what is allowed and what isn't in your property
        </StyledText>
        
        {/* Rules selection */}
        <StyledView className="space-y-4 bg-transparent mb-8">
          {ruleOptions.map((rule) => (
            <StyledTouchableOpacity
              key={rule.id}
              className={`flex-row p-4 rounded-xl ${
                selectedRules[rule.id] 
                  ? 'bg-[#4B0082] border-2 border-purple-500' 
                  : 'bg-[#262626] border-2 border-transparent'
              }`}
              onPress={() => toggleRule(rule.id)}
            >
              <StyledRNView className="w-10 h-10 rounded-full bg-black bg-opacity-20 items-center justify-center mr-4">
                <FontAwesome 
                  name={rule.icon as any} 
                  size={20} 
                  color={selectedRules[rule.id] ? '#FFF' : '#AAA'} 
                />
              </StyledRNView>
              
              <StyledRNView className="flex-1">
                <StyledText className={`font-semibold ${selectedRules[rule.id] ? 'text-white' : 'text-gray-300'}`}>
                  {rule.name}
                </StyledText>
                <StyledText className={selectedRules[rule.id] ? 'text-gray-300' : 'text-gray-500'}>
                  {rule.description}
                </StyledText>
              </StyledRNView>
              
              {selectedRules[rule.id] && (
                <FontAwesome name="check-circle" size={24} color="#9370DB" />
              )}
            </StyledTouchableOpacity>
          ))}
        </StyledView>
      </StyledScrollView>
      
      {/* Navigation buttons */}
      <StyledRNView className="flex-row px-4  pt-4 bg-black">
        <StyledTouchableOpacity
          className="flex-1 py-4 rounded-full bg-white mr-2"
          onPress={handleBack}
        >
          <StyledText className="text-black text-center text-lg font-semibold">
            Back
          </StyledText>
        </StyledTouchableOpacity>
        
        <StyledTouchableOpacity
          className="flex-1 py-4 rounded-full bg-purple-600 ml-2"
          onPress={handleNext}
        >
          <StyledText className="text-white text-center text-lg font-semibold">
            Next
          </StyledText>
        </StyledTouchableOpacity>
      </StyledRNView>
    </StyledSafeAreaView>
  );
}
