import React from "react";
import { View, StyleSheet } from "react-native";
import SVG, { Rect } from "react-native-svg";
import colors from "../../config/colors";

const COCO_INPUT_WIDTH = 750;
const COCO_INPUT_HEIGHT = 1500;
const CONTROL_SPACE_HEIGHT = 120;

/**
 * @param {{ position:number[] }} props
 */
const BoxResult = ({ position }) => {
  const [deviceDimensions] = useState({
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  });

  const regulateBoxPosition = (position) => {
    const [x, y, width, height] = position;

    return {
      x: ((COCO_INPUT_WIDTH - x) * deviceDimensions.width) / COCO_INPUT_WIDTH,
      y:
        (deviceDimensions.height - CONTROL_SPACE_HEIGHT) / 2 -
        ((0.5 * COCO_INPUT_HEIGHT - y) * deviceDimensions.width) / COCO_INPUT_WIDTH,
      width: (width * deviceDimensions.width) / COCO_INPUT_WIDTH,
      height: (height * deviceDimensions.height) / COCO_INPUT_HEIGHT,
    };
  };

  const { x, y, width, height } = regulateBoxPosition(position);

  return (
    <View style={styles.container}>
      <SVG width="100%" height="83%">
        <Rect x={x} y={y} width={width} height={height} fill={colors.secondary} fillOpacity={0.4} />
      </SVG>
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

export default BoxResult;
