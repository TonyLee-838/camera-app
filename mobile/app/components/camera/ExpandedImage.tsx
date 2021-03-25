import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import colors from '../../config/colors';
import BlurBackground from './BlurBackground';

interface ExpandedImageProps {
  expanded: boolean;
  imageUrl: string;
  locationX: number;
}

const ExpandedImage = ({ expanded, imageUrl, locationX }: ExpandedImageProps) => {
  const deviceDimensions = Dimensions.get('screen');

  return (
    <>
      <BlurBackground visible={expanded} />
      <Animatable.View
        duration={350}
        transition={['width', 'height', 'opacity', 'translateX', 'bottom']}
        style={[
          styles.imageContainer,
          {
            left: locationX,
            width: expanded ? deviceDimensions.width : 80,
            height: expanded ? deviceDimensions.height * 0.83 : 80,
            opacity: expanded ? 1 : 0,
            bottom: expanded ? 150 : 70,
            transform: expanded ? [{ translateX: -1 * locationX }] : null,
          },
        ]}
      >
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.imageInside} />}
      </Animatable.View>
    </>
  );
};

const styles = StyleSheet.create({
  cover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
    zIndex: 10,
  },
  imageContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageInside: {
    width: '80%',
    resizeMode: 'contain',
    height: '80%',
    opacity: 1,
    borderRadius: 15,
  },
});
export default ExpandedImage;
