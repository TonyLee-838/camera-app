import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, ClippingRectangle } from 'react-native';

import { KeypointDistanceMap, PoseData } from '../../types';
import { getDistancesOfKeypoints } from '../../helpers/getDistances';
import { getRegulatedImageKeypoints, getRegulatedUserKeypoints } from '../../helpers/regulatePosition';
import UserPose from './UserPose';
import ImagePose from './ImagePose';
import { Keypoint } from '../../models/posenet';
import Lines from './Lines';
import colors from '../../config/colors';
import DistanceLines from './DistanceLines';

interface PoseProps {
  imagePose: PoseData;
  userPose: PoseData;
  onFulfill: () => void;
  onNextFrame: () => Promise<void>;
}

const FULFILL_THRESHOLD = 22;
const REFRESH_TIME = 150;

const Pose = ({ imagePose, userPose, onNextFrame, onFulfill }: PoseProps) => {
  // const [isFulfilled, setIsFulfilled] = useState<boolean>(false);

  const deviceDimensions = useWindowDimensions();

  const userKeypoints = getRegulatedUserKeypoints(userPose, deviceDimensions);
  const imageKeypoints = getRegulatedImageKeypoints(imagePose, deviceDimensions);
  const { map: distanceMap, allFulfilled } = getDistancesOfKeypoints(
    imageKeypoints,
    userKeypoints,
    FULFILL_THRESHOLD
  );

  useEffect(() => {
    setInterval(async () => {
      await onNextFrame();
    }, REFRESH_TIME);
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
    height: '100%',
  },
});
export default Pose;
