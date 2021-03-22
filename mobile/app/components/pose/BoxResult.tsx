import React from "react";
import { View, StyleSheet } from "react-native";
import SVG, { Rect } from "react-native-svg";
import { regulatedBox } from "../../types";

interface BoxResultProps {
  position: regulatedBox;
  color: string;
}

const BoxResult = ({ position, color }: BoxResultProps) => {
  const { x, y, width, height } = position;
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
