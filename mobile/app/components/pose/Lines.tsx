import React from "react";
import { View, StyleSheet } from "react-native";
import SVG, { Line } from "react-native-svg";
import { CheckProgress } from "../../types/index";

interface ImageLinesProps {
  pointMap: any;
  checkProgress: CheckProgress;
  color: string;
}

const legsPointPairs = [
  ["leftHip", "leftKnee"],
  ["leftKnee", "leftAnkle"],
  ["rightHip", "rightKnee"],
  ["rightKnee", "rightAnkle"],
];

const armsPointPairs = [
  ["leftShoulder", "leftElbow"],
  ["leftElbow", "leftWrist"],
  ["rightShoulder", "rightElbow"],
  ["rightElbow", "rightWrist"],
];

const headPointPairs = [
  ["leftEye", "nose"],
  ["nose", "rightEye"],
];

const POINT_PAIRS = {
  legs: legsPointPairs,
  arms: armsPointPairs,
  head: headPointPairs,
};

const ImageLines = ({ pointMap, checkProgress, color }: ImageLinesProps) => {
  const pointPairs = POINT_PAIRS[checkProgress];

  return (
    <View style={styles.container}>
      <SVG width="100%" height="100%">
        {pointPairs.map(
          ([point1, point2], i) =>
            pointMap[point1] &&
            pointMap[point2] && (
              <Line
                key={`line-${i}`}
                x1={pointMap[point1].position.x}
                y1={pointMap[point1].position.y}
                x2={pointMap[point2].position.x}
                y2={pointMap[point2].position.y}
                stroke={color}
                strokeWidth={15}
                strokeOpacity={0.5}
              />
            )
        )}
      </SVG>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 5,
  },
});

export default ImageLines;
