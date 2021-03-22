import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, ClippingRectangle } from 'react-native';
import SVG, { Line } from 'react-native-svg';

import { KeypointDistanceMap, PoseData } from '../../types';
import { getDistancesOfKeypoints } from '../../helpers/getDistances';
import { getRegulatedImageKeypoints, getRegulatedUserKeypoints } from '../../helpers/regulatePosition';
import UserPose from './UserPose';
import ImagePose from './ImagePose';
import { Keypoint } from '../../models/posenet';
import Lines from './Lines';
import colors from '../../config/colors';

interface PoseProps {
  imagePose: PoseData;
  userPose: PoseData;
  onFulfill: () => void;
  onNextFrame: () => Promise<void>;
}

const FULFILL_THRESHOLD = 12;
const REFRESH_TIME = 500;

// const getPairs = (userKeypoints: Keypoint[], imageKeypoints: Keypoint[]) => {

//   const pairs: Keypoint[][] = Object.keys(p1).reduce((result, p1Key) => {
//     if (!p2[p1Key]) return result;

//     return [...result, [[p1[p1Key], p2[p1Key]]]];
//   }, []);

//   return pairs;
// };

const Pose = ({ imagePose, userPose, onNextFrame, onFulfill }: PoseProps) => {
  const [isFulfilled, setIsFulfilled] = useState<boolean>(false);

  const deviceDimensions = useWindowDimensions();

  const userKeypoints = getRegulatedUserKeypoints(userPose, deviceDimensions);
  const imageKeypoints = getRegulatedImageKeypoints(imagePose, deviceDimensions);
  const { map: distanceMap } = getDistancesOfKeypoints(imageKeypoints, userKeypoints, FULFILL_THRESHOLD);

  const p1: {
    [index: string]: Keypoint;
  } = userKeypoints.reduce((result, point) => {
    result[point.part] = point;
    return result;
  }, {});

  const p2: {
    [index: string]: Keypoint;
  } = imageKeypoints.reduce((result, point) => {
    result[point.part] = point;
    return result;
  }, {});

  const pairs = Object.keys(p1)
    .filter((key) => !!p2[key])
    .map((key) => ({
      point1: p1[key],
      point2: p2[key],
    }));

  useEffect(() => {
    setInterval(async () => {
      await onNextFrame();
    }, REFRESH_TIME);
  }, []);

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
      {pairs && (
        <View style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <SVG width='100%' height='100%'>
            {pairs.map(({ point1, point2 }, i) => (
              <Line
                key={`line-${i}`}
                x1={point1.position.x}
                y1={point1.position.y}
                x2={point2.position.x}
                y2={point2.position.y}
                stroke={colors.primary}
                strokeWidth={3}
              />
            ))}
          </SVG>
        </View>
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
