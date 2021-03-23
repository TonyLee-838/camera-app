import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, ClippingRectangle } from 'react-native';

import { KeypointDistanceMap, PoseData } from '../../types';
import { getDistancesOfKeypoints } from '../../helpers/getDistances';
import { getRegulatedImageKeypoints, getRegulatedUserKeypoints } from '../../helpers/regulatePosition';
import UserPose from './UserPose';
import ImagePose from './ImagePose';
import { Keypoint } from '../../models/posenet';
import Lines from './UserLines';
import colors from '../../config/colors';
import DistanceLines from './DistanceLines';

interface PoseProps {
  imagePose: PoseData;
  userPose: PoseData;
  onFulfill: () => void;
  onNextFrame: () => Promise<void>;
}

const FULFILL_THRESHOLD = 60;
const REFRESH_TIME = 150;
let intervalId;

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
    intervalId = setInterval(async () => {
      await onNextFrame();
    }, REFRESH_TIME);
  }, []);

  useEffect(() => {
    if (allFulfilled) {
      clearInterval(intervalId)
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
