import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Vector2D } from '@tensorflow-models/posenet/dist/types';

import colors from '../../config/colors';

interface KeyPointProps {
  position: Vector2D;
  color: string;
  radius?: number;
  transparent?: boolean;
}

const KeyPoint = ({ position, color, radius = 5, transparent = false }: KeyPointProps) => {
  const style = {
    top: position.y,
    left: position.x,
    backgroundColor: color,
    width: radius,
    height: radius,
    borderRadius: radius / 2,
    opacity: transparent ? 0.5 : 1,
  };

  return <View style={{ ...styles.point, ...style }}></View>;
};

const styles = StyleSheet.create({
  point: {
    // backgroundColor: colors.primary,

    position: 'absolute',
    transform: [{ translateX: -3.5 }, { translateY: -3.5 }],
  },
  label: {
    position: 'absolute',
    width: 100,
  },
});

export default KeyPoint;
