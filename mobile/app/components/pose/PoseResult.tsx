import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { getAdjacentKeyPoints, getInputTensorDimensions } from '@tensorflow-models/posenet/dist/util';

import KeyPoint from './KeyPoint';
import Lines from './Lines';
import { regulateUserPosePosition, regulateImagePosePosition } from '../../helpers/regulatePosition';

import { Keypoint, Vector2D } from '@tensorflow-models/posenet/dist/types';
import { Dimensions2D, PoseData } from '../../types';

const CONTROL_SPACE_HEIGHT = 120;
const MIN_CONFIDENCE = 0.5;

// const regulatePosition = (
//   x: number,
//   y: number,
//   imageDimensions: Dimensions2D,
//   deviceDimensions: Dimensions2D
// ): Vector2D => {
//   return {
//     x: (x * deviceDimensions.width) / imageDimensions.width,
//     y:
//       (0.5 * deviceDimensions.height -
//         ((0.5 * imageDimensions.height - y) * deviceDimensions.width) / imageDimensions.width) *
//       0.83,
//     // y: 0.5 * imageDimensions.width,
//     // y: 0.5 * deviceDimensions.height * 0.83,
//   };
// };

interface PoseResultProps {
  poseData: PoseData;
  color: string;
  target: 'image' | 'user';
}

const PoseResult = ({ poseData, color, target }: PoseResultProps) => {
  const deviceDimensions: Dimensions2D = {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  };

  const imageDimensions: Dimensions2D = {
    width: poseData.width,
    height: poseData.height,
  };

  const regulate = target === 'image' ? regulateImagePosePosition : regulateUserPosePosition;

  const regulatedKeyPoints: Keypoint[] = poseData.keypoints.map(({ position, part, score }) => {
    return {
      position: regulate(position.x, position.y, imageDimensions, deviceDimensions),
      part,
      score,
    };
  });

  return (
    <View style={styles.container}>
      {regulatedKeyPoints.map((point) => (
        <KeyPoint position={point.position} key={point.part} color={color} />
      ))}
      {target === 'user' && (
        <Lines pointPairs={getAdjacentKeyPoints(regulatedKeyPoints, MIN_CONFIDENCE)} color={color} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 5,
    // opacity: 0.5,
    // backgroundColor: "red",
  },
});

export default PoseResult;
