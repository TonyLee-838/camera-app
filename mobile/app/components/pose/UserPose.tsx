import React from 'react';
import { View, StyleSheet } from 'react-native';

import { getAdjacentKeyPoints } from '../../tools/posenet';
import KeyPoint from './KeyPoint';
import Lines from './Lines';
import colors from '../../config/colors';
import { Keypoint } from '../../types';

const MIN_CONFIDENCE = 0.5;

interface UserPoseProps {
  keypoints: Keypoint[];
}

const UserPose = ({ keypoints }: UserPoseProps) => {
  return (
    <View style={styles.container}>
      {keypoints.map((point) => (
        <KeyPoint position={point.position} key={`user-${point.part}`} color={colors.secondary} />
      ))}
      <Lines pointPairs={getAdjacentKeyPoints(keypoints, MIN_CONFIDENCE)} color={colors.secondary} />
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

export default UserPose;
