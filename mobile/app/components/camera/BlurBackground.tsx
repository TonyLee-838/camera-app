import React, { useEffect, useState } from 'react';
import * as Animatable from 'react-native-animatable';

import { View, StyleSheet } from 'react-native';
import colors from '../../config/colors';

interface BlurBackgroundProps {
  visible: boolean;
}

const BlurBackground = ({ visible }: BlurBackgroundProps) => {
  return (
    <Animatable.View
      transition={['opacity', 'zIndex']}
      duration={550}
      style={[styles.cover, { opacity: visible ? 0.7 : 0.05, zIndex: visible ? 15 : 0 }]}
    />
  );
};

const styles = StyleSheet.create({
  cover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
  },
});
export default BlurBackground;
