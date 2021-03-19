import React from "react";
import { View, StyleSheet } from "react-native";

import colors from "../../config/colors";

const KeyPoint = ({ position, color }) => {
  const layout = {
    top: position.y,
    left: position.x,
    color,
  };

  return <View style={{ ...styles.point, ...layout }}></View>;
};

const styles = StyleSheet.create({
  point: {
    backgroundColor: colors.primary,
    width: 7,
    height: 7,
    borderRadius: 4,
    position: "absolute",
    transform: [{ translateX: -3.5 }, { translateY: -3.5 }],
  },
  label: {
    position: "absolute",
    width: 100,
  },
});

export default KeyPoint;
