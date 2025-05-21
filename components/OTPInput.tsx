import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;
const CELL_SIZE = 50;

interface OTPInputProps {
  value: string;
  setValue: (value: string) => void;
  onComplete?: (code: string) => void;
}

export default function OTPInput({ value, setValue, onComplete }: OTPInputProps) {
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // Animation value for the active cell
  const animationsScale = React.useRef<Animated.Value[]>([]);

  React.useEffect(() => {
    animationsScale.current = Array(CELL_COUNT).fill(0).map(() => new Animated.Value(1));
  }, []);

  // Handle animation when a cell is filled
  React.useEffect(() => {
    if (value.length > 0) {
      const index = value.length - 1;
      if (index < CELL_COUNT) {
        Animated.sequence([
          Animated.timing(animationsScale.current[index], {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(animationsScale.current[index], {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [value]);

  // Handle completion callback
  React.useEffect(() => {
    if (value.length === CELL_COUNT && onComplete) {
      onComplete(value);
    }
  }, [value, onComplete]);

  const renderCell = ({ index, symbol, isFocused }: { index: number; symbol: string; isFocused: boolean }) => {
    const hasValue = Boolean(symbol);
    const scale = animationsScale.current[index];
    
    return (
      <Animated.View
        key={index}
        style={[
          styles.cell,
          hasValue && styles.filledCell,
          isFocused && styles.focusedCell,
          { transform: [{ scale }] },
        ]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        <Text style={[styles.cellText, hasValue && styles.filledCellText]}>
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.root}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoFocus={true}
        renderCell={renderCell}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginVertical: 20,
    width: '100%',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    lineHeight: CELL_SIZE - 5,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    margin: 5,
  },
  focusedCell: {
    borderColor: '#9370db',
    backgroundColor: '#362f40',
  },
  filledCell: {
    borderColor: '#9370db',
    backgroundColor: '#362f40',
  },
  cellText: {
    color: '#999',
    fontSize: 24,
    textAlign: 'center',
  },
  filledCellText: {
    color: 'white',
  },
});
