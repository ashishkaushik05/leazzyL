// CircularGradient.tsx
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Path, Stop } from 'react-native-svg';

const {  height } = Dimensions.get('window');

interface CircularGradientProps {
  /** Diameter of the semicircle in pixels */
  diameter?: number;
  /** Primary color for the inner part of the gradient */
  primaryColor?: string;
  /** Secondary color for the middle part of the gradient */
  secondaryColor?: string;
  /** Outer color for the edge of the gradient */
  outerColor?: string;
}

export default function CircularGradient({
  diameter = height*2,
  primaryColor = '#4c0480',
  secondaryColor = '#0a0012',
  outerColor = '#121212',
}: CircularGradientProps) {
  // Calculate the radius from diameter
  const radius = diameter / 2;
  
  return (
    <View style={styles.container}>
      <Svg height={radius} width={diameter} style={styles.topPosition}>
        <Defs>
          <RadialGradient
            id="grad"
            cx="50%"
            cy="0%"
            r="100%"
            fx="50%"
            fy="0%"
          >
            <Stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
            <Stop offset="70%" stopColor={secondaryColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={outerColor} stopOpacity="1" />
          </RadialGradient>
        </Defs>
        {/* Draw a semicircle path */}
        <Path
          d={`M 0 0 A ${radius} ${radius} 0 0 1 ${diameter} 0 L ${diameter} ${radius} L 0 ${radius} Z`}
          fill="url(#grad)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    alignItems: 'center',
  },
  topPosition: {
    position: 'absolute',
    top: 0,
  },
});
