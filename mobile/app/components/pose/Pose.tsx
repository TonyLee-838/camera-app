import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet, ClippingRectangle } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { PoseData } from '../../types';
import PoseModel from '../../tools/PoseModel';
import PoseResult from './PoseResult';
import colors from '../../config/colors';
import { getDistancesOfKeypoints } from '../../helpers/getDistances';

interface PoseProps {
  imagePose: PoseData;
  userPose: PoseData;
  onFulfill: () => void;
  onNextFrame: () => void;
}

const FULFILL_THRESHOLD = 10;

const Pose = ({ imagePose, userPose, onNextFrame, onFulfill }: PoseProps) => {
  const [isFulfilled, setIsFulfilled] = useState<boolean>(false);

  useEffect(() => {
    setInterval(() => {
      onNextFrame();

      const result = getDistancesOfKeypoints(imagePose, userPose, FULFILL_THRESHOLD);

      if (result.isFulfilled) {
        setIsFulfilled(true);
        onFulfill();
      }
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      {userPose && <PoseResult poseData={userPose} color={colors.primary} target='user' />}
      <PoseResult poseData={imagePose} color={colors.secondary} target='image' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
export default Pose;
