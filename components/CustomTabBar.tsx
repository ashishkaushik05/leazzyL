import { View, TouchableOpacity, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import React from "react";
import { useColorScheme } from "./useColorScheme";
import { AntDesign, Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { styled } from 'nativewind';

// Create styled components
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

// Create animated styled components
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(StyledTouchableOpacity);
const AnimatedText = Animated.createAnimatedComponent(StyledText);

const PRIMARY_COLOR = "#2c1743";
const SECONDARY_COLOR = "#cfcaca";

const CustomNavBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <StyledView className="scale-105 absolute flex-row justify-center items-center bg-[#2c1743fa] w-4/5 self-center bottom-10 rounded-full px-3 py-4 shadow-lg">
      {state.routes.map((route, index) => {
        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify().mass(0.5)}
            key={route.key}
            onPress={onPress}
            className={`flex-row justify-center items-center h-9 px-3 rounded-2xl ${
              isFocused ? 'bg-[#cfcaca]' : 'bg-transparent'
            }`}
          >
            {getIconByRouteName(
              route.name,
              isFocused ? PRIMARY_COLOR : SECONDARY_COLOR
            )}
            {isFocused && (
              <AnimatedText
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                className="text-[#371757] ml-2 font-medium"
              >
                {label as string}
              </AnimatedText>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    </StyledView>
  );

  function getIconByRouteName(routeName: string, color: string) {
    switch (routeName) {
      case "index":
        return <Feather name="search" size={18} color={color} />;
      case "favorites":
        return <AntDesign name="heart" size={18} color={color} />;
      case "add":
        return <AntDesign name="plus" size={18} color={color} />;
      case "chats":
        return <Ionicons name="chatbubble-outline" size={18} color={color} />;
      case "profile": 
        return <FontAwesome6 name="circle-user" size={18} color={color} />;
      default:
        return <Feather name="home" size={18} color={color} />;
    }
  }
};


export default CustomNavBar;