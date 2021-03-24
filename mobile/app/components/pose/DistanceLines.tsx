import React from 'react';
import { View, StyleSheet } from 'react-native';
import SVG, { Line } from 'react-native-svg';

import colors from '../../config/colors';
import { getPointMap } from '../../helpers/getDistances';
import { Keypoint } from '../../models/posenet';
import { KeypointDistanceMap } from '../../types';

interface DistanceLinesProps {
  userKeypoints: Keypoint[];
  imageKeypoints: Keypoint[];
  distanceMap: KeypointDistanceMap;
}

const getBothExistAndFulfilledPoints = (userMap, imageMap, distanceMap) => {
  return Object.keys(userMap)
    .filter((key) => !!imageMap[key] && !distanceMap[key].fulfilled)
    .map((key) => ({
      point1: userMap[key],
      point2: imageMap[key],
    }));
};

const DistanceLines = ({ userKeypoints, imageKeypoints, distanceMap }: DistanceLinesProps) => {
  const userMap = getPointMap(userKeypoints);
  const imageMap = getPointMap(imageKeypoints);

  const pointPairs = getBothExistAndFulfilledPoints(userMap, imageMap, distanceMap);

  return (
    <View style={styles.container}>
      <SVG width='100%' height='100%'>
        {pointPairs.map(({ point1, point2 }, i) => (
          <Line
            key={`line-${i}`}
            x1={point1.position.x}
            y1={point1.position.y}
            x2={point2.position.x}
            y2={point2.position.y}
            stroke={colors.primary}
            strokeWidth={5}
          />
        ))}
      </SVG>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
export default DistanceLines;
