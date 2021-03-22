import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Vector2D } from '@tensorflow-models/posenet/dist/types';

import colors from '../../config/colors';

interface KeyPointProps {
  position: Vector2D;
  color: string;
  radius?: number;
  transparent?: boolean;
  label: string;
}

const KeyPoint = ({ position, color, radius = 2.5, transparent = false, label }: KeyPointProps) => {
  const style = {
    top: position.y,
    left: position.x,
    backgroundColor: color,
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    opacity: transparent ? 0.5 : 1,
    transform: [{ translateX: -1 * radius }, { translateY: -1 * radius }],
  };

  return (
    <View style={{ ...styles.point, ...style }}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  point: {
    // backgroundColor: colors.primary,

    position: 'absolute',
  },
  label: {
    position: 'absolute',
    width: 100,
  },
});

export default KeyPoint;
