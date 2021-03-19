import React from "react";
import { View, StyleSheet } from "react-native";

import { getAdjacentKeyPoints } from "@tensorflow-models/posenet/dist/util";
import KeyPoint from "./KeyPoint";
import Lines from "./Lines";

const CONTROL_SPACE_HEIGHT = 120;

const regulatePosition = (x, y, imageDimensions, deviceDimensions) => {
  return {
    x: ((imageDimensions.width - x) * deviceDimensions.width) / imageDimensions.width,
    y:
      (deviceDimensions.height - CONTROL_SPACE_HEIGHT) / 2 -
      ((0.5 * imageDimensions.height - y) * deviceDimensions.width) / imageDimensions.width,
  };
};

/**
 *
 * @param {{ poseData:{
 * keypoints:{
 *   position:{x:number;y:number},
 *   part:string,
 *   score:number
 * }[],
 * width:number,
 * height:number
 * }}}} props
 * @returns
 */

const PoseResult = ({ poseData }) => {
  const deviceDimensions = {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  };

  const imageDimensions = {
    width: poseData.width,
    height: poseData.height,
  };

  const regulatedKeyPoints = poseData.keypoints.map(({ position, part }) => {
    return {
      position: regulatePosition(position.x, position.y, imageDimensions, deviceDimensions),
      part,
    };
  });

  const pointPairs = getAdjacentKeyPoints(regulatedKeyPoints, 0.5);

  return (
    <View style={styles.container}>
      {regulatedKeyPoints.map((point) => (
        <KeyPoint point={point.position} key={point.part} />
      ))}
      <Lines pointPairs={pointPairs} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "84%",
    zIndex: 5,
  },
});

export default PoseResult;
