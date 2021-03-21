import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, ClippingRectangle } from 'react-native';

import { KeypointDistanceMap, PoseData } from '../../types';
import { getDistancesOfKeypoints } from '../../helpers/getDistances';
import { getRegulatedImageKeypoints, getRegulatedUserKeypoints } from '../../helpers/regulatePosition';
import UserPose from './UserPose';
import ImagePose from './ImagePose';

interface PoseProps {
  imagePose: PoseData;
  userPose: PoseData;
  onFulfill: () => void;
  onNextFrame: () => void;
}

const FULFILL_THRESHOLD = 15;
const REFRESH_TIME = 500;

const Pose = ({ imagePose, userPose, onNextFrame, onFulfill }: PoseProps) => {
  const [isFulfilled, setIsFulfilled] = useState<boolean>(false);
  const [distanceMap, setDistanceMap] = useState<KeypointDistanceMap>();

  const deviceDimensions = useWindowDimensions();

  const userKeypoints = getRegulatedUserKeypoints(userPose, deviceDimensions);
  const imageKeypoints = getRegulatedImageKeypoints(imagePose, deviceDimensions);

  useEffect(() => {
    setInterval(() => {
      onNextFrame();

      const result = getDistancesOfKeypoints(imageKeypoints, userKeypoints, FULFILL_THRESHOLD);

      setDistanceMap(result.map);
      if (result.allFulfilled) {
        setIsFulfilled(true);
        onFulfill();
      }
    }, REFRESH_TIME);
  }, []);

  return (
    <View style={styles.container}>
      {userPose && <UserPose keypoints={userKeypoints} />}
      <ImagePose
        keypoints={imageKeypoints}
        fulfillThreshold={FULFILL_THRESHOLD}
        distanceMap={distanceMap}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
export default Pose;
