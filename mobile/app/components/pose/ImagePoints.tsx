import React from "react";
import { View, StyleSheet } from "react-native";

import KeyPoint from "./KeyPoint";
import colors from "../../config/colors";

interface ImagePointsProps {
  imagePointMap: any;
}

const ImagePoints = ({ imagePointMap }: ImagePointsProps) => {
  const drawPoints = () => {
    return Object.keys(imagePointMap).map((part) => {
      const item = imagePointMap[part];
      return (
        <KeyPoint
          position={item.position}
          key={`image-${part}`}
          color={colors.light}
          transparent
          radius={8}
        />
      );
    });
  };

  return <View style={styles.container}>{drawPoints()}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 5,
  },
});
export default ImagePoints;
