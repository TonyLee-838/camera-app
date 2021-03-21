import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import SVG, { Rect } from "react-native-svg";
import { Dimensions2D, BoxPosition } from "../../types";
import {
  regulateImageBoxPosition,
  regulateUserBoxPosition,
} from "../../helpers/regulatePosition";


interface BoxResultProps {
  position: BoxPosition;
  color: string;
  dimensions: Dimensions2D;
  target: 'user' | 'image';
}

const BoxResult = ({ position, color, dimensions, target }: BoxResultProps) => {
  const deviceDimensions: Dimensions2D = useWindowDimensions()

  const regulate =
    target === "image" ? regulateImageBoxPosition : regulateUserBoxPosition;

  const { x, y, width, height } = regulate(
    position,
    dimensions,
    deviceDimensions
  );
  if(target==='image'){
    console.warn('x,y,w,h:',`${x},${y},${width},${height}`)
  }

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
