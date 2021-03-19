import React from "react";
import { View, StyleSheet } from "react-native";
import SVG, { Line } from "react-native-svg";
import colors from "../../config/colors";

// const LINES_CONFIG = [
//   { from: "leftHip", to: "rightHip" },
//   { from: "leftKnee", to: "leftHip" },
//   { from: "leftKnee", to: "leftAnkle" },
//   { from: "rightKnee", to: "rightHip" },
//   { from: "rightKnee", to: "rightAnkle" },
//   { from: "leftShoulder", to: "rightShoulder" },
//   { from: "leftWrist", to: "leftElbow" },
//   { from: "leftElbow", to: "leftShoulder" },
//   { from: "rightWrist", to: "rightElbow" },
//   { from: "rightElbow", to: "rightShoulder" },
//   { from: "rightEye", to: "leftEye" },
// ];

const Lines = ({ pointPairs, color }) => {
  // const connectableLines = LINES_CONFIG.filter((line) => {
  //   return keyPoints[line.from] && keyPoints[line.to];
  // }).map((line) => ({
  //   from: keyPoints[line.from],
  //   to: keyPoints[line.to],
  // }));

  // console.warn("c", connectableLines);

  return (
    <View style={styles.container}>
      <SVG width="100%" height="83%">
        {pointPairs.map(([point1, point2]) => (
          <Line
            key={Math.random()}
            x1={point1.position.x}
            y1={point1.position.y}
            x2={point2.position.x}
            y2={point2.position.y}
            stroke={color}
            strokeWidth={3}
          />
        ))}
      </SVG>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // position: "absolute",
  },
});

export default Lines;
