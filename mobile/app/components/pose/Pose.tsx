import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

import UserPose from './UserPose';
import ImagePose from './ImagePose';
import DistanceLines from './DistanceLines';
import { getDistancesOfKeypoints } from '../../helpers/getDistances';
import { getRegulatedImageKeypoints, getRegulatedUserKeypoints } from '../../helpers/regulatePosition';

import { PoseData } from '../../types';

interface PoseProps {
  imagePose: PoseData;
  userPose: PoseData;
  onFulfill: () => void;
  onNextFrame: () => Promise<void>;
}

const FULFILL_THRESHOLD = 30;
const REFRESH_TIME = 150;

const Pose = ({ imagePose, userPose, onNextFrame, onFulfill }: PoseProps) => {
  const deviceDimensions = useWindowDimensions();

  const userKeypoints = getRegulatedUserKeypoints(userPose, deviceDimensions);
  const imageKeypoints = getRegulatedImageKeypoints(imagePose, deviceDimensions);
  const { map: distanceMap, allFulfilled } = getDistancesOfKeypoints(
    imageKeypoints,
    userKeypoints,
    FULFILL_THRESHOLD
  );

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await onNextFrame();
    }, REFRESH_TIME);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (allFulfilled) {
      onFulfill();
    }
  }, [allFulfilled]);

  return (
    <View style={styles.container}>
      {userKeypoints && <UserPose keypoints={userKeypoints} />}
      {imageKeypoints && (
        <ImagePose
          keypoints={imageKeypoints}
          fulfillThreshold={FULFILL_THRESHOLD}
          distanceMap={distanceMap}
        />
      )}
      {userKeypoints && imageKeypoints && (
        <DistanceLines
          userKeypoints={userKeypoints}
          imageKeypoints={imageKeypoints}
          distanceMap={distanceMap}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '83%',
    overflow: 'hidden',
  },
});
export default Pose;
