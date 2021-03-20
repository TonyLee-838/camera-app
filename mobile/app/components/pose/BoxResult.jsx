import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import SVG, { Rect } from "react-native-svg";

const COCO_INPUT_WIDTH = 750;
const COCO_INPUT_HEIGHT = 1500;
const CONTROL_SPACE_HEIGHT = 120;

/**
 * @param {{ position:number[] }} props
 */
const BoxResult = ({ position, color, imageDimensions = {} }) => {
  const [deviceDimensions] = useState({
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  });

  const imageWidth = imageDimensions.width || COCO_INPUT_WIDTH;
  const imageHeight = imageDimensions.height || COCO_INPUT_HEIGHT;

  const regulateBoxPosition = (position) => {
    const [x, y, width, height] = position;

    if (imageDimensions.width) {
      return {
        x: (x / imageWidth) * deviceDimensions.width,
        y: (y / imageHeight) * deviceDimensions.height * 0.82,
        width: (width * deviceDimensions.width) / imageWidth,
        height: ((height * deviceDimensions.height) / imageHeight) * 0.82,
      };
    } else {
      return {
        x: ((imageWidth - x) * deviceDimensions.width) / imageWidth,
        y:
          (deviceDimensions.height - CONTROL_SPACE_HEIGHT) / 2 -
          ((0.5 * imageHeight - y) * deviceDimensions.width) / imageWidth,
        width: (-1 * width * deviceDimensions.width) / imageWidth,
        height: (height * deviceDimensions.height) / imageHeight,
      };
    }
  };

  const { x, y, width, height } = regulateBoxPosition(position);
  
  return (
    <View style={styles.container}>
      <SVG width="100%" height="81%">
        <Rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          fillOpacity={0.4}
        />
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

export default BoxResult;
