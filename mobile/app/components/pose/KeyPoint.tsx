import React from "react";
import { View, StyleSheet } from "react-native";

import { Vector2D } from "@tensorflow-models/posenet/dist/types";

import colors from "../../config/colors";

interface KeyPointProps {
  position: Vector2D;
  color: string;
}

const KeyPoint = ({ position, color }: KeyPointProps) => {
  const style = {
    top: position.y,
    left: position.x,
    color,
  };

  return <View style={{ ...styles.point, ...style }}></View>;
};

const styles = StyleSheet.create({
  point: {
    backgroundColor: colors.primary,
    width: 3,
    height: 3,
    borderRadius: 3,
    position: "absolute",
    transform: [{ translateX: -3.5 }, { translateY: -3.5 }],
  },
  label: {
    position: "absolute",
    width: 100,
  },
});

export default KeyPoint;
