import React, { FC, ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';

import KeyPoint from './KeyPoint';
import colors from '../../config/colors';
import { KeypointDistanceMap, Keypoint } from '../../types';

interface ImagePoseProps {
  keypoints: Keypoint[];
  distanceMap: KeypointDistanceMap;
  fulfillThreshold: number;
}

const ImagePose = ({ keypoints, distanceMap, fulfillThreshold }: ImagePoseProps) => {
  const mapKeypoints = () => {
    return keypoints.map((point) => {
      const fulfilled = distanceMap[point.part];

      return (
        <KeyPoint
          radius={fulfillThreshold}
          position={point.position}
          key={`image-${point.part}`}
          color={fulfilled ? colors.success : colors.purple}
        />
      );
    });
  };

  return <View style={styles.container}>{mapKeypoints()}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 5,
  },
});
export default ImagePose;
