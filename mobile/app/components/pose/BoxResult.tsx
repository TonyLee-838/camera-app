import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SVG, { Rect } from 'react-native-svg';
import { Dimensions2D, BoxPosition } from '../../types';
import { regulateImageBoxPosition, regulateUserBoxPosition } from '../../helpers/regulatePosition';

const COCO_INPUT_WIDTH = 750;
const COCO_INPUT_HEIGHT = 1500;

interface BoxResultProps {
  position: BoxPosition;
  color: string;
  imageDimensions?: Dimensions2D;
}

const BoxResult = ({ position, color, imageDimensions }: BoxResultProps) => {
  const deviceDimensions: Dimensions2D = {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  };
  const target: 'image' | 'user' = imageDimensions.width ? 'image' : 'user';

  imageDimensions.width = imageDimensions.width || COCO_INPUT_WIDTH;
  imageDimensions.height = imageDimensions.height || COCO_INPUT_HEIGHT;

  const regulate = target === 'image' ? regulateImageBoxPosition : regulateUserBoxPosition;

  const { x, y, width, height } = regulate(position, imageDimensions, deviceDimensions);

  return (
    <View style={styles.container}>
      <SVG width='100%' height='81%'>
        <Rect x={x} y={y} width={width} height={height} fill={color} fillOpacity={0.4} />
      </SVG>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 5,
  },
});

export default BoxResult;
