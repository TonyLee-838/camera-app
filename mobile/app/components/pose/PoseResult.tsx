import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { getAdjacentKeyPoints } from "@tensorflow-models/posenet/dist/util";

import KeyPoint from "./KeyPoint";
import Lines from "./Lines";

import { Vector2D } from "@tensorflow-models/posenet/dist/types";
import { Dimensions2D, PoseData } from "../../types";

const CONTROL_SPACE_HEIGHT = 120;
const MIN_CONFIDENCE = 0.5;

const regulatePosition = (
  x: number,
  y: number,
  imageDimensions: Dimensions2D,
  deviceDimensions: Dimensions2D
): Vector2D => {
  return {
    x: (x * deviceDimensions.width) / imageDimensions.width,
    y: ((y * deviceDimensions.height) / imageDimensions.height) * 0.83,
  };
};

interface PoseResultProps {
  poseData: PoseData;
  color: string;
}

const PoseResult = ({ poseData, color }: PoseResultProps) => {
  const deviceDimensions: Dimensions2D = {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  };

  const imageDimensions: Dimensions2D = {
    width: poseData.width,
    height: poseData.height,
  };

  const regulatedKeyPoints = poseData.keypoints.map(({ position, part, score }) => {
    return {
      position: regulatePosition(position.x, position.y, imageDimensions, deviceDimensions),
      part,
      score,
    };
  });

  const pointPairs = getAdjacentKeyPoints(regulatedKeyPoints, MIN_CONFIDENCE);

  return (
    <View style={styles.container}>
      {regulatedKeyPoints.map((point) => (
        <KeyPoint position={point.position} key={point.part} color={color} />
      ))}
      <Lines pointPairs={pointPairs} color={color} />
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
